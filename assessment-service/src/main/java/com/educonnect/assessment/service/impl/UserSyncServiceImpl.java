package com.educonnect.assessment.service.impl;

import com.educonnect.assessment.entity.User;
import com.educonnect.assessment.repository.UserRepository;
import com.educonnect.assessment.security.UserPrincipal;
import com.educonnect.assessment.service.UserSyncService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class UserSyncServiceImpl implements UserSyncService {
    
    private static final Logger log = LoggerFactory.getLogger(UserSyncServiceImpl.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public User getOrCreateUser(Long userId, UserPrincipal userPrincipal) {
        log.debug("Getting or creating user with ID: {} and principal data", userId);
        
        Optional<User> existingUser = userRepository.findById(userId);
        
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            // Update with latest information from JWT
            updateUserFromPrincipal(user, userPrincipal);
            log.debug("Updated existing user: {}", user.getUsername());
            return userRepository.save(user);
        } else {
            // Create new user from JWT data
            User newUser = createUserFromPrincipal(userId, userPrincipal);
            log.info("Created new user: {} with ID: {}", newUser.getUsername(), userId);
            return userRepository.save(newUser);
        }
    }
    
    @Override
    public User getOrCreateUser(Long userId) {
        log.debug("Getting or creating user with ID: {} (minimal data)", userId);
        
        Optional<User> existingUser = userRepository.findById(userId);
        
        if (existingUser.isPresent()) {
            log.debug("Found existing user with ID: {}", userId);
            return existingUser.get();
        } else {
            // Create placeholder user
            User newUser = new User();
            newUser.setId(userId);
            newUser.setUsername("user_" + userId);
            newUser.setEmail("user" + userId + "@example.com");
            newUser.setFullName("User " + userId);
            newUser.setBio("Assessment service user");
            newUser.setRole("STUDENT");
            newUser.setIsActive(true);
            newUser.setSyncedAt(LocalDateTime.now());
            
            log.info("Created placeholder user with ID: {}", userId);
            return userRepository.save(newUser);
        }
    }
    
    @Override
    public User updateUser(Long userId, UserPrincipal userPrincipal) {
        log.debug("Updating user with ID: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
        updateUserFromPrincipal(user, userPrincipal);
        user.setSyncedAt(LocalDateTime.now());
        user.setSyncVersion(user.getSyncVersion() + 1);
        
        return userRepository.save(user);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<User> getUser(Long userId) {
        return userRepository.findActiveById(userId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean userExists(Long userId) {
        return userRepository.existsById(userId);
    }
    
    @Override
    public User syncUserFromAuthService(Long userId) {
        // This would typically make an HTTP call to Auth Service
        // For now, we'll just update the sync timestamp
        log.debug("Syncing user from Auth Service: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElse(getOrCreateUser(userId));
        
        user.setSyncedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
    
    @Override
    public void deactivateUser(Long userId) {
        log.info("Deactivating user with ID: {}", userId);
        
        userRepository.findById(userId).ifPresent(user -> {
            user.setIsActive(false);
            user.setSyncedAt(LocalDateTime.now());
            userRepository.save(user);
        });
    }
    
    private User createUserFromPrincipal(Long userId, UserPrincipal userPrincipal) {
        User user = new User();
        user.setId(userId);
        user.setUsername(userPrincipal.getUsername());
        user.setEmail(userPrincipal.getEmail());
        user.setFullName(userPrincipal.getFullName() != null ? userPrincipal.getFullName() : userPrincipal.getUsername());
        user.setRole(userPrincipal.getRole());
        user.setIsActive(true);
        user.setSyncedAt(LocalDateTime.now());
        return user;
    }
    
    private void updateUserFromPrincipal(User user, UserPrincipal userPrincipal) {
        user.setUsername(userPrincipal.getUsername());
        user.setEmail(userPrincipal.getEmail());
        
        if (userPrincipal.getFullName() != null) {
            user.setFullName(userPrincipal.getFullName());
        }
        
        if (userPrincipal.getRole() != null) {
            user.setRole(userPrincipal.getRole());
        }
        
        user.setSyncedAt(LocalDateTime.now());
    }
}