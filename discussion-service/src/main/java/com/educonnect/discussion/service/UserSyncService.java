package com.educonnect.discussion.service;

import com.educonnect.discussion.entity.User;
import com.educonnect.discussion.security.UserPrincipal;

public interface UserSyncService {
    User getOrCreateUser(Long userId, UserPrincipal userPrincipal);
    User getOrCreateUser(Long userId);
}