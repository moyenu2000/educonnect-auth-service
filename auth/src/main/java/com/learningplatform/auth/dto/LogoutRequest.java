
// LogoutRequest.java
package com.learningplatform.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LogoutRequest {
    @NotBlank(message = "Refresh token is required")
    private String refreshToken;
}
