package com.educonnect.discussion.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Simple DTO tests for ApiResponse
 */
public class ApiResponseTest {

    @Test
    public void testSuccessfulApiResponse() {
        String testData = "Test Data";
        String testMessage = "Success message";
        
        ApiResponse<String> response = ApiResponse.success(testData, testMessage);
        
        assertTrue(response.isSuccess());
        assertEquals(testData, response.getData());
        assertEquals(testMessage, response.getMessage());
        assertNull(response.getError());
    }

    @Test
    public void testSuccessfulApiResponseWithoutMessage() {
        String testData = "Test Data";
        
        ApiResponse<String> response = ApiResponse.success(testData);
        
        assertTrue(response.isSuccess());
        assertEquals(testData, response.getData());
        assertNull(response.getError());
    }

    @Test
    public void testErrorApiResponse() {
        String errorMessage = "Something went wrong";
        
        ApiResponse<String> response = ApiResponse.error(errorMessage);
        
        assertFalse(response.isSuccess());
        assertEquals(errorMessage, response.getError());
        assertNull(response.getData());
    }

    @Test
    public void testApiResponseGettersAndSetters() {
        ApiResponse<String> response = new ApiResponse<>();
        
        response.setSuccess(true);
        response.setData("Test");
        response.setMessage("Test Message");
        response.setError(null);
        
        assertTrue(response.isSuccess());
        assertEquals("Test", response.getData());
        assertEquals("Test Message", response.getMessage());
        assertNull(response.getError());
    }
}