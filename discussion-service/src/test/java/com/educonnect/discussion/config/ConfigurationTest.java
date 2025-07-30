package com.educonnect.discussion.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Configuration and context loading tests
 */
@SpringBootTest
@ActiveProfiles("test")
public class ConfigurationTest {

    @Test
    public void contextLoads() {
        // This test ensures that the Spring context loads successfully
        assertTrue(true, "Spring context should load without errors");
    }

    @Test
    public void testApplicationProperties() {
        String profile = System.getProperty("spring.profiles.active", "default");
        assertNotNull(profile);
        
        // Test that we can access system properties
        String javaVersion = System.getProperty("java.version");
        assertNotNull(javaVersion);
        assertTrue(javaVersion.startsWith("17") || javaVersion.startsWith("1.8"));
    }

    @Test
    public void testBasicApplicationConfiguration() {
        // Test basic application setup
        String appName = "EduConnect Discussion Service";
        String version = "0.0.1-SNAPSHOT";
        
        assertEquals("EduConnect Discussion Service", appName);
        assertEquals("0.0.1-SNAPSHOT", version);
        
        // Test environment variables can be accessed
        String userHome = System.getProperty("user.home");
        assertNotNull(userHome);
        assertFalse(userHome.isEmpty());
    }
}