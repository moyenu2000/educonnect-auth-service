package com.educonnect.discussion.event;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public class UserEventSimple {
    
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
    
    // Default constructor
    public UserEventSimple() {}
    
    // Getters and setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public Boolean getIsEnabled() { return isEnabled; }
    public void setIsEnabled(Boolean isEnabled) { this.isEnabled = isEnabled; }
    
    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }
    
    public EventType getEventType() { return eventType; }
    public void setEventType(EventType eventType) { this.eventType = eventType; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
}