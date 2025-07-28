package com.educonnect.assessment.listener;

import com.educonnect.assessment.config.RabbitMQConfig;
import com.educonnect.assessment.entity.User;
import com.educonnect.assessment.event.UserEventSimple;
import com.educonnect.assessment.repository.UserRepository;
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
    
    @RabbitListener(queues = RabbitMQConfig.USER_SYNC_QUEUE_ASSESSMENT)
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
            // Don't rethrow constraint violations - they're handled gracefully above
            if (e.getMessage() != null && e.getMessage().contains("duplicate key")) {
                log.warn("Constraint violation handled gracefully for user event: {} for user ID: {}", 
                    event.getEventType(), event.getUserId());
                return;
            }
            throw e; // Rethrow other exceptions to trigger retry mechanism
        }
    }
    
    private void handleUserCreated(UserEventSimple event) {
        // Check if user already exists by ID or email (idempotency)
        if (userRepository.existsById(event.getUserId())) {
            log.info("User with ID {} already exists, updating instead", event.getUserId());
            handleUserUpdated(event);
            return;
        }
        
        // Also check by email to prevent constraint violations
        if (event.getEmail() != null && userRepository.existsByEmail(event.getEmail())) {
            log.info("User with email {} already exists, skipping creation", event.getEmail());
            return;
        }
        
        User user = new User();
        user.setId(event.getUserId());
        user.setUsername(event.getUsername());
        user.setEmail(event.getEmail());
        user.setFullName(event.getFullName());
        user.setBio(event.getBio());
        user.setAvatarUrl(event.getAvatarUrl());
        user.setRole(event.getRole());
        user.setIsActive(event.getIsEnabled() != null ? event.getIsEnabled() : true);
        user.setSyncedAt(LocalDateTime.now());
        user.setSyncVersion(event.getVersion() != null ? event.getVersion() : 1L);
        
        try {
            userRepository.save(user);
            log.info("Created user in Assessment Service: {} (ID: {})", user.getUsername(), user.getId());
        } catch (Exception e) {
            // Handle constraint violations gracefully
            if (e.getMessage() != null && e.getMessage().contains("duplicate key")) {
                log.warn("Duplicate key constraint violation for user {} (ID: {}), likely a race condition. Skipping creation.", 
                    event.getUsername(), event.getUserId());
                return;
            }
            log.error("Failed to create user {} (ID: {})", event.getUsername(), event.getUserId(), e);
            throw e;
        }
    }
    
    private void handleUserUpdated(UserEventSimple event) {
        userRepository.findById(event.getUserId()).ifPresentOrElse(
                user -> {
                    // Update user information
                    user.setUsername(event.getUsername());
                    user.setEmail(event.getEmail());
                    user.setFullName(event.getFullName());
                    user.setBio(event.getBio());
                    user.setAvatarUrl(event.getAvatarUrl());
                    user.setRole(event.getRole());
                    
                    if (event.getIsEnabled() != null) {
                        user.setIsActive(event.getIsEnabled());
                    }
                    
                    user.setSyncedAt(LocalDateTime.now());
                    if (event.getVersion() != null) {
                        user.setSyncVersion(event.getVersion());
                    }
                    
                    try {
                        userRepository.save(user);
                        log.info("Updated user in Assessment Service: {} (ID: {})", user.getUsername(), user.getId());
                    } catch (Exception e) {
                        // Handle constraint violations gracefully
                        if (e.getMessage() != null && e.getMessage().contains("duplicate key")) {
                            log.warn("Duplicate key constraint violation during update for user {} (ID: {}), skipping update.", 
                                user.getUsername(), user.getId());
                            return;
                        }
                        log.error("Failed to update user {} (ID: {})", user.getUsername(), user.getId(), e);
                        throw e;
                    }
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
                    // Soft delete - mark as inactive instead of hard delete
                    user.setIsActive(false);
                    user.setSyncedAt(LocalDateTime.now());
                    userRepository.save(user);
                    
                    log.info("User deactivated in Assessment Service: {} (ID: {})", user.getUsername(), user.getId());
                },
                () -> log.warn("User with ID {} not found for deletion", event.getUserId())
        );
    }
    
    private void handleUserRoleChanged(UserEventSimple event) {
        userRepository.findById(event.getUserId()).ifPresentOrElse(
                user -> {
                    String oldRole = user.getRole();
                    user.setRole(event.getRole());
                    user.setSyncedAt(LocalDateTime.now());
                    if (event.getVersion() != null) {
                        user.setSyncVersion(event.getVersion());
                    }
                    
                    userRepository.save(user);
                    log.info("User role changed in Assessment Service: {} (ID: {}) from {} to {}", 
                            user.getUsername(), user.getId(), oldRole, event.getRole());
                },
                () -> {
                    log.warn("User with ID {} not found for role change, creating new user", event.getUserId());
                    handleUserCreated(event);
                }
        );
    }
}