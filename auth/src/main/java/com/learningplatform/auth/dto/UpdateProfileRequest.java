

// UpdateProfileRequest.java
package com.learningplatform.auth.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String fullName;
    private String bio;
    private String avatarUrl;
}
