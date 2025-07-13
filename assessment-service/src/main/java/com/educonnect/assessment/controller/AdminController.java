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

    // Inner class for request DTO
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
}