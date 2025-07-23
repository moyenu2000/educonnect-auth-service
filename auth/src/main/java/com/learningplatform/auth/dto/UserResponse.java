
// UserResponse.java
package com.learningplatform.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String bio;
    private String avatarUrl;
    private String role;
    private boolean enabled;
    private boolean verified;
    private boolean twoFactorEnabled;
    private LocalDateTime createdAt;
}
