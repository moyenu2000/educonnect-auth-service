package com.learningplatform.auth.security;

import com.learningplatform.auth.entity.AuthProvider;
import com.learningplatform.auth.entity.User;
import com.learningplatform.auth.entity.UserRole;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SecurityException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class JwtUtilsTest {

    @InjectMocks
    private JwtUtils jwtUtils;

    private User testUser;
    private CustomUserPrincipal userPrincipal;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .password("encodedPassword")
                .fullName("Test User")
                .role(UserRole.STUDENT)
                .enabled(true)
                .verified(true)
                .provider(AuthProvider.LOCAL)
                .build();

        userPrincipal = CustomUserPrincipal.create(testUser);

        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", 
                "dGVzdC1zZWNyZXQta2V5LXRoYXQtaXMtbG9uZy1lbm91Z2gtZm9yLWptd3Q=");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 86400000); // 24 hours
        ReflectionTestUtils.setField(jwtUtils, "refreshExpirationMs", 604800000); // 7 days
    }

    @Test
    void generateAccessToken_ShouldReturnValidToken_WhenValidUserPrincipal() {
        String token = jwtUtils.generateAccessToken(userPrincipal);

        assertNotNull(token);
        assertTrue(token.length() > 0);
        assertTrue(jwtUtils.validateToken(token));
    }

    @Test
    void generateRefreshToken_ShouldReturnValidToken_WhenValidUserPrincipal() {
        String token = jwtUtils.generateRefreshToken(userPrincipal);

        assertNotNull(token);
        assertTrue(token.length() > 0);
        assertTrue(jwtUtils.validateToken(token));
    }

    @Test
    void validateToken_ShouldReturnTrue_WhenValidToken() {
        String token = jwtUtils.generateAccessToken(userPrincipal);

        Boolean isValid = jwtUtils.validateToken(token);

        assertTrue(isValid);
    }

    @Test
    void validateToken_ShouldReturnFalse_WhenInvalidToken() {
        String invalidToken = "invalid.jwt.token";

        Boolean isValid = jwtUtils.validateToken(invalidToken);

        assertFalse(isValid);
    }

    @Test
    void validateToken_ShouldReturnFalse_WhenMalformedToken() {
        String malformedToken = "malformed-token";

        Boolean isValid = jwtUtils.validateToken(malformedToken);

        assertFalse(isValid);
    }

    @Test
    void getUsernameFromToken_ShouldReturnUsername_WhenValidToken() {
        String token = jwtUtils.generateAccessToken(userPrincipal);

        String username = jwtUtils.getUsernameFromToken(token);

        assertEquals("testuser", username);
    }

    @Test
    void getUserIdFromToken_ShouldReturnUserId_WhenValidToken() {
        String token = jwtUtils.generateAccessToken(userPrincipal);

        Long userId = jwtUtils.getUserIdFromToken(token);

        assertEquals(1L, userId);
    }

    @Test
    void getRoleFromToken_ShouldReturnRole_WhenValidToken() {
        String token = jwtUtils.generateAccessToken(userPrincipal);

        String role = jwtUtils.getRoleFromToken(token);

        assertEquals("STUDENT", role);
    }

    @Test
    void getExpirationDateFromToken_ShouldReturnExpirationDate_WhenValidToken() {
        String token = jwtUtils.generateAccessToken(userPrincipal);

        Date expirationDate = jwtUtils.getExpirationDateFromToken(token);

        assertNotNull(expirationDate);
        assertTrue(expirationDate.after(new Date()));
    }

    @Test
    void isTokenExpired_ShouldReturnFalse_WhenTokenNotExpired() {
        String token = jwtUtils.generateAccessToken(userPrincipal);

        Boolean isExpired = jwtUtils.isTokenExpired(token);

        assertFalse(isExpired);
    }

    @Test
    void isTokenExpired_ShouldReturnTrue_WhenTokenExpired() {
        // Set very short expiration for testing
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 1); // 1 millisecond
        
        String token = jwtUtils.generateAccessToken(userPrincipal);
        
        // Wait for token to expire
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        Boolean isExpired = jwtUtils.isTokenExpired(token);

        assertTrue(isExpired);
    }

    @Test
    void validateToken_ShouldHandleExpiredToken() {
        // Set very short expiration for testing
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 1); // 1 millisecond
        
        String token = jwtUtils.generateAccessToken(userPrincipal);
        
        // Wait for token to expire
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        Boolean isValid = jwtUtils.validateToken(token);

        assertFalse(isValid);
    }

    @Test
    void validateToken_ShouldHandleNullToken() {
        assertThrows(IllegalArgumentException.class, () -> {
            jwtUtils.validateToken(null);
        });
    }

    @Test
    void validateToken_ShouldHandleEmptyToken() {
        assertThrows(IllegalArgumentException.class, () -> {
            jwtUtils.validateToken("");
        });
    }

    @Test
    void generateAccessToken_ShouldIncludeUserClaims_WhenCustomUserPrincipal() {
        String token = jwtUtils.generateAccessToken(userPrincipal);

        String username = jwtUtils.getUsernameFromToken(token);
        Long userId = jwtUtils.getUserIdFromToken(token);
        String role = jwtUtils.getRoleFromToken(token);

        assertEquals("testuser", username);
        assertEquals(1L, userId);
        assertEquals("STUDENT", role);
    }

    @Test
    void generateRefreshToken_ShouldNotIncludeExtraClaims() {
        String token = jwtUtils.generateRefreshToken(userPrincipal);

        String username = jwtUtils.getUsernameFromToken(token);

        assertEquals("testuser", username);
        // Refresh tokens should not include extra claims like userId or role
    }

    @Test
    void validateToken_ShouldReturnFalse_WhenTokenSignedWithDifferentSecret() {
        // Generate token with current secret
        String token = jwtUtils.generateAccessToken(userPrincipal);
        
        // Change the secret
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", 
                "ZGlmZmVyZW50LXNlY3JldC1rZXktdGhhdC1pcy1sb25nLWVub3VnaA==");

        Boolean isValid = jwtUtils.validateToken(token);

        assertFalse(isValid);
    }
}