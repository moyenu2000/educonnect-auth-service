package com.educonnect.assessment.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// @Component - Disabled in favor of JwtAuthenticationFilterFixed
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        logger.debug("JWT Filter processing request: {}", request.getRequestURI());
        try {
            String jwt = parseJwt(request);
            logger.debug("Parsed JWT token: {}", jwt != null ? "Present" : "Not found");
            
            if (jwt != null) {
                logger.debug("Validating JWT token...");
                boolean isValid = jwtUtils.validateJwtToken(jwt);
                logger.debug("JWT token validation result: {}", isValid);
                
                if (isValid) {
                    logger.debug("Extracting user details from JWT...");
                    Long userId = jwtUtils.getUserIdFromJwtToken(jwt);
                    String username = jwtUtils.getUsernameFromJwtToken(jwt);
                    String email = jwtUtils.getEmailFromJwtToken(jwt);
                    String fullName = jwtUtils.getFullNameFromJwtToken(jwt);
                    String role = jwtUtils.getRoleFromJwtToken(jwt);

                    logger.debug("Creating UserPrincipal for user: {} with role: {}", username, role);
                    UserPrincipal userPrincipal = UserPrincipal.create(userId, username, email, fullName, role);
                    UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(userPrincipal, null, userPrincipal.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.debug("Successfully set authentication for user: {}", username);
                }
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}