package com.educonnect.discussion.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component("jwtAuthenticationFilterFixed")
public class JwtAuthenticationFilterFixed extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilterFixed.class);

    @Autowired
    @Qualifier("jwtUtilsFixed")
    private JwtUtilsFixed jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        logger.debug("Fixed JWT Filter processing request: {}", request.getRequestURI());
        
        try {
            String jwt = parseJwt(request);
            logger.debug("Parsed JWT token: {}", jwt != null ? "Present (length: " + jwt.length() + ")" : "Not found");
            
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
                    logger.debug("Successfully set authentication for user: {} with authorities: {}", 
                        username, userPrincipal.getAuthorities());
                } else {
                    logger.debug("JWT token validation failed");
                }
            } else {
                logger.debug("No JWT token found in request");
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage(), e);
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        logger.debug("Authorization header: {}", headerAuth != null ? "Present" : "Not found");
        logger.debug("Authorization header value: '{}'", headerAuth);
        
        if (StringUtils.hasText(headerAuth)) {
            logger.debug("Header has text, checking if starts with 'Bearer '");
            if (headerAuth.startsWith("Bearer ")) {
                String token = headerAuth.substring(7);
                logger.debug("Successfully extracted token, length: {}", token.length());
                logger.debug("Token preview: {}...", token.length() > 20 ? token.substring(0, 20) : token);
                return token;
            } else {
                logger.debug("Header does not start with 'Bearer ', actual start: '{}'", 
                    headerAuth.length() > 10 ? headerAuth.substring(0, 10) : headerAuth);
            }
        } else {
            logger.debug("Header has no text");
        }
        return null;
    }
}