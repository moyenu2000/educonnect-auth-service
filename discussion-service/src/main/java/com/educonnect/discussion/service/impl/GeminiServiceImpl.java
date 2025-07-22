package com.educonnect.discussion.service.impl;

import com.educonnect.discussion.config.GeminiConfig;
import com.educonnect.discussion.dto.AIQueryRequest;
import com.educonnect.discussion.dto.gemini.GeminiRequest;
import com.educonnect.discussion.dto.gemini.GeminiResponse;
import com.educonnect.discussion.service.GeminiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;

@Service
public class GeminiServiceImpl implements GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiServiceImpl.class);

    @Autowired
    private WebClient geminiWebClient;

    @Autowired
    private GeminiConfig geminiConfig;

    @Override
    public String generateContent(AIQueryRequest request) {
        try {
            String prompt = buildPrompt(request);
            logger.info("Sending request to Gemini API with prompt: {}", prompt.substring(0, Math.min(prompt.length(), 100)) + "...");

            // Create Gemini request
            GeminiRequest geminiRequest = createGeminiRequest(prompt);

            // Call Gemini API
            GeminiResponse response = geminiWebClient
                    .post()
                    .uri(uriBuilder -> uriBuilder
                            .queryParam("key", geminiConfig.getGeminiApiKey())
                            .build())
                    .body(Mono.just(geminiRequest), GeminiRequest.class)
                    .retrieve()
                    .bodyToMono(GeminiResponse.class)
                    .timeout(Duration.ofSeconds(30))
                    .block();

            // Extract response text
            if (response != null && 
                response.getCandidates() != null && 
                !response.getCandidates().isEmpty() &&
                response.getCandidates().get(0).getContent() != null &&
                response.getCandidates().get(0).getContent().getParts() != null &&
                !response.getCandidates().get(0).getContent().getParts().isEmpty()) {
                
                String generatedText = response.getCandidates().get(0).getContent().getParts().get(0).getText();
                logger.info("Successfully received response from Gemini API");
                return generatedText;
            }

            logger.warn("Gemini API response was empty or malformed, falling back to mock response");
            return getFallbackResponse(request);

        } catch (WebClientResponseException e) {
            logger.error("Gemini API error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return getFallbackResponse(request);
        } catch (Exception e) {
            logger.error("Error calling Gemini API: ", e);
            return getFallbackResponse(request);
        }
    }

    private String buildPrompt(AIQueryRequest request) {
        StringBuilder prompt = new StringBuilder();
        
        // Add context based on request type
        switch (request.getType().toUpperCase()) {
            case "CONCEPT":
                prompt.append("Please explain the following concept in a clear and educational way: ");
                break;
            case "PROBLEM":
                prompt.append("Please help solve this problem step by step: ");
                break;
            case "EXPLANATION":
                prompt.append("Please provide a detailed explanation for: ");
                break;
            case "HOMEWORK":
                prompt.append("Please provide guidance for this homework question: ");
                break;
            default:
                prompt.append("Please help with: ");
        }
        
        prompt.append(request.getQuestion());
        
        // Add context if provided
        if (request.getContext() != null && !request.getContext().trim().isEmpty()) {
            prompt.append("\n\nContext: ").append(request.getContext());
        }
        
        // Add subject-specific guidance
        if (request.getSubjectId() != null) {
            prompt.append("\n\nPlease provide an answer suitable for educational purposes.");
        }

        return prompt.toString();
    }

    private GeminiRequest createGeminiRequest(String prompt) {
        GeminiRequest.Part part = new GeminiRequest.Part(prompt);
        GeminiRequest.Content content = new GeminiRequest.Content(List.of(part));
        return new GeminiRequest(List.of(content));
    }

    private String getFallbackResponse(AIQueryRequest request) {
        return switch (request.getType().toUpperCase()) {
            case "CONCEPT" -> "I understand you're asking about a concept. While I'm temporarily unable to provide a detailed explanation, I recommend consulting your textbook or speaking with your teacher for more information about: " + request.getQuestion();
            case "PROBLEM" -> "For this problem, I recommend breaking it down into smaller steps. Consider reviewing similar examples in your study materials for: " + request.getQuestion();
            case "EXPLANATION" -> "This topic requires careful explanation. Please refer to your course materials or ask your instructor for detailed information about: " + request.getQuestion();
            case "HOMEWORK" -> "For homework assistance, I recommend reviewing your course notes and working through similar practice problems related to: " + request.getQuestion();
            default -> "I'm here to help with your question. Please try again later or consult your educational resources for: " + request.getQuestion();
        };
    }
}