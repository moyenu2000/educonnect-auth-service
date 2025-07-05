package com.educonnect.assessment.controller;

import com.educonnect.assessment.dto.ApiResponse;
import com.educonnect.assessment.dto.QuestionRequest;
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
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Long topicId,
            @RequestParam(required = false) Difficulty difficulty,
            @RequestParam(required = false) QuestionType type,
            @RequestParam(required = false) String search) {
        
        Map<String, Object> result = questionService.getQuestionsWithFilters(
                page, size, subjectId, topicId, difficulty, type, search);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{questionId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Question>> getQuestionById(@PathVariable Long questionId) {
        Question question = questionService.getActiveQuestionById(questionId);
        return ResponseEntity.ok(ApiResponse.success(question));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER')")
    public ResponseEntity<ApiResponse<Question>> createQuestion(@Valid @RequestBody QuestionRequest request) {
        Question question = questionService.createQuestion(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(question, "Question created successfully"));
    }

    @PutMapping("/{questionId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER')")
    public ResponseEntity<ApiResponse<Question>> updateQuestion(
            @PathVariable Long questionId,
            @Valid @RequestBody QuestionRequest request) {
        
        Question question = questionService.updateQuestion(questionId, request);
        return ResponseEntity.ok(ApiResponse.success(question, "Question updated successfully"));
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
}