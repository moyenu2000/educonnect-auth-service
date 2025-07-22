package com.learningplatform.auth.repository;

import com.learningplatform.auth.entity.AuthProvider;
import com.learningplatform.auth.entity.RefreshToken;
import com.learningplatform.auth.entity.User;
import com.learningplatform.auth.entity.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class RefreshTokenRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    private User testUser;
    private RefreshToken testRefreshToken;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("encodedPassword")
                .fullName("Test User")
                .role(UserRole.STUDENT)
                .enabled(true)
                .verified(true)
                .provider(AuthProvider.LOCAL)
                .build();

        testRefreshToken = RefreshToken.builder()
                .token("refresh-token-123")
                .user(testUser)
                .expiryDate(Instant.now().plus(7, ChronoUnit.DAYS))
                .deviceInfo("Mozilla/5.0")
                .ipAddress("127.0.0.1")
                .build();
    }

    @Test
    void findByToken_ShouldReturnRefreshToken_WhenTokenExists() {
        User savedUser = entityManager.persistAndFlush(testUser);
        testRefreshToken.setUser(savedUser);
        entityManager.persistAndFlush(testRefreshToken);

        Optional<RefreshToken> found = refreshTokenRepository.findByToken("refresh-token-123");

        assertTrue(found.isPresent());
        assertEquals("refresh-token-123", found.get().getToken());
        assertEquals("testuser", found.get().getUser().getUsername());
    }

    @Test
    void findByToken_ShouldReturnEmpty_WhenTokenDoesNotExist() {
        Optional<RefreshToken> found = refreshTokenRepository.findByToken("nonexistent-token");

        assertFalse(found.isPresent());
    }

    @Test
    void save_ShouldPersistRefreshToken_WhenValidToken() {
        User savedUser = entityManager.persistAndFlush(testUser);
        testRefreshToken.setUser(savedUser);

        RefreshToken savedToken = refreshTokenRepository.save(testRefreshToken);

        assertNotNull(savedToken.getId());
        assertEquals("refresh-token-123", savedToken.getToken());
        assertEquals("testuser", savedToken.getUser().getUsername());
        assertNotNull(savedToken.getExpiryDate());
    }

    @Test
    void delete_ShouldRemoveRefreshToken_WhenTokenExists() {
        User savedUser = entityManager.persistAndFlush(testUser);
        testRefreshToken.setUser(savedUser);
        RefreshToken savedToken = entityManager.persistAndFlush(testRefreshToken);
        Long tokenId = savedToken.getId();

        refreshTokenRepository.delete(savedToken);
        entityManager.flush();

        Optional<RefreshToken> found = refreshTokenRepository.findById(tokenId);
        assertFalse(found.isPresent());
    }

    @Test
    void deleteByUser_ShouldRemoveAllTokensForUser_WhenUserHasTokens() {
        User savedUser = entityManager.persistAndFlush(testUser);
        
        RefreshToken token1 = RefreshToken.builder()
                .token("token-1")
                .user(savedUser)
                .expiryDate(Instant.now().plus(7, ChronoUnit.DAYS))
                .deviceInfo("Device 1")
                .ipAddress("127.0.0.1")
                .build();
        
        RefreshToken token2 = RefreshToken.builder()
                .token("token-2")
                .user(savedUser)
                .expiryDate(Instant.now().plus(7, ChronoUnit.DAYS))
                .deviceInfo("Device 2")
                .ipAddress("127.0.0.1")
                .build();

        entityManager.persistAndFlush(token1);
        entityManager.persistAndFlush(token2);

        int deletedCount = refreshTokenRepository.deleteByUser(savedUser);
        entityManager.flush();

        assertEquals(2, deletedCount);
        assertFalse(refreshTokenRepository.findByToken("token-1").isPresent());
        assertFalse(refreshTokenRepository.findByToken("token-2").isPresent());
    }

    @Test
    void deleteByUser_ShouldReturnZero_WhenUserHasNoTokens() {
        User savedUser = entityManager.persistAndFlush(testUser);

        int deletedCount = refreshTokenRepository.deleteByUser(savedUser);

        assertEquals(0, deletedCount);
    }

    @Test
    void deleteAllByExpiryDateBefore_ShouldRemoveExpiredTokens_WhenExpiredTokensExist() {
        User savedUser = entityManager.persistAndFlush(testUser);
        
        // Create expired token
        RefreshToken expiredToken = RefreshToken.builder()
                .token("expired-token")
                .user(savedUser)
                .expiryDate(Instant.now().minus(1, ChronoUnit.DAYS))
                .deviceInfo("Expired Device")
                .ipAddress("127.0.0.1")
                .build();
        
        // Create valid token
        RefreshToken validToken = RefreshToken.builder()
                .token("valid-token")
                .user(savedUser)
                .expiryDate(Instant.now().plus(7, ChronoUnit.DAYS))
                .deviceInfo("Valid Device")
                .ipAddress("127.0.0.1")
                .build();

        entityManager.persistAndFlush(expiredToken);
        entityManager.persistAndFlush(validToken);

        int deletedCount = refreshTokenRepository.deleteAllByExpiryDateBefore(Instant.now());
        entityManager.flush();

        assertEquals(1, deletedCount);
        assertFalse(refreshTokenRepository.findByToken("expired-token").isPresent());
        assertTrue(refreshTokenRepository.findByToken("valid-token").isPresent());
    }

    @Test
    void deleteAllByExpiryDateBefore_ShouldReturnZero_WhenNoExpiredTokens() {
        User savedUser = entityManager.persistAndFlush(testUser);
        testRefreshToken.setUser(savedUser);
        entityManager.persistAndFlush(testRefreshToken);

        int deletedCount = refreshTokenRepository.deleteAllByExpiryDateBefore(Instant.now().minus(1, ChronoUnit.DAYS));

        assertEquals(0, deletedCount);
        assertTrue(refreshTokenRepository.findByToken("refresh-token-123").isPresent());
    }

    @Test
    void findAll_ShouldReturnAllRefreshTokens() {
        User savedUser = entityManager.persistAndFlush(testUser);
        
        RefreshToken token1 = RefreshToken.builder()
                .token("token-1")
                .user(savedUser)
                .expiryDate(Instant.now().plus(7, ChronoUnit.DAYS))
                .deviceInfo("Device 1")
                .ipAddress("127.0.0.1")
                .build();
        
        RefreshToken token2 = RefreshToken.builder()
                .token("token-2")
                .user(savedUser)
                .expiryDate(Instant.now().plus(7, ChronoUnit.DAYS))
                .deviceInfo("Device 2")
                .ipAddress("127.0.0.1")
                .build();

        entityManager.persistAndFlush(token1);
        entityManager.persistAndFlush(token2);

        var tokens = refreshTokenRepository.findAll();

        assertEquals(2, tokens.size());
    }

    @Test
    void refreshToken_ShouldHaveCorrectProperties_WhenCreated() {
        User savedUser = entityManager.persistAndFlush(testUser);
        testRefreshToken.setUser(savedUser);
        RefreshToken savedToken = entityManager.persistAndFlush(testRefreshToken);

        assertEquals("refresh-token-123", savedToken.getToken());
        assertEquals("testuser", savedToken.getUser().getUsername());
        assertEquals("Mozilla/5.0", savedToken.getDeviceInfo());
        assertEquals("127.0.0.1", savedToken.getIpAddress());
        assertNotNull(savedToken.getExpiryDate());
        assertTrue(savedToken.getExpiryDate().isAfter(Instant.now()));
    }
}