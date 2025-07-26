package com.educonnect.assessment.controller;

import com.educonnect.assessment.entity.User;
import com.educonnect.assessment.repository.UserRepository;
import com.educonnect.assessment.security.JwtUtilsFixed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    @Qualifier("jwtUtilsFixed")
    private JwtUtilsFixed jwtUtils;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/jwt-config")
    public ResponseEntity<String> testJwtConfig() {
        try {
            // Try to validate a dummy token to test if JWT configuration works
            String testToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0IiwiaWF0IjoxNjQwOTk1MjAwLCJleHAiOjE2NDA5OTg4MDB9.test";
            boolean result = jwtUtils.validateJwtToken(testToken);
            return ResponseEntity.ok("JWT Config Test - Validation attempt completed (expected to fail): " + result);
        } catch (Exception e) {
            return ResponseEntity.ok("JWT Config Error: " + e.getMessage());
        }
    }

    @GetMapping("/public")
    public ResponseEntity<String> publicEndpoint() {
        return ResponseEntity.ok("Public test endpoint working");
    }
    
    @PostMapping("/create-admin")
    public ResponseEntity<String> createAdmin(@RequestParam(defaultValue = "tech_admin") String username) {
        try {
            // Check if admin already exists
            if (userRepository.findByUsername(username).isPresent()) {
                return ResponseEntity.ok("Admin user '" + username + "' already exists");
            }
            
            // Create admin user
            User admin = new User();
            admin.setId(1L); // Fixed ID for admin
            admin.setUsername(username);
            admin.setEmail(username + "@educonnect.com");
            admin.setFullName("System Administrator");
            admin.setRole("ADMIN");
            admin.setIsActive(true);
            
            userRepository.save(admin);
            return ResponseEntity.ok("Admin user created: " + username + " (ID: 1, Role: ADMIN)");
            
        } catch (Exception e) {
            return ResponseEntity.ok("Error creating admin: " + e.getMessage());
        }
    }
}