package com.educonnect.assessment.util;

import com.educonnect.assessment.security.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public class SecurityUtils {
    
    public static Optional<Long> getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("DEBUG SecurityUtils: Authentication = " + authentication);
        if (authentication != null) {
            System.out.println("DEBUG SecurityUtils: Principal = " + authentication.getPrincipal());
            System.out.println("DEBUG SecurityUtils: Principal class = " + authentication.getPrincipal().getClass());
            if (authentication.getPrincipal() instanceof UserPrincipal) {
                Long userId = ((UserPrincipal) authentication.getPrincipal()).getId();
                System.out.println("DEBUG SecurityUtils: Found userId = " + userId);
                return Optional.of(userId);
            } else {
                System.out.println("DEBUG SecurityUtils: Principal is not UserPrincipal, it's " + authentication.getPrincipal().getClass());
            }
        } else {
            System.out.println("DEBUG SecurityUtils: Authentication is null");
        }
        return Optional.empty();
    }
    
    public static String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            return ((UserPrincipal) authentication.getPrincipal()).getUsername();
        }
        return null;
    }
    
    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && 
               authentication.isAuthenticated() && 
               authentication.getPrincipal() instanceof UserPrincipal;
    }
    
    public static boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            return authentication.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_" + role));
        }
        return false;
    }
}