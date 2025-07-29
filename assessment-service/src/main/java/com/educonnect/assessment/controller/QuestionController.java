package com.educonnect.assessment.controller;

import com.educonnect.assessment.dto.ApiResponse;
import com.educonnect.assessment.dto.QuestionRequest;
import com.educonnect.assessment.dto.QuestionResponse;
import com.educonnect.assessment.entity.Question;
import com.educonnect.assessment.enums.Difficulty;
import com.educonnect.assessment.enums.QuestionType;
import com.educonnect.assessment.service.QuestionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Long topicId,
            @RequestParam(required = false) Difficulty difficulty,
            @RequestParam(required = false) QuestionType type,
            @RequestParam(required = false) String search) {
        
        Map<String, Object> result = questionService.getQuestionsWithFiltersEnhanced(
                page, size, subjectId, topicId, difficulty, type, search);
        return ResponseEntity.ok(ApiResponse.success(result));
    }


    @GetMapping("/{questionId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER')")
    public ResponseEntity<ApiResponse<QuestionResponse>> getQuestionById(@PathVariable Long questionId) {
        QuestionResponse question = questionService.getQuestionResponseById(questionId);
        return ResponseEntity.ok(ApiResponse.success(question));
    }


    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER')")
    public ResponseEntity<ApiResponse<QuestionResponse>> createQuestion(@Valid @RequestBody QuestionRequest request) {
        Question question = questionService.createQuestion(request);
        QuestionResponse response = questionService.convertToResponse(question);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Question created successfully"));
    }

    @PutMapping("/{questionId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER')")
    public ResponseEntity<ApiResponse<QuestionResponse>> updateQuestion(
            @PathVariable Long questionId,
            @Valid @RequestBody QuestionRequest request) {
        
        Question question = questionService.updateQuestion(questionId, request);
        QuestionResponse response = questionService.convertToResponse(question);
        return ResponseEntity.ok(ApiResponse.success(response, "Question updated successfully"));
    }

    @DeleteMapping("/{questionId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER')")
    public ResponseEntity<ApiResponse<String>> deleteQuestion(@PathVariable Long questionId) {
        questionService.deleteQuestion(questionId);
        return ResponseEntity.ok(ApiResponse.success("Question deleted successfully"));
    }

    @PostMapping("/bulk")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bulkImportQuestions(
            @RequestBody Map<String, Object> requestBody) {
        
        @SuppressWarnings("unchecked")
        List<QuestionRequest> questions = (List<QuestionRequest>) requestBody.get("questions");
        Long subjectId = requestBody.get("subjectId") != null ? 
                Long.valueOf(requestBody.get("subjectId").toString()) : null;
        Long topicId = requestBody.get("topicId") != null ? 
                Long.valueOf(requestBody.get("topicId").toString()) : null;

        Map<String, Object> result = questionService.bulkImportQuestions(questions, subjectId, topicId);
        return ResponseEntity.ok(ApiResponse.success(result, "Bulk import completed"));
    }

    @GetMapping("/private/{questionId}")
    // @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN') or hasRole('QUESTION_SETTER')") // Temporarily disabled for testing
    public ResponseEntity<ApiResponse<QuestionResponse>> getPrivateQuestionById(@PathVariable Long questionId) {
        try {
            System.out.println("DEBUG: Getting private question with ID: " + questionId);
            QuestionResponse question = questionService.getQuestionResponseById(questionId);
            System.out.println("DEBUG: Successfully retrieved question: " + question.getText());
            return ResponseEntity.ok(ApiResponse.success(question));
        } catch (Exception e) {
            System.out.println("DEBUG: Error getting question " + questionId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch question: " + e.getMessage()));
        }
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllPublicQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Long topicId,
            @RequestParam(required = false) Difficulty difficulty,
            @RequestParam(required = false) QuestionType type,
            @RequestParam(required = false) String search) {
        
        try {
            System.out.println("DEBUG: Getting all public questions with page=" + page + ", size=" + size);
            Map<String, Object> result = questionService.getQuestionsWithFiltersEnhanced(
                    page, size, subjectId, topicId, difficulty, type, search);
            return ResponseEntity.ok(ApiResponse.success(result));
        } catch (Exception e) {
            System.out.println("DEBUG: Error getting public questions: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch questions: " + e.getMessage()));
        }
    }

    @GetMapping("/test-simple/{questionId}")
    public ResponseEntity<ApiResponse<String>> testSimpleQuestion(@PathVariable Long questionId) {
        try {
            System.out.println("DEBUG: Test simple endpoint called with ID: " + questionId);
            
            // Just try to get the question
            QuestionResponse question = questionService.getQuestionResponseById(questionId);
            return ResponseEntity.ok(ApiResponse.success("Question exists with ID: " + questionId + " - " + question.getText()));
        } catch (Exception e) {
            System.out.println("DEBUG: Error in test simple: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Question not found with ID: " + questionId));
        }
    }
}