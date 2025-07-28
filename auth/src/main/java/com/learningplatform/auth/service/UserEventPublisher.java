package com.learningplatform.auth.service;

import com.learningplatform.auth.config.RabbitMQConfig;
import com.learningplatform.auth.entity.User;
import com.learningplatform.auth.event.UserEventSimple;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserEventPublisher {
    
    private static final Logger log = LoggerFactory.getLogger(UserEventPublisher.class);
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    public void publishUserCreated(User user) {
        try {
            UserEventSimple event = UserEventSimple.userCreated(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getFullName(),
                    user.getRole().name()
            );
            
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.USER_EXCHANGE,
                    RabbitMQConfig.USER_CREATED_KEY,
                    event
            );
            
            log.info("Published USER_CREATED event for user: {} (ID: {})", user.getUsername(), user.getId());
        } catch (Exception e) {
            log.error("Failed to publish USER_CREATED event for user: {} (ID: {})", user.getUsername(), user.getId(), e);
        }
    }
    
    public void publishUserUpdated(User user) {
        try {
            UserEventSimple event = UserEventSimple.userUpdated(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getFullName(),
                    user.getBio(),
                    user.getAvatarUrl(),
                    user.getRole().name(),
                    user.isEnabled(),
                    user.isVerified(),
                    1L // Version tracking would be implemented with actual versioning
            );
            
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.USER_EXCHANGE,
                    RabbitMQConfig.USER_UPDATED_KEY,
                    event
            );
            
            log.info("Published USER_UPDATED event for user: {} (ID: {})", user.getUsername(), user.getId());
        } catch (Exception e) {
            log.error("Failed to publish USER_UPDATED event for user: {} (ID: {})", user.getUsername(), user.getId(), e);
        }
    }
    
    public void publishUserDeleted(User user) {
        try {
            UserEventSimple event = UserEventSimple.userDeleted(user.getId(), user.getUsername());
            
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.USER_EXCHANGE,
                    RabbitMQConfig.USER_DELETED_KEY,
                    event
            );
            
            log.info("Published USER_DELETED event for user: {} (ID: {})", user.getUsername(), user.getId());
        } catch (Exception e) {
            log.error("Failed to publish USER_DELETED event for user: {} (ID: {})", user.getUsername(), user.getId(), e);
        }
    }
    
    public void publishUserRoleChanged(User user, String oldRole) {
        try {
            UserEventSimple event = UserEventSimple.userRoleChanged(
                    user.getId(),
                    user.getUsername(),
                    user.getRole().name(),
                    1L
            );
            
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.USER_EXCHANGE,
                    RabbitMQConfig.USER_ROLE_CHANGED_KEY,
                    event
            );
            
            log.info("Published USER_ROLE_CHANGED event for user: {} (ID: {}) from {} to {}", 
                    user.getUsername(), user.getId(), oldRole, user.getRole().name());
        } catch (Exception e) {
            log.error("Failed to publish USER_ROLE_CHANGED event for user: {} (ID: {})", user.getUsername(), user.getId(), e);
        }
    }
}