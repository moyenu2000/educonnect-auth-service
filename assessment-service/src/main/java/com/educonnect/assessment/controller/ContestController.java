package com.educonnect.assessment.controller;

import com.educonnect.assessment.dto.ApiResponse;
import com.educonnect.assessment.dto.PagedResponse;
import com.educonnect.assessment.entity.Contest;
import com.educonnect.assessment.entity.Question;
import com.educonnect.assessment.entity.UserSubmission;
import com.educonnect.assessment.enums.ContestStatus;
import com.educonnect.assessment.enums.ContestType;
import com.educonnect.assessment.service.ContestService;
import com.educonnect.assessment.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/contests")
public class ContestController {

    @Autowired
    private ContestService contestService;

    // Get all contests (with filters)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<PagedResponse<Contest>>> getAllContests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) ContestStatus status,
            @RequestParam(required = false) ContestType type) {
        
        PagedResponse<Contest> contests = contestService.getAllContests(page, size, status, type);
        return ResponseEntity.ok(ApiResponse.success(contests));
    }

    // Get public contests (no auth required)
    @GetMapping("/public")
    public ResponseEntity<ApiResponse<List<Contest>>> getPublicContests() {
        List<Contest> contests = contestService.getPublicContests();
        return ResponseEntity.ok(ApiResponse.success(contests));
    }

    // Get contest details by ID
    @GetMapping("/{contestId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getContestDetails(@PathVariable Long contestId) {
        Map<String, Object> contestDetails = contestService.getContestDetails(contestId);
        return ResponseEntity.ok(ApiResponse.success(contestDetails));
    }

    // Get contest questions (only when contest is active)
    @GetMapping("/{contestId}/questions")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<Question>>> getContestQuestions(@PathVariable Long contestId) {
        List<Question> questions = contestService.getContestQuestions(contestId);
        return ResponseEntity.ok(ApiResponse.success(questions));
    }

    // Submit answer to contest question
    @PostMapping("/{contestId}/questions/{questionId}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitContestAnswer(
            @PathVariable Long contestId,
            @PathVariable Long questionId,
            @Valid @RequestBody ContestSubmissionRequest request) {
        
        Long userId = SecurityUtils.getCurrentUserId();
        Map<String, Object> result = contestService.submitContestAnswer(
                contestId, questionId, userId, request.getAnswer(), request.getTimeTaken(), request.getExplanation());
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // Get contest leaderboard
    @GetMapping("/{contestId}/leaderboard")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getContestLeaderboard(
            @PathVariable Long contestId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Map<String, Object> leaderboard = contestService.getContestLeaderboard(contestId, page, size);
        return ResponseEntity.ok(ApiResponse.success(leaderboard));
    }

    // Get user's contest submissions
    @GetMapping("/{contestId}/submissions")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<UserSubmission>>> getUserContestSubmissions(@PathVariable Long contestId) {
        Long userId = SecurityUtils.getCurrentUserId();
        List<UserSubmission> submissions = contestService.getUserContestSubmissions(contestId, userId);
        return ResponseEntity.ok(ApiResponse.success(submissions));
    }

    // Get all contest submissions for a user (across all contests)
    @GetMapping("/my-submissions")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<PagedResponse<UserSubmission>>> getMyContestSubmissions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) ContestStatus contestStatus) {
        
        Long userId = SecurityUtils.getCurrentUserId();
        PagedResponse<UserSubmission> submissions = contestService.getUserContestSubmissions(userId, page, size, contestStatus);
        return ResponseEntity.ok(ApiResponse.success(submissions));
    }

    // Join/Register for contest
    @PostMapping("/{contestId}/join")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<String>> joinContest(@PathVariable Long contestId) {
        Long userId = SecurityUtils.getCurrentUserId();
        contestService.joinContest(contestId, userId);
        return ResponseEntity.ok(ApiResponse.success("Successfully joined the contest"));
    }

    // Get contest results (after contest ends)
    @GetMapping("/{contestId}/results")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getContestResults(@PathVariable Long contestId) {
        Map<String, Object> results = contestService.getContestResults(contestId);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    // Admin/Question Setter endpoints
    
    // Create contest
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER')")
    public ResponseEntity<ApiResponse<Contest>> createContest(@Valid @RequestBody ContestRequest request) {
        Contest contest = contestService.createContest(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(contest, "Contest created successfully"));
    }

    // Update contest
    @PutMapping("/{contestId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER')")
    public ResponseEntity<ApiResponse<Contest>> updateContest(
            @PathVariable Long contestId,
            @Valid @RequestBody ContestRequest request) {
        
        Contest contest = contestService.updateContest(contestId, request);
        return ResponseEntity.ok(ApiResponse.success(contest, "Contest updated successfully"));
    }

    // Delete contest
    @DeleteMapping("/{contestId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteContest(@PathVariable Long contestId) {
        contestService.deleteContest(contestId);
        return ResponseEntity.ok(ApiResponse.success("Contest deleted successfully"));
    }

    // Start contest manually (admin only)
    @PostMapping("/{contestId}/start")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> startContest(@PathVariable Long contestId) {
        contestService.startContest(contestId);
        return ResponseEntity.ok(ApiResponse.success("Contest started successfully"));
    }

    // End contest manually (admin only)
    @PostMapping("/{contestId}/end")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> endContest(@PathVariable Long contestId) {
        contestService.endContest(contestId);
        return ResponseEntity.ok(ApiResponse.success("Contest ended successfully"));
    }

    // DTOs
    public static class ContestSubmissionRequest {
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

    public static class ContestRequest {
        private String title;
        private String description;
        private ContestType type;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private Integer duration;
        private List<Long> problemIds;
        private List<String> prizes;
        private String rules;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public ContestType getType() { return type; }
        public void setType(ContestType type) { this.type = type; }
        public LocalDateTime getStartTime() { return startTime; }
        public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
        public LocalDateTime getEndTime() { return endTime; }
        public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
        public Integer getDuration() { return duration; }
        public void setDuration(Integer duration) { this.duration = duration; }
        public List<Long> getProblemIds() { return problemIds; }
        public void setProblemIds(List<Long> problemIds) { this.problemIds = problemIds; }
        public List<String> getPrizes() { return prizes; }
        public void setPrizes(List<String> prizes) { this.prizes = prizes; }
        public String getRules() { return rules; }
        public void setRules(String rules) { this.rules = rules; }
    }
}