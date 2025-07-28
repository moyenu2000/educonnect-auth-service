package com.educonnect.discussion.service;

import com.educonnect.discussion.dto.AIQueryRequest;

public interface GeminiService {
    String generateContent(AIQueryRequest request);
}