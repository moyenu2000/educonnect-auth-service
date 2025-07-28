package com.educonnect.discussion.service.impl;

import com.educonnect.discussion.dto.AIQueryRequest;
import com.educonnect.discussion.dto.AIQueryResponse;
import com.educonnect.discussion.dto.PagedResponse;
import com.educonnect.discussion.entity.AIQuery;
import com.educonnect.discussion.entity.User;
import com.educonnect.discussion.exception.ResourceNotFoundException;
import com.educonnect.discussion.repository.AIQueryRepository;
import com.educonnect.discussion.repository.UserRepository;
import com.educonnect.discussion.service.AIService;
import com.educonnect.discussion.service.GeminiService;
import com.educonnect.discussion.service.UserSyncService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
@Transactional
public class AIServiceImpl implements AIService {

    private static final Logger logger = LoggerFactory.getLogger(AIServiceImpl.class);

    @Autowired
    private AIQueryRepository aiQueryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSyncService userSyncService;

    @Autowired
    private GeminiService geminiService;

    @Override
    public AIQueryResponse askAI(AIQueryRequest request, Long userId) {
        User user = userSyncService.getOrCreateUser(userId);

        logger.info("Processing AI request for user {} - Type: {}, Question: {}", 
                   userId, request.getType(), request.getQuestion().substring(0, Math.min(request.getQuestion().length(), 50)) + "...");

        // Call real Gemini AI service
        AIQueryResponse response = processAIQueryWithGemini(request);

        // Save query to history
        AIQuery aiQuery = new AIQuery();
        aiQuery.setQuestion(request.getQuestion());
        aiQuery.setAnswer(response.getAnswer());
        aiQuery.setType(request.getType());
        aiQuery.setSubjectId(request.getSubjectId());
        aiQuery.setTopicId(request.getTopicId());
        aiQuery.setContext(request.getContext());
        aiQuery.setConfidence(response.getConfidence());
        aiQuery.setSources(response.getSources());
        aiQuery.setUser(user);

        aiQueryRepository.save(aiQuery);

        logger.info("Successfully processed and saved AI query with ID: {}", aiQuery.getId());
        return response;
    }

    @Override
    public PagedResponse<AIQuery> getAIHistory(Long userId, Long subjectId, Pageable pageable) {
        Page<AIQuery> queriesPage = aiQueryRepository.findByUserIdAndSubjectId(userId, subjectId, pageable);
        return PagedResponse.of(queriesPage);
    }

    private AIQueryResponse processAIQueryWithGemini(AIQueryRequest request) {
        try {
            // Call Gemini AI service
            String aiGeneratedAnswer = geminiService.generateContent(request);
            
            // Calculate confidence based on response quality
            Double confidence = calculateConfidence(aiGeneratedAnswer, request);
            
            // Generate relevant sources
            List<String> sources = generateRelevantSources(request);
            
            // Generate follow-up questions
            List<String> followUpQuestions = generateFollowUpQuestions(request.getType());

            logger.info("Successfully generated AI response with {} characters", aiGeneratedAnswer.length());
            return new AIQueryResponse(aiGeneratedAnswer, sources, confidence, followUpQuestions);
            
        } catch (Exception e) {
            logger.error("Error processing AI query with Gemini: ", e);
            // Fallback to a helpful error response
            return createFallbackResponse(request);
        }
    }

    private Double calculateConfidence(String answer, AIQueryRequest request) {
        // Simple confidence calculation based on response length and content
        if (answer == null || answer.trim().length() < 20) {
            return 0.3;
        } else if (answer.length() > 100 && answer.contains(getKeyTerms(request))) {
            return 0.9;
        } else if (answer.length() > 50) {
            return 0.75;
        } else {
            return 0.6;
        }
    }

    private String getKeyTerms(AIQueryRequest request) {
        // Extract key terms from the question for confidence assessment
        return request.getQuestion().toLowerCase();
    }

    private List<String> generateRelevantSources(AIQueryRequest request) {
        // Generate contextual sources based on request type and subject
        return switch (request.getType().toUpperCase()) {
            case "CONCEPT" -> Arrays.asList(
                "Gemini AI - Concept Explanation",
                "Educational Standards Database",
                "Academic Reference Materials"
            );
            case "PROBLEM" -> Arrays.asList(
                "Gemini AI - Problem Solving",
                "Mathematical Reference Guide", 
                "Step-by-Step Solution Methods"
            );
            case "HOMEWORK" -> Arrays.asList(
                "Gemini AI - Educational Assistance",
                "Study Guide Resources",
                "Homework Help Database"
            );
            default -> Arrays.asList(
                "Gemini AI - General Knowledge",
                "Educational Resource Library",
                "Academic Support Materials"
            );
        };
    }

    private AIQueryResponse createFallbackResponse(AIQueryRequest request) {
        String fallbackAnswer = "I apologize, but I'm currently unable to process your request. Please try again later or contact your instructor for assistance with: " + request.getQuestion();
        List<String> sources = Arrays.asList("System Fallback Response");
        Double confidence = 0.1;
        List<String> followUpQuestions = Arrays.asList(
            "Would you like to try rephrasing your question?",
            "Do you need help with a different topic?"
        );
        return new AIQueryResponse(fallbackAnswer, sources, confidence, followUpQuestions);
    }


    private List<String> generateFollowUpQuestions(String type) {
        return switch (type.toUpperCase()) {
            case "CONCEPT" -> Arrays.asList(
                "Would you like me to explain any specific part in more detail?",
                "Are there related concepts you'd like to explore?",
                "Would you like to see some practice examples?"
            );
            case "PROBLEM" -> Arrays.asList(
                "Would you like to try a similar problem?",
                "Do you need clarification on any of the steps?",
                "Would you like to see alternative solution methods?"
            );
            default -> Arrays.asList(
                "Is there anything specific you'd like me to clarify?",
                "Would you like more examples?",
                "Do you have any related questions?"
            );
        };
    }
}