
// UpdateRoleRequest.java
package com.learningplatform.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateRoleRequest {
    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(STUDENT|QUESTION_SETTER|ADMIN)$", message = "Invalid role")
    private String role;
}
