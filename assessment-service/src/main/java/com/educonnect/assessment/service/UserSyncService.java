package com.educonnect.assessment.service;

import com.educonnect.assessment.entity.User;
import com.educonnect.assessment.security.UserPrincipal;

import java.util.Optional;

public interface UserSyncService {
    
    /**
     * Get or create user from UserPrincipal (JWT token data)
     * @param userId The user ID from JWT
     * @param userPrincipal The user principal containing user data
     * @return The user entity
     */
    User getOrCreateUser(Long userId, UserPrincipal userPrincipal);
    
    /**
     * Get or create user with minimal data (fallback method)
     * @param userId The user ID
     * @return The user entity
     */
    User getOrCreateUser(Long userId);
    
    /**
     * Update user information
     * @param userId The user ID
     * @param userPrincipal The updated user data
     * @return The updated user entity
     */
    User updateUser(Long userId, UserPrincipal userPrincipal);
    
    /**
     * Get user by ID
     * @param userId The user ID
     * @return Optional user entity
     */
    Optional<User> getUser(Long userId);
    
    /**
     * Check if user exists
     * @param userId The user ID
     * @return true if user exists
     */
    boolean userExists(Long userId);
    
    /**
     * Sync user data from Auth Service
     * @param userId The user ID to sync
     * @return The synced user entity
     */
    User syncUserFromAuthService(Long userId);
    
    /**
     * Mark user as inactive (soft delete)
     * @param userId The user ID
     */
    void deactivateUser(Long userId);
}