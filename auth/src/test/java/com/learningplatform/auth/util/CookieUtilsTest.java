package com.learningplatform.auth.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.Serializable;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CookieUtilsTest {

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    private Cookie testCookie;

    @BeforeEach
    void setUp() {
        testCookie = new Cookie("testCookie", "testValue");
    }

    @Test
    void getCookie_ShouldReturnCookie_WhenCookieExists() {
        Cookie[] cookies = {testCookie, new Cookie("otherCookie", "otherValue")};
        when(request.getCookies()).thenReturn(cookies);

        Optional<Cookie> result = CookieUtils.getCookie(request, "testCookie");

        assertTrue(result.isPresent());
        assertEquals("testCookie", result.get().getName());
        assertEquals("testValue", result.get().getValue());
    }

    @Test
    void getCookie_ShouldReturnEmpty_WhenCookieDoesNotExist() {
        Cookie[] cookies = {new Cookie("otherCookie", "otherValue")};
        when(request.getCookies()).thenReturn(cookies);

        Optional<Cookie> result = CookieUtils.getCookie(request, "nonExistentCookie");

        assertFalse(result.isPresent());
    }

    @Test
    void getCookie_ShouldReturnEmpty_WhenNoCookiesExist() {
        when(request.getCookies()).thenReturn(null);

        Optional<Cookie> result = CookieUtils.getCookie(request, "testCookie");

        assertFalse(result.isPresent());
    }

    @Test
    void getCookie_ShouldReturnEmpty_WhenCookiesArrayIsEmpty() {
        when(request.getCookies()).thenReturn(new Cookie[0]);

        Optional<Cookie> result = CookieUtils.getCookie(request, "testCookie");

        assertFalse(result.isPresent());
    }

    @Test
    void addCookie_ShouldAddCookieToResponse_WhenCalled() {
        CookieUtils.addCookie(response, "sessionId", "abc123", 3600);

        verify(response).addCookie(any(Cookie.class));
    }

    @Test
    void addCookie_ShouldCreateCookieWithCorrectProperties_WhenCalled() {
        CookieUtils.addCookie(response, "sessionId", "abc123", 3600);

        verify(response).addCookie(argThat(cookie ->
                "sessionId".equals(cookie.getName()) &&
                "abc123".equals(cookie.getValue()) &&
                "/".equals(cookie.getPath()) &&
                cookie.isHttpOnly() &&
                cookie.getMaxAge() == 3600
        ));
    }

    @Test
    void deleteCookie_ShouldDeleteCookie_WhenCookieExists() {
        Cookie[] cookies = {testCookie};
        when(request.getCookies()).thenReturn(cookies);

        CookieUtils.deleteCookie(request, response, "testCookie");

        verify(response).addCookie(argThat(cookie ->
                "testCookie".equals(cookie.getName()) &&
                "".equals(cookie.getValue()) &&
                "/".equals(cookie.getPath()) &&
                cookie.getMaxAge() == 0
        ));
    }

    @Test
    void deleteCookie_ShouldNotDeleteCookie_WhenCookieDoesNotExist() {
        Cookie[] cookies = {new Cookie("otherCookie", "otherValue")};
        when(request.getCookies()).thenReturn(cookies);

        CookieUtils.deleteCookie(request, response, "nonExistentCookie");

        verify(response, never()).addCookie(any(Cookie.class));
    }

    @Test
    void deleteCookie_ShouldHandleNullCookies_WhenNoCookiesExist() {
        when(request.getCookies()).thenReturn(null);

        CookieUtils.deleteCookie(request, response, "testCookie");

        verify(response, never()).addCookie(any(Cookie.class));
    }

    @Test
    void serialize_ShouldReturnBase64String_WhenValidObject() {
        String testString = "Hello World";

        String result = CookieUtils.serialize(testString);

        assertNotNull(result);
        assertTrue(result.length() > 0);
        assertFalse(result.contains(" ")); // Base64 URL encoding should not contain spaces
    }

    @Test
    void serialize_ShouldHandleNullObject() {
        String result = CookieUtils.serialize(null);

        assertNotNull(result);
    }

    @Test
    void deserialize_ShouldReturnOriginalObject_WhenValidSerializedCookie() {
        String testString = "Hello World";
        String serialized = CookieUtils.serialize(testString);
        Cookie cookie = new Cookie("test", serialized);

        String result = CookieUtils.deserialize(cookie, String.class);

        assertEquals(testString, result);
    }

    @Test
    void deserialize_ShouldHandleComplexObject_WhenValidSerializedCookie() {
        TestSerializableObject testObject = new TestSerializableObject("test", 123);
        String serialized = CookieUtils.serialize(testObject);
        Cookie cookie = new Cookie("test", serialized);

        TestSerializableObject result = CookieUtils.deserialize(cookie, TestSerializableObject.class);

        assertEquals(testObject.getName(), result.getName());
        assertEquals(testObject.getValue(), result.getValue());
    }

    @Test
    void serializeAndDeserialize_ShouldMaintainObjectIntegrity() {
        TestSerializableObject original = new TestSerializableObject("integration", 456);
        
        String serialized = CookieUtils.serialize(original);
        Cookie cookie = new Cookie("test", serialized);
        TestSerializableObject deserialized = CookieUtils.deserialize(cookie, TestSerializableObject.class);

        assertEquals(original.getName(), deserialized.getName());
        assertEquals(original.getValue(), deserialized.getValue());
    }

    @Test
    void getCookie_ShouldReturnFirstMatchingCookie_WhenMultipleCookiesWithSameName() {
        Cookie cookie1 = new Cookie("duplicateName", "value1");
        Cookie cookie2 = new Cookie("duplicateName", "value2");
        Cookie[] cookies = {cookie1, cookie2};
        when(request.getCookies()).thenReturn(cookies);

        Optional<Cookie> result = CookieUtils.getCookie(request, "duplicateName");

        assertTrue(result.isPresent());
        assertEquals("value1", result.get().getValue());
    }

    // Helper class for testing serialization
    private static class TestSerializableObject implements Serializable {
        private static final long serialVersionUID = 1L;
        private String name;
        private int value;

        public TestSerializableObject(String name, int value) {
            this.name = name;
            this.value = value;
        }

        public String getName() {
            return name;
        }

        public int getValue() {
            return value;
        }
    }
}