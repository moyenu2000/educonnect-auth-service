package com.educonnect.assessment.controller;

import com.educonnect.assessment.dto.ApiResponse;
import com.educonnect.assessment.enums.Period;
import com.educonnect.assessment.service.AnalyticsService;
import com.educonnect.assessment.service.DailyQuestionService;
import com.educonnect.assessment.service.PracticeProblemService;
import com.educonnect.assessment.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private DailyQuestionService dailyQuestionService;

    @Autowired
    private PracticeProblemService practiceProblemService;

    @Autowired
    private QuestionService questionService;

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminAnalytics(
            @RequestParam(required = false) Period period,
            @RequestParam(required = false) String type) {
        
        Map<String, Object> analytics = analyticsService.getAdminAnalytics(period, type);
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }

    @PutMapping("/daily-questions")
    public ResponseEntity<ApiResponse<String>> setDailyQuestions(
            @RequestBody SetDailyQuestionsRequest request) {
        
        dailyQuestionService.setDailyQuestions(request.getDate(), request.getQuestionIds(), 
                request.getSubjectDistribution());
        return ResponseEntity.ok(ApiResponse.success("Daily questions updated successfully"));
    }

    // Note: Live exams and contests would be implemented here
    // For now, returning mock responses

    @PostMapping("/live-exams")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createLiveExam(
            @RequestBody Map<String, Object> examData) {
        
        Map<String, Object> mockExam = Map.of(
            "id", 1L,
            "title", examData.get("title"),
            "status", "SCHEDULED",
            "message", "Live exam created successfully"
        );
        
        return ResponseEntity.ok(ApiResponse.success(mockExam, "Live exam created successfully"));
    }

    @PostMapping("/contests")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createContest(
            @RequestBody Map<String, Object> contestData) {
        
        Map<String, Object> mockContest = Map.of(
            "id", 1L,
            "title", contestData.get("title"),
            "status", "UPCOMING",
            "message", "Contest created successfully"
        );
        
        return ResponseEntity.ok(ApiResponse.success(mockContest, "Contest created successfully"));
    }

    @PostMapping("/create-practice-problems")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createPracticeProblems(
            @RequestParam(required = false) Long subjectId,
            @RequestParam(defaultValue = "20") int count) {
        
        // Get random questions to convert to practice problems
        var questions = questionService.getRandomQuestions(subjectId, null, count);
        
        int created = 0;
        int skipped = 0;
        
        for (var question : questions) {
            try {
                practiceProblemService.createProblemFromQuestion(question.getId());
                created++;
            } catch (Exception e) {
                skipped++;
            }
        }
        
        Map<String, Object> result = Map.of(
            "created", created,
            "skipped", skipped,
            "total", questions.size(),
            "message", String.format("Created %d practice problems from %d questions", created, questions.size())
        );
        
        return ResponseEntity.ok(ApiResponse.success(result, "Practice problems created successfully"));
    }

    @PostMapping("/create-practice-problems-from-ids")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createPracticeProblemsFromIds(
            @RequestBody List<Long> questionIds) {
        
        int created = 0;
        int skipped = 0;
        
        for (Long questionId : questionIds) {
            try {
                practiceProblemService.createProblemFromQuestion(questionId);
                created++;
            } catch (Exception e) {
                skipped++;
            }
        }
        
        Map<String, Object> result = Map.of(
            "created", created,
            "skipped", skipped,
            "total", questionIds.size(),
            "message", String.format("Created %d practice problems from %d question IDs", created, questionIds.size())
        );
        
        return ResponseEntity.ok(ApiResponse.success(result, "Practice problems created successfully"));
    }

    @PostMapping("/add-questions-to-daily")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER')")
    public ResponseEntity<ApiResponse<String>> addQuestionsToDailyQuestions(
            @RequestBody AddQuestionsToDailyRequest request) {
        
        dailyQuestionService.setDailyQuestions(request.getDate(), request.getQuestionIds(), 
                request.getSubjectDistribution());
        return ResponseEntity.ok(ApiResponse.success("Questions added to daily questions successfully"));
    }

    @PostMapping("/add-questions-to-practice")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> addQuestionsToPractice(
            @RequestBody List<Long> questionIds) {
        
        int created = 0;
        int skipped = 0;
        
        for (Long questionId : questionIds) {
            try {
                practiceProblemService.createProblemFromQuestion(questionId);
                created++;
            } catch (Exception e) {
                skipped++;
            }
        }
        
        Map<String, Object> result = Map.of(
            "created", created,
            "skipped", skipped,
            "total", questionIds.size(),
            "message", String.format("Added %d questions to practice problems", created)
        );
        
        return ResponseEntity.ok(ApiResponse.success(result, "Questions added to practice problems successfully"));
    }

    @GetMapping("/questions/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getQuestionStats() {
        Map<String, Object> stats = questionService.getQuestionStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/practice-problems-test")
    public ResponseEntity<ApiResponse<Map<String, Object>>> testPracticeProblems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            var pageable = org.springframework.data.domain.PageRequest.of(page, size);
            var problemPage = practiceProblemService.getProblems(null, null, null, null, null, null, null, pageable);
            
            Map<String, Object> response = Map.of(
                "problems", problemPage.getContent(),
                "totalElements", problemPage.getTotalElements(),
                "totalPages", problemPage.getTotalPages(),
                "currentPage", page,
                "size", size
            );
            
            return ResponseEntity.ok(ApiResponse.success(response, "Practice problems retrieved successfully"));
        } catch (Exception e) {
            Map<String, Object> errorInfo = Map.of(
                "error", e.getMessage(),
                "cause", e.getCause() != null ? e.getCause().getMessage() : "Unknown"
            );
            return ResponseEntity.ok(ApiResponse.success(errorInfo, "Error occurred while fetching practice problems"));
        }
    }

    // Inner classes for request DTOs
    public static class SetDailyQuestionsRequest {
        private LocalDate date;
        private List<Long> questionIds;
        private Map<String, Object> subjectDistribution;

        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
        public List<Long> getQuestionIds() { return questionIds; }
        public void setQuestionIds(List<Long> questionIds) { this.questionIds = questionIds; }
        public Map<String, Object> getSubjectDistribution() { return subjectDistribution; }
        public void setSubjectDistribution(Map<String, Object> subjectDistribution) { 
            this.subjectDistribution = subjectDistribution; 
        }
    }

    public static class AddQuestionsToDailyRequest {
        private LocalDate date;
        private List<Long> questionIds;
        private Map<String, Object> subjectDistribution;

        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
        public List<Long> getQuestionIds() { return questionIds; }
        public void setQuestionIds(List<Long> questionIds) { this.questionIds = questionIds; }
        public Map<String, Object> getSubjectDistribution() { return subjectDistribution; }
        public void setSubjectDistribution(Map<String, Object> subjectDistribution) { 
            this.subjectDistribution = subjectDistribution; 
        }
    }
}