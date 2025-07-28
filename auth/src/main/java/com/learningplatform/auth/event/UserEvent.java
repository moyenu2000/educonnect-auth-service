package com.learningplatform.auth.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEvent {
    
    public enum EventType {
        USER_CREATED,
        USER_UPDATED,
        USER_DELETED,
        USER_ACTIVATED,
        USER_DEACTIVATED,
        USER_ROLE_CHANGED,
        USER_PASSWORD_CHANGED
    }
    
    private Long userId;
    private String username;
    private String email;
    private String fullName;
    private String bio;
    private String avatarUrl;
    private String role;
    private Boolean isEnabled;
    private Boolean isVerified;
    private EventType eventType;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;
    
    private String source = "auth-service";
    private Long version;
    
    public static UserEvent userCreated(Long userId, String username, String email, String fullName, String role) {
        return UserEvent.builder()
                .userId(userId)
                .username(username)
                .email(email)
                .fullName(fullName)
                .role(role)
                .eventType(EventType.USER_CREATED)
                .timestamp(LocalDateTime.now())
                .version(1L)
                .build();
    }
    
    public static UserEvent userUpdated(Long userId, String username, String email, String fullName, String bio, String avatarUrl, String role, Boolean isEnabled, Boolean isVerified, Long version) {
        return UserEvent.builder()
                .userId(userId)
                .username(username)
                .email(email)
                .fullName(fullName)
                .bio(bio)
                .avatarUrl(avatarUrl)
                .role(role)
                .isEnabled(isEnabled)
                .isVerified(isVerified)
                .eventType(EventType.USER_UPDATED)
                .timestamp(LocalDateTime.now())
                .version(version)
                .build();
    }
    
    public static UserEvent userDeleted(Long userId, String username) {
        return UserEvent.builder()
                .userId(userId)
                .username(username)
                .eventType(EventType.USER_DELETED)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    public static UserEvent userRoleChanged(Long userId, String username, String newRole, Long version) {
        return UserEvent.builder()
                .userId(userId)
                .username(username)
                .role(newRole)
                .eventType(EventType.USER_ROLE_CHANGED)
                .timestamp(LocalDateTime.now())
                .version(version)
                .build();
    }
}