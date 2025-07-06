package com.learningplatform.auth.repository;

import com.learningplatform.auth.entity.AuthProvider;
import com.learningplatform.auth.entity.User;
import com.learningplatform.auth.entity.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

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
                .verificationToken("verification-token-123")
                .resetToken("reset-token-123")
                .verificationTokenExpiry(LocalDateTime.now().plusHours(24))
                .resetTokenExpiry(LocalDateTime.now().plusHours(1))
                .build();
    }

    @Test
    void findByUsername_ShouldReturnUser_WhenUserExists() {
        entityManager.persistAndFlush(testUser);

        Optional<User> found = userRepository.findByUsername("testuser");

        assertTrue(found.isPresent());
        assertEquals("testuser", found.get().getUsername());
        assertEquals("test@example.com", found.get().getEmail());
    }

    @Test
    void findByUsername_ShouldReturnEmpty_WhenUserDoesNotExist() {
        Optional<User> found = userRepository.findByUsername("nonexistent");

        assertFalse(found.isPresent());
    }

    @Test
    void findByEmail_ShouldReturnUser_WhenUserExists() {
        entityManager.persistAndFlush(testUser);

        Optional<User> found = userRepository.findByEmail("test@example.com");

        assertTrue(found.isPresent());
        assertEquals("testuser", found.get().getUsername());
        assertEquals("test@example.com", found.get().getEmail());
    }

    @Test
    void findByEmail_ShouldReturnEmpty_WhenUserDoesNotExist() {
        Optional<User> found = userRepository.findByEmail("nonexistent@example.com");

        assertFalse(found.isPresent());
    }

    @Test
    void findByUsernameOrEmail_ShouldReturnUser_WhenSearchingByUsername() {
        entityManager.persistAndFlush(testUser);

        Optional<User> found = userRepository.findByUsernameOrEmail("testuser", "testuser");

        assertTrue(found.isPresent());
        assertEquals("testuser", found.get().getUsername());
    }

    @Test
    void findByUsernameOrEmail_ShouldReturnUser_WhenSearchingByEmail() {
        entityManager.persistAndFlush(testUser);

        Optional<User> found = userRepository.findByUsernameOrEmail("test@example.com", "test@example.com");

        assertTrue(found.isPresent());
        assertEquals("test@example.com", found.get().getEmail());
    }

    @Test
    void findByUsernameOrEmail_ShouldReturnUser_WhenSearchingByUsernameWithDifferentEmail() {
        entityManager.persistAndFlush(testUser);

        Optional<User> found = userRepository.findByUsernameOrEmail("testuser", "different@example.com");

        assertTrue(found.isPresent());
        assertEquals("testuser", found.get().getUsername());
    }

    @Test
    void findByUsernameOrEmail_ShouldReturnEmpty_WhenUserDoesNotExist() {
        Optional<User> found = userRepository.findByUsernameOrEmail("nonexistent", "nonexistent@example.com");

        assertFalse(found.isPresent());
    }

    @Test
    void findByVerificationToken_ShouldReturnUser_WhenTokenExists() {
        entityManager.persistAndFlush(testUser);

        Optional<User> found = userRepository.findByVerificationToken("verification-token-123");

        assertTrue(found.isPresent());
        assertEquals("testuser", found.get().getUsername());
        assertEquals("verification-token-123", found.get().getVerificationToken());
    }

    @Test
    void findByVerificationToken_ShouldReturnEmpty_WhenTokenDoesNotExist() {
        Optional<User> found = userRepository.findByVerificationToken("nonexistent-token");

        assertFalse(found.isPresent());
    }

    @Test
    void findByResetToken_ShouldReturnUser_WhenTokenExists() {
        entityManager.persistAndFlush(testUser);

        Optional<User> found = userRepository.findByResetToken("reset-token-123");

        assertTrue(found.isPresent());
        assertEquals("testuser", found.get().getUsername());
        assertEquals("reset-token-123", found.get().getResetToken());
    }

    @Test
    void findByResetToken_ShouldReturnEmpty_WhenTokenDoesNotExist() {
        Optional<User> found = userRepository.findByResetToken("nonexistent-token");

        assertFalse(found.isPresent());
    }

    @Test
    void existsByUsername_ShouldReturnTrue_WhenUsernameExists() {
        entityManager.persistAndFlush(testUser);

        Boolean exists = userRepository.existsByUsername("testuser");

        assertTrue(exists);
    }

    @Test
    void existsByUsername_ShouldReturnFalse_WhenUsernameDoesNotExist() {
        Boolean exists = userRepository.existsByUsername("nonexistent");

        assertFalse(exists);
    }

    @Test
    void existsByEmail_ShouldReturnTrue_WhenEmailExists() {
        entityManager.persistAndFlush(testUser);

        Boolean exists = userRepository.existsByEmail("test@example.com");

        assertTrue(exists);
    }

    @Test
    void existsByEmail_ShouldReturnFalse_WhenEmailDoesNotExist() {
        Boolean exists = userRepository.existsByEmail("nonexistent@example.com");

        assertFalse(exists);
    }

    @Test
    void save_ShouldPersistUser_WhenValidUser() {
        User savedUser = userRepository.save(testUser);

        assertNotNull(savedUser.getId());
        assertEquals("testuser", savedUser.getUsername());
        assertEquals("test@example.com", savedUser.getEmail());

        Optional<User> found = userRepository.findById(savedUser.getId());
        assertTrue(found.isPresent());
        assertEquals("testuser", found.get().getUsername());
    }

    @Test
    void delete_ShouldRemoveUser_WhenUserExists() {
        User savedUser = entityManager.persistAndFlush(testUser);
        Long userId = savedUser.getId();

        userRepository.delete(savedUser);
        entityManager.flush();

        Optional<User> found = userRepository.findById(userId);
        assertFalse(found.isPresent());
    }

    @Test
    void findAll_ShouldReturnAllUsers() {
        User user2 = User.builder()
                .username("testuser2")
                .email("test2@example.com")
                .password("encodedPassword")
                .fullName("Test User 2")
                .role(UserRole.QUESTION_SETTER)
                .enabled(true)
                .verified(true)
                .provider(AuthProvider.LOCAL)
                .build();

        entityManager.persistAndFlush(testUser);
        entityManager.persistAndFlush(user2);

        var users = userRepository.findAll();

        assertEquals(2, users.size());
    }

    @Test
    void update_ShouldModifyUser_WhenUserExists() {
        User savedUser = entityManager.persistAndFlush(testUser);
        
        savedUser.setFullName("Updated Name");
        savedUser.setVerified(true);
        
        User updatedUser = userRepository.save(savedUser);
        entityManager.flush();

        assertEquals("Updated Name", updatedUser.getFullName());
        assertTrue(updatedUser.isVerified());
    }
}