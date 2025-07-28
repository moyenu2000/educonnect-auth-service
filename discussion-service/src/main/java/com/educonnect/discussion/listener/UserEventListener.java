package com.educonnect.discussion.listener;

import com.educonnect.discussion.config.RabbitMQConfig;
import com.educonnect.discussion.entity.User;
import com.educonnect.discussion.event.UserEventSimple;
import com.educonnect.discussion.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
public class UserEventListener {
    
    private static final Logger log = LoggerFactory.getLogger(UserEventListener.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @RabbitListener(queues = RabbitMQConfig.USER_SYNC_QUEUE_DISCUSSION)
    @Transactional
    public void handleUserEvent(UserEventSimple event) {
        try {
            log.info("Received user event: {} for user ID: {}", event.getEventType(), event.getUserId());
            
            switch (event.getEventType()) {
                case USER_CREATED:
                    handleUserCreated(event);
                    break;
                case USER_UPDATED:
                    handleUserUpdated(event);
                    break;
                case USER_DELETED:
                    handleUserDeleted(event);
                    break;
                case USER_ROLE_CHANGED:
                    handleUserRoleChanged(event);
                    break;
                default:
                    log.warn("Unknown user event type: {}", event.getEventType());
            }
        } catch (Exception e) {
            log.error("Error processing user event: {} for user ID: {}", event.getEventType(), event.getUserId(), e);
            throw e; // Rethrow to trigger retry mechanism
        }
    }
    
    private void handleUserCreated(UserEventSimple event) {
        // Check if user already exists (idempotency)
        if (userRepository.existsById(event.getUserId())) {
            log.info("User with ID {} already exists, updating instead", event.getUserId());
            handleUserUpdated(event);
            return;
        }
        
        User user = new User();
        user.setId(event.getUserId());
        user.setUsername(event.getUsername());
        // Handle null email by providing a default
        user.setEmail(event.getEmail() != null ? event.getEmail() : event.getUsername() + "@placeholder.local");
        user.setFullName(event.getFullName());
        user.setBio(event.getBio());
        user.setAvatarUrl(event.getAvatarUrl());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        userRepository.save(user);
        log.info("Created user in Discussion Service: {} (ID: {})", user.getUsername(), user.getId());
    }
    
    private void handleUserUpdated(UserEventSimple event) {
        userRepository.findById(event.getUserId()).ifPresentOrElse(
                user -> {
                    // Update user information
                    user.setUsername(event.getUsername());
                    // Handle null email by keeping existing or providing default
                    if (event.getEmail() != null) {
                        user.setEmail(event.getEmail());
                    } else if (user.getEmail() == null) {
                        user.setEmail(event.getUsername() + "@placeholder.local");
                    }
                    user.setFullName(event.getFullName());
                    user.setBio(event.getBio());
                    user.setAvatarUrl(event.getAvatarUrl());
                    user.setUpdatedAt(LocalDateTime.now());
                    
                    userRepository.save(user);
                    log.info("Updated user in Discussion Service: {} (ID: {})", user.getUsername(), user.getId());
                },
                () -> {
                    log.warn("User with ID {} not found for update, creating new user", event.getUserId());
                    handleUserCreated(event);
                }
        );
    }
    
    private void handleUserDeleted(UserEventSimple event) {
        userRepository.findById(event.getUserId()).ifPresentOrElse(
                user -> {
                    // Soft delete - we don't actually delete the user due to referential integrity
                    // Instead, we could mark them as inactive or keep the record for historical data
                    log.info("User deletion event received for user: {} (ID: {}). Keeping record for data integrity.", 
                            user.getUsername(), user.getId());
                    // userRepository.delete(user); // Uncomment if hard delete is desired
                },
                () -> log.warn("User with ID {} not found for deletion", event.getUserId())
        );
    }
    
    private void handleUserRoleChanged(UserEventSimple event) {
        userRepository.findById(event.getUserId()).ifPresentOrElse(
                user -> {
                    // Note: Discussion service doesn't store role, but we log the change
                    log.info("User role changed for user: {} (ID: {}) to role: {}", 
                            user.getUsername(), user.getId(), event.getRole());
                    user.setUpdatedAt(LocalDateTime.now());
                    userRepository.save(user);
                },
                () -> {
                    log.warn("User with ID {} not found for role change, creating new user", event.getUserId());
                    handleUserCreated(event);
                }
        );
    }
}