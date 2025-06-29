
// DisableTwoFactorRequest.java
package com.learningplatform.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DisableTwoFactorRequest {
    @NotBlank(message = "Password is required")
    private String password;
}
