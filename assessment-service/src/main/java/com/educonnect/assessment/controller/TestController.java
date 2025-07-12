package com.educonnect.assessment.controller;

import com.educonnect.assessment.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private JwtUtils jwtUtils;

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
}