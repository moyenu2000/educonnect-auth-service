package com.educonnect.assessment.controller;

import com.educonnect.assessment.dto.ApiResponse;
import com.educonnect.assessment.dto.PagedResponse;
import com.educonnect.assessment.entity.DailyQuestion;
import com.educonnect.assessment.entity.UserSubmission;
import com.educonnect.assessment.enums.ClassLevel;
import com.educonnect.assessment.enums.Difficulty;
import com.educonnect.assessment.enums.Period;
import com.educonnect.assessment.service.DailyQuestionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/daily-questions")
public class DailyQuestionController {

    @Autowired
    private DailyQuestionService dailyQuestionService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDailyQuestions(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) ClassLevel classLevel,
            @RequestParam(required = false) Difficulty difficulty) {
        
        Map<String, Object> result = dailyQuestionService.getDailyQuestions(date, subjectId, classLevel, difficulty);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<List<DailyQuestion>>> getPublicDailyQuestions() {
        List<DailyQuestion> questions = dailyQuestionService.getPublicDailyQuestions();
        return ResponseEntity.ok(ApiResponse.success(questions));
    }

    @PostMapping("/{questionId}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitDailyQuestionAnswer(
            @PathVariable Long questionId,
            @Valid @RequestBody SubmitAnswerRequest request) {
        
        Map<String, Object> result = dailyQuestionService.submitDailyQuestionAnswer(
                questionId, request.getAnswer(), request.getTimeTaken(), request.getExplanation());
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/today")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTodayDailyQuestions(
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) ClassLevel classLevel,
            @RequestParam(required = false) Difficulty difficulty) {
        
        Map<String, Object> todayQuestions = dailyQuestionService.getDailyQuestions(LocalDate.now(), subjectId, classLevel, difficulty);
        return ResponseEntity.ok(ApiResponse.success(todayQuestions));
    }

    @GetMapping("/streak")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserStreakInfo(
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Period period) {
        
        // Get current user ID from security context
        Long userId = com.educonnect.assessment.util.SecurityUtils.getCurrentUserId().orElseThrow(() -> new RuntimeException("User not authenticated"));
        Map<String, Object> streakInfo = dailyQuestionService.getUserStreakInfo(userId, subjectId);
        return ResponseEntity.ok(ApiResponse.success(streakInfo));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDailyQuestionStats(
            @RequestParam(required = false) Period period,
            @RequestParam(required = false) Long subjectId) {
        
        // Get current user ID from security context  
        Long userId = com.educonnect.assessment.util.SecurityUtils.getCurrentUserId().orElseThrow(() -> new RuntimeException("User not authenticated"));
        Map<String, Object> stats = dailyQuestionService.getUserStreakInfo(userId, subjectId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<PagedResponse<UserSubmission>>> getDailyQuestionHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Boolean status,
            @RequestParam(required = false) Difficulty difficulty) {
        
        PagedResponse<UserSubmission> history = dailyQuestionService.getDailyQuestionHistory(
                page, size, subjectId, status, difficulty);
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    // Admin endpoint (temporarily allow STUDENT for testing)
    @PutMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<String>> setDailyQuestions(
            @Valid @RequestBody SetDailyQuestionsRequest request) {
        
        dailyQuestionService.setDailyQuestions(request.getDate(), request.getQuestionIds(), 
                request.getSubjectDistribution());
        return ResponseEntity.ok(ApiResponse.success("Daily questions set successfully"));
    }

    // Inner classes for request DTOs
    public static class SubmitAnswerRequest {
        private String answer;
        private Integer timeTaken;
        private String explanation;

        public String getAnswer() { return answer; }
        public void setAnswer(String answer) { this.answer = answer; }
        public Integer getTimeTaken() { return timeTaken; }
        public void setTimeTaken(Integer timeTaken) { this.timeTaken = timeTaken; }
        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }
    }

    public static class SetDailyQuestionsRequest {
        private LocalDate date;
        private List<Long> questionIds;
        private Map<String, Object> subjectDistribution;

        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
        public List<Long> getQuestionIds() { return questionIds; }
        public void setQuestionIds(List<Long> questionIds) { this.questionIds = questionIds; }
        public Map<String, Object> getSubjectDistribution() { return subjectDistribution; }
        public void setSubjectDistribution(Map<String, Object> subjectDistribution) { this.subjectDistribution = subjectDistribution; }
    }
}