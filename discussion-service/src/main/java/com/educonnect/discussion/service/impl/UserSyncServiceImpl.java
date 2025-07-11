package com.educonnect.discussion.service.impl;

import com.educonnect.discussion.entity.User;
import com.educonnect.discussion.repository.UserRepository;
import com.educonnect.discussion.security.UserPrincipal;
import com.educonnect.discussion.service.UserSyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class UserSyncServiceImpl implements UserSyncService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User getOrCreateUser(Long userId, UserPrincipal userPrincipal) {
        return userRepository.findById(userId)
                .orElseGet(() -> createUserFromPrincipal(userPrincipal));
    }

    @Override
    public User getOrCreateUser(Long userId) {
        return userRepository.findById(userId)
                .orElseGet(() -> createUserWithMinimalInfo(userId));
    }

    private User createUserFromPrincipal(UserPrincipal userPrincipal) {
        User user = new User();
        user.setId(userPrincipal.getId());
        user.setUsername(userPrincipal.getUsername());
        user.setEmail(userPrincipal.getEmail());
        user.setFullName(userPrincipal.getFullName());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }

    private User createUserWithMinimalInfo(Long userId) {
        User user = new User();
        user.setId(userId);
        user.setUsername("user" + userId);
        user.setEmail("user" + userId + "@example.com");
        user.setFullName("User " + userId);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }
}