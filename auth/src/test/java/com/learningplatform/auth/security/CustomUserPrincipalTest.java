package com.learningplatform.auth.security;

import com.learningplatform.auth.entity.AuthProvider;
import com.learningplatform.auth.entity.User;
import com.learningplatform.auth.entity.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class CustomUserPrincipalTest {

    private User testUser;

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
    }

    @Test
    void create_ShouldReturnCustomUserPrincipal_WhenValidUser() {
        CustomUserPrincipal principal = CustomUserPrincipal.create(testUser);

        assertNotNull(principal);
        assertEquals(1L, principal.getId());
        assertEquals("testuser", principal.getUsername());
        assertEquals("test@example.com", principal.getEmail());
        assertEquals("encodedPassword", principal.getPassword());
        assertEquals(testUser, principal.getUser());
    }

    @Test
    void create_ShouldSetCorrectAuthorities_WhenValidUser() {
        CustomUserPrincipal principal = CustomUserPrincipal.create(testUser);

        assertNotNull(principal.getAuthorities());
        assertEquals(1, principal.getAuthorities().size());
        
        GrantedAuthority authority = principal.getAuthorities().iterator().next();
        assertEquals("ROLE_STUDENT", authority.getAuthority());
    }

    @Test
    void createWithAttributes_ShouldReturnCustomUserPrincipalWithAttributes_WhenValidUserAndAttributes() {
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("provider", "google");
        attributes.put("providerId", "123456789");

        CustomUserPrincipal principal = CustomUserPrincipal.create(testUser, attributes);

        assertNotNull(principal);
        assertEquals(1L, principal.getId());
        assertEquals("testuser", principal.getUsername());
        assertEquals(attributes, principal.getAttributes());
    }

    @Test
    void getName_ShouldReturnUserId_WhenCalled() {
        CustomUserPrincipal principal = CustomUserPrincipal.create(testUser);

        String name = principal.getName();

        assertEquals("1", name);
    }

    @Test
    void getAuthorities_ShouldReturnCorrectRole_WhenUserHasStudentRole() {
        testUser.setRole(UserRole.STUDENT);
        CustomUserPrincipal principal = CustomUserPrincipal.create(testUser);

        GrantedAuthority authority = principal.getAuthorities().iterator().next();

        assertEquals("ROLE_STUDENT", authority.getAuthority());
    }

    @Test
    void getAuthorities_ShouldReturnCorrectRole_WhenUserHasTeacherRole() {
        testUser.setRole(UserRole.QUESTION_SETTER);
        CustomUserPrincipal principal = CustomUserPrincipal.create(testUser);

        GrantedAuthority authority = principal.getAuthorities().iterator().next();

        assertEquals("ROLE_QUESTION_SETTER", authority.getAuthority());
    }

    @Test
    void getAuthorities_ShouldReturnCorrectRole_WhenUserHasAdminRole() {
        testUser.setRole(UserRole.ADMIN);
        CustomUserPrincipal principal = CustomUserPrincipal.create(testUser);

        GrantedAuthority authority = principal.getAuthorities().iterator().next();

        assertEquals("ROLE_ADMIN", authority.getAuthority());
    }

    @Test
    void isAccountNonExpired_ShouldReturnTrue_Always() {
        CustomUserPrincipal principal = CustomUserPrincipal.create(testUser);

        assertTrue(principal.isAccountNonExpired());
    }

    @Test
    void isAccountNonLocked_ShouldReturnTrue_WhenUserNotLocked() {
        testUser.setLockedUntil(null);
        CustomUserPrincipal principal = CustomUserPrincipal.create(testUser);

        assertTrue(principal.isAccountNonLocked());
    }

    @Test
    void isAccountNonLocked_ShouldReturnFalse_WhenUserLocked() {
        testUser.setLockedUntil(LocalDateTime.now().plusMinutes(30));
        CustomUserPrincipal principal = CustomUserPrincipal.create(testUser);

        assertFalse(principal.isAccountNonLocked());
    }

    @Test
    void isCredentialsNonExpired_ShouldReturnTrue_Always() {
        CustomUserPrincipal principal = CustomUserPrincipal.create(testUser);

        assertTrue(principal.isCredentialsNonExpired());
    }

    @Test
    void isEnabled_ShouldReturnTrue_WhenUserEnabled() {
        testUser.setEnabled(true);
        CustomUserPrincipal principal = CustomUserPrincipal.create(testUser);

        assertTrue(principal.isEnabled());
    }

    @Test
    void isEnabled_ShouldReturnFalse_WhenUserDisabled() {
        testUser.setEnabled(false);
        CustomUserPrincipal principal = CustomUserPrincipal.create(testUser);

        assertFalse(principal.isEnabled());
    }

    @Test
    void setAttributes_ShouldSetAttributes_WhenCalled() {
        CustomUserPrincipal principal = CustomUserPrincipal.create(testUser);
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("key", "value");

        principal.setAttributes(attributes);

        assertEquals(attributes, principal.getAttributes());
    }

    @Test
    void getAttributes_ShouldReturnNull_WhenNoAttributesSet() {
        CustomUserPrincipal principal = CustomUserPrincipal.create(testUser);

        assertNull(principal.getAttributes());
    }
}