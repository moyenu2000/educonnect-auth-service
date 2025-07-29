package com.educonnect.assessment.controller;

import com.educonnect.assessment.dto.*;
import com.educonnect.assessment.entity.PracticeProblem;
import com.educonnect.assessment.entity.Question;
import com.educonnect.assessment.enums.Difficulty;
import com.educonnect.assessment.repository.PracticeProblemRepository;
import com.educonnect.assessment.service.PracticeQuestionSubmissionService;
import com.educonnect.assessment.service.QuestionService;
import com.educonnect.assessment.util.SecurityUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/practice-questions")
public class PracticeQuestionController {

    @Autowired
    private PracticeQuestionSubmissionService submissionService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private PracticeProblemRepository practiceProblemRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPracticeQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Long topicId,
            @RequestParam(required = false) Difficulty difficulty,
            @RequestParam(required = false) String search) {

        Long userId = getCurrentUserId();
        
        // Create pageable (sorting handled in SQL query)
        Pageable pageable = PageRequest.of(page, size);
        
        // Get practice problems with filtering
        String difficultyStr = difficulty != null ? difficulty.name() : null;
        Page<PracticeProblem> practiceProblems = practiceProblemRepository.findActiveProblemsWithFilters(
                subjectId, topicId, difficultyStr, null, search, pageable);

        // Convert to response DTOs with submission status
        Page<PracticeQuestionResponse> questionResponses = practiceProblems.map(practiceProblem -> {
            Question question = practiceProblem.getQuestion();
            PracticeQuestionResponse response = convertToPracticeQuestionResponse(question, practiceProblem);
            
            // Add submission status for current user
            if (userId != null) {
                String submissionStatus = submissionService.getSubmissionStatus(userId, question.getId());
                response.setSubmissionStatus(submissionStatus);
                response.setHasAttempted(!submissionStatus.equals("NOT_ATTEMPTED"));
                response.setHasSolved(submissionStatus.equals("SOLVED"));
                response.setTotalAttempts(submissionService.getUserTotalAttempts(userId, question.getId()));
                response.setBestScore(submissionService.getUserBestScore(userId, question.getId()));
                
                PracticeQuestionSubmissionResponse latestSubmission = submissionService.getLatestSubmission(userId, question.getId());
                if (latestSubmission != null) {
                    response.setLastAttemptAt(latestSubmission.getSubmittedAt());
                }
            }
            
            return response;
        });

        // Prepare response data
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("content", questionResponses.getContent());
        responseData.put("page", questionResponses.getNumber());
        responseData.put("size", questionResponses.getSize());
        responseData.put("totalElements", questionResponses.getTotalElements());
        responseData.put("totalPages", questionResponses.getTotalPages());
        responseData.put("first", questionResponses.isFirst());
        responseData.put("last", questionResponses.isLast());

        return ResponseEntity.ok(ApiResponse.success(responseData));
    }

    @GetMapping("/{questionId}")
    public ResponseEntity<ApiResponse<PracticeQuestionResponse>> getPracticeQuestion(@PathVariable Long questionId) {
        Long userId = getCurrentUserId();
        
        // Find practice problem by question ID
        PracticeProblem practiceProblem = practiceProblemRepository.findByQuestionIdAndIsActive(questionId, true)
                .orElseThrow(() -> new RuntimeException("Practice question not found with id: " + questionId));

        Question question = practiceProblem.getQuestion();
        PracticeQuestionResponse response = convertToPracticeQuestionResponse(question, practiceProblem);

        // Add submission status for current user
        if (userId != null) {
            String submissionStatus = submissionService.getSubmissionStatus(userId, questionId);
            response.setSubmissionStatus(submissionStatus);
            response.setHasAttempted(!submissionStatus.equals("NOT_ATTEMPTED"));
            response.setHasSolved(submissionStatus.equals("SOLVED"));
            response.setTotalAttempts(submissionService.getUserTotalAttempts(userId, questionId));
            response.setBestScore(submissionService.getUserBestScore(userId, questionId));
            
            PracticeQuestionSubmissionResponse latestSubmission = submissionService.getLatestSubmission(userId, questionId);
            if (latestSubmission != null) {
                response.setLastAttemptAt(latestSubmission.getSubmittedAt());
            }
        }

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{questionId}/submit")
    public ResponseEntity<ApiResponse<PracticeQuestionSubmissionResponse>> submitAnswer(
            @PathVariable Long questionId,
            @Valid @RequestBody PracticeQuestionSubmissionRequest request,
            HttpServletRequest httpRequest) {

        Long userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("User not authenticated"));
        }

        // Verify this is a practice question
        if (!practiceProblemRepository.existsByQuestionIdAndIsActive(questionId, true)) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Question is not available for practice"));
        }

        String ipAddress = getClientIpAddress(httpRequest);
        
        PracticeQuestionSubmissionResponse response = submissionService.submitAnswer(
                userId, questionId, request, ipAddress);

        return ResponseEntity.ok(ApiResponse.success(response, "Answer submitted successfully"));
    }

    @GetMapping("/{questionId}/submissions")
    public ResponseEntity<ApiResponse<List<PracticeQuestionSubmissionResponse>>> getQuestionSubmissions(
            @PathVariable Long questionId) {

        Long userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("User not authenticated"));
        }

        List<PracticeQuestionSubmissionResponse> submissions = 
                submissionService.getUserSubmissionsForQuestion(userId, questionId);

        return ResponseEntity.ok(ApiResponse.success(submissions));
    }

    @GetMapping("/submissions/history")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSubmissionHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        Long userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("User not authenticated"));
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "submittedAt"));
        
        Page<PracticeQuestionSubmissionResponse> submissions;
        
        if (startDate != null && endDate != null) {
            LocalDateTime start = LocalDateTime.parse(startDate + "T00:00:00");
            LocalDateTime end = LocalDateTime.parse(endDate + "T23:59:59");
            submissions = submissionService.getUserSubmissionHistory(userId, start, end, pageable);
        } else {
            submissions = submissionService.getUserSubmissions(userId, pageable);
        }

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("content", submissions.getContent());
        responseData.put("page", submissions.getNumber());
        responseData.put("size", submissions.getSize());
        responseData.put("totalElements", submissions.getTotalElements());
        responseData.put("totalPages", submissions.getTotalPages());

        return ResponseEntity.ok(ApiResponse.success(responseData));
    }

    @GetMapping("/submissions/stats")
    public ResponseEntity<ApiResponse<PracticeQuestionStatsResponse>> getUserStats() {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("User not authenticated"));
        }

        System.out.println("DEBUG: Getting stats for userId: " + userId);
        PracticeQuestionStatsResponse stats = submissionService.getUserStats(userId);
        System.out.println("DEBUG: Stats response: " + stats);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/submissions/recent")
    public ResponseEntity<ApiResponse<List<PracticeQuestionSubmissionResponse>>> getRecentSubmissions() {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("User not authenticated"));
        }

        List<PracticeQuestionSubmissionResponse> submissions = submissionService.getRecentSubmissions(userId);
        return ResponseEntity.ok(ApiResponse.success(submissions));
    }

    // Utility methods
    private Long getCurrentUserId() {
        return SecurityUtils.getCurrentUserId().orElse(93L); // Default test user ID for testing
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIP = request.getHeader("X-Real-IP");
        if (xRealIP != null && !xRealIP.isEmpty()) {
            return xRealIP;
        }
        
        return request.getRemoteAddr();
    }

    private PracticeQuestionResponse convertToPracticeQuestionResponse(Question question, PracticeProblem practiceProblem) {
        PracticeQuestionResponse response = new PracticeQuestionResponse();
        
        // Basic question data
        response.setId(practiceProblem.getId());
        response.setQuestionId(question.getId());
        response.setText(question.getText());
        response.setType(question.getType());
        response.setSubjectId(question.getSubjectId());
        response.setTopicId(question.getTopicId());
        response.setDifficulty(practiceProblem.getDifficulty()); // Use practice problem difficulty (may be overridden)
        response.setExplanation(question.getExplanation());
        response.setPoints(practiceProblem.getPoints()); // Use practice problem points (may be overridden)
        response.setTags(question.getTags());
        response.setAttachments(question.getAttachments());
        response.setIsActive(practiceProblem.getIsActive());
        response.setCreatedAt(practiceProblem.getCreatedAt());
        response.setUpdatedAt(practiceProblem.getUpdatedAt());

        // Subject and topic names
        if (question.getSubject() != null) {
            response.setSubjectName(question.getSubject().getName());
        }
        if (question.getTopic() != null) {
            response.setTopicName(question.getTopic().getName());
        }

        // Question options (for MCQ questions)
        if (question.getOptions() != null && !question.getOptions().isEmpty()) {
            List<QuestionOptionResponse> optionResponses = question.getOptions().stream()
                    .map(option -> new QuestionOptionResponse(option.getId(), option.getText(), option.getOptionOrder()))
                    .collect(Collectors.toList());
            response.setOptions(optionResponses);
        }

        // Practice problem specific data
        response.setHintText(practiceProblem.getHintText());
        response.setHints(practiceProblem.getHints());
        response.setSolutionSteps(practiceProblem.getSolutionSteps());

        return response;
    }
}