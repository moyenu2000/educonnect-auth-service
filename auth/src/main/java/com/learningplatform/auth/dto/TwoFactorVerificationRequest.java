
// TwoFactorVerificationRequest.java
package com.learningplatform.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TwoFactorVerificationRequest {
    @NotBlank(message = "Temp token is required")
    private String tempToken;
    
    @NotBlank(message = "2FA code is required")
    @Size(min = 6, max = 6, message = "2FA code must be 6 digits")
    private String code;
}