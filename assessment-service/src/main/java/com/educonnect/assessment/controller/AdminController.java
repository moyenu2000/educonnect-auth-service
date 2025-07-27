package com.educonnect.assessment.controller;

import com.educonnect.assessment.dto.ApiResponse;
import com.educonnect.assessment.dto.ContestRequest;
import com.educonnect.assessment.dto.ContestResponse;
import com.educonnect.assessment.dto.PagedResponse;
import com.educonnect.assessment.dto.PracticeProblemDto;
import com.educonnect.assessment.entity.Contest;
import com.educonnect.assessment.enums.ContestStatus;
import com.educonnect.assessment.enums.ContestType;
import com.educonnect.assessment.enums.Difficulty;
import com.educonnect.assessment.enums.Period;
import com.educonnect.assessment.enums.ProblemStatus;
import com.educonnect.assessment.enums.QuestionType;
import com.educonnect.assessment.exception.ResourceNotFoundException;
import com.educonnect.assessment.service.AnalyticsService;
import com.educonnect.assessment.service.ContestService;
import com.educonnect.assessment.service.DailyQuestionService;
import com.educonnect.assessment.service.PracticeProblemService;
import com.educonnect.assessment.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
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

    @Autowired
    private ContestService contestService;

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminAnalytics(
            @RequestParam(required = false) Period period,
            @RequestParam(required = false) String type) {
        
        Map<String, Object> analytics = analyticsService.getAdminAnalytics(period, type);
        return ResponseEntity.ok(ApiResponse.success(analytics));
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

    // Contest Management Endpoints
    @GetMapping("/contests")
    public ResponseEntity<ApiResponse<PagedResponse<ContestResponse>>> getAllContests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) ContestStatus status,
            @RequestParam(required = false) ContestType type) {
        
        try {
            PagedResponse<Contest> contestPage = contestService.getAllContests(page, size, status, type);
            
            // Convert Contest entities to ContestResponse DTOs
            List<ContestResponse> contestResponses = contestPage.getContent().stream()
                .map(this::convertToContestResponse)
                .collect(java.util.stream.Collectors.toList());
            
            PagedResponse<ContestResponse> response = new PagedResponse<>(
                contestResponses,
                contestPage.getTotalElements(),
                contestPage.getTotalPages(),
                contestPage.getCurrentPage(),
                contestPage.getSize()
            );
            
            return ResponseEntity.ok(ApiResponse.success(response, "Contests retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to retrieve contests: " + e.getMessage()));
        }
    }

    @GetMapping("/contests/{id}")
    public ResponseEntity<ApiResponse<ContestResponse>> getContest(@PathVariable Long id) {
        try {
            Map<String, Object> contestDetails = contestService.getContestDetails(id);
            Contest contest = (Contest) contestDetails.get("contest");
            ContestResponse response = convertToContestResponse(contest);
            return ResponseEntity.ok(ApiResponse.success(response, "Contest retrieved successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to retrieve contest: " + e.getMessage()));
        }
    }

    @PostMapping("/contests")
    public ResponseEntity<ApiResponse<ContestResponse>> createContest(
            @RequestBody ContestRequest request) {
        
        try {
            // Convert ContestRequest to ContestController.ContestRequest (existing implementation)
            ContestController.ContestRequest controllerRequest = new ContestController.ContestRequest();
            controllerRequest.setTitle(request.getTitle());
            controllerRequest.setDescription(request.getDescription());
            controllerRequest.setType(request.getType());
            controllerRequest.setStartTime(request.getStartTime());
            controllerRequest.setEndTime(request.getEndTime());
            controllerRequest.setDuration(request.getDuration());
            controllerRequest.setProblemIds(request.getProblemIds());
            controllerRequest.setPrizes(request.getPrizes());
            controllerRequest.setRules(request.getRules());
            
            Contest contest = contestService.createContest(controllerRequest);
            ContestResponse response = convertToContestResponse(contest);
            
            return ResponseEntity.ok(ApiResponse.success(response, "Contest created successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to create contest: " + e.getMessage()));
        }
    }

    @PutMapping("/contests/{id}")
    public ResponseEntity<ApiResponse<ContestResponse>> updateContest(
            @PathVariable Long id,
            @RequestBody ContestRequest request) {
        
        try {
            // Convert ContestRequest to ContestController.ContestRequest (existing implementation)
            ContestController.ContestRequest controllerRequest = new ContestController.ContestRequest();
            controllerRequest.setTitle(request.getTitle());
            controllerRequest.setDescription(request.getDescription());
            controllerRequest.setType(request.getType());
            controllerRequest.setStartTime(request.getStartTime());
            controllerRequest.setEndTime(request.getEndTime());
            controllerRequest.setDuration(request.getDuration());
            controllerRequest.setProblemIds(request.getProblemIds());
            controllerRequest.setPrizes(request.getPrizes());
            controllerRequest.setRules(request.getRules());
            
            Contest contest = contestService.updateContest(id, controllerRequest);
            ContestResponse response = convertToContestResponse(contest);
            
            return ResponseEntity.ok(ApiResponse.success(response, "Contest updated successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to update contest: " + e.getMessage()));
        }
    }

    @DeleteMapping("/contests/{id}")
    public ResponseEntity<ApiResponse<String>> deleteContest(@PathVariable Long id) {
        try {
            contestService.deleteContest(id);
            return ResponseEntity.ok(ApiResponse.success("Contest deleted successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to delete contest: " + e.getMessage()));
        }
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

    @PutMapping("/daily-questions")
    public ResponseEntity<ApiResponse<String>> setDailyQuestions(
            @RequestBody SetDailyQuestionsRequest request) {
        
        try {
            if (request.getQuestionIds() == null || request.getQuestionIds().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Question IDs cannot be empty"));
            }
            
            if (request.getDate() == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Date is required"));
            }
            
            dailyQuestionService.setDailyQuestions(request.getDate(), request.getQuestionIds(), 
                    request.getSubjectDistribution());
            
            return ResponseEntity.ok(ApiResponse.success(
                String.format("Successfully set %d questions for %s", 
                    request.getQuestionIds().size(), request.getDate())));
                    
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Question not found: " + e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error setting daily questions: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to set daily questions: " + e.getMessage()));
        }
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

    // Practice Problem Management Endpoints
    @GetMapping("/practice-problems")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllPracticeProblems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) String difficulty) {
        
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            Difficulty difficultyEnum = difficulty != null ? Difficulty.valueOf(difficulty.toUpperCase()) : null;
            
            Page<PracticeProblemDto> problemPage = practiceProblemService.getProblems(
                    subjectId, null, difficultyEnum, null, null, null, null, pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("content", problemPage.getContent());
            response.put("totalElements", problemPage.getTotalElements());
            response.put("totalPages", problemPage.getTotalPages());
            response.put("currentPage", page);
            response.put("size", size);
            response.put("first", problemPage.isFirst());
            response.put("last", problemPage.isLast());
            response.put("empty", problemPage.isEmpty());

            return ResponseEntity.ok(ApiResponse.success(response, "Practice problems retrieved successfully"));
        } catch (Exception e) {
            System.err.println("Error fetching practice problems: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to fetch practice problems: " + e.getMessage()));
        }
    }

    @PostMapping("/practice-problems")
    public ResponseEntity<ApiResponse<String>> createPracticeProblem(
            @RequestBody CreatePracticeProblemRequest request) {
        
        try {
            Difficulty difficultyEnum = request.getDifficulty() != null ? 
                Difficulty.valueOf(request.getDifficulty().toUpperCase()) : Difficulty.MEDIUM;
            
            // Use simple creation method that gets subject/topic from the question
            practiceProblemService.createProblemFromQuestion(request.getQuestionId());
            
            // Then update the difficulty and points if different from defaults
            if (request.getPoints() != null || difficultyEnum != null) {
                // Find the newly created practice problem
                // This is a simplified approach - in production you might want to get the ID back from creation
                practiceProblemService.updateProblemDifficulty(request.getQuestionId(), difficultyEnum);
            }
            
            return ResponseEntity.ok(ApiResponse.success("Practice problem created successfully"));
        } catch (Exception e) {
            System.err.println("Error creating practice problem: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to create practice problem: " + e.getMessage()));
        }
    }

    @PutMapping("/practice-problems/{id}")
    public ResponseEntity<ApiResponse<String>> updatePracticeProblem(
            @PathVariable Long id,
            @RequestBody UpdatePracticeProblemRequest request) {
        
        try {
            Difficulty difficultyEnum = request.getDifficulty() != null ? 
                Difficulty.valueOf(request.getDifficulty().toUpperCase()) : null;
            
            practiceProblemService.updatePracticeProblem(
                id,
                request.getPoints(),
                difficultyEnum,
                request.getHintText(),
                request.getHints(),
                request.getSolutionSteps()
            );
            
            // Handle isActive separately if the service has that method
            if (request.getIsActive() != null) {
                practiceProblemService.activateDeactivateProblem(id, request.getIsActive());
            }
            
            return ResponseEntity.ok(ApiResponse.success("Practice problem updated successfully"));
        } catch (Exception e) {
            System.err.println("Error updating practice problem: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to update practice problem: " + e.getMessage()));
        }
    }

    @DeleteMapping("/practice-problems/{id}")
    public ResponseEntity<ApiResponse<String>> deletePracticeProblem(@PathVariable Long id) {
        try {
            practiceProblemService.deletePracticeProblem(id);
            return ResponseEntity.ok(ApiResponse.success("Practice problem deleted successfully"));
        } catch (Exception e) {
            System.err.println("Error deleting practice problem: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to delete practice problem: " + e.getMessage()));
        }
    }

    @PostMapping("/practice-problems/add-question")
    public ResponseEntity<ApiResponse<String>> addQuestionToPractice(
            @RequestBody CreatePracticeProblemRequest request) {
        
        try {
            Difficulty difficultyEnum = request.getDifficulty() != null ? 
                Difficulty.valueOf(request.getDifficulty().toUpperCase()) : Difficulty.MEDIUM;
            
            // Use simple creation method that gets subject/topic from the question
            practiceProblemService.createProblemFromQuestion(request.getQuestionId());
            
            // Then update the difficulty if different from default
            if (difficultyEnum != null) {
                practiceProblemService.updateProblemDifficulty(request.getQuestionId(), difficultyEnum);
            }
            
            return ResponseEntity.ok(ApiResponse.success("Question added to practice problems successfully"));
        } catch (Exception e) {
            System.err.println("Error adding question to practice: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to add question to practice: " + e.getMessage()));
        }
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

    public static class CreatePracticeProblemRequest {
        private Long questionId;
        private String difficulty;
        private Integer points;
        
        // Optional fields for advanced usage
        private Long subjectId;
        private Long topicId;
        private String hintText;
        private List<String> hints;
        private String solutionSteps;

        // Getters and setters
        public Long getQuestionId() { return questionId; }
        public void setQuestionId(Long questionId) { this.questionId = questionId; }
        public String getDifficulty() { return difficulty; }
        public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
        public Integer getPoints() { return points; }
        public void setPoints(Integer points) { this.points = points; }
        
        // Optional getters and setters
        public Long getSubjectId() { return subjectId; }
        public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
        public Long getTopicId() { return topicId; }
        public void setTopicId(Long topicId) { this.topicId = topicId; }
        public String getHintText() { return hintText; }
        public void setHintText(String hintText) { this.hintText = hintText; }
        public List<String> getHints() { return hints; }
        public void setHints(List<String> hints) { this.hints = hints; }
        public String getSolutionSteps() { return solutionSteps; }
        public void setSolutionSteps(String solutionSteps) { this.solutionSteps = solutionSteps; }
    }

    public static class UpdatePracticeProblemRequest {
        private Long subjectId;
        private Long topicId;
        private String difficulty;
        private Integer points;
        private String hintText;
        private List<String> hints;
        private String solutionSteps;
        private Boolean isActive;

        // Getters and setters
        public Long getSubjectId() { return subjectId; }
        public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
        public Long getTopicId() { return topicId; }
        public void setTopicId(Long topicId) { this.topicId = topicId; }
        public String getDifficulty() { return difficulty; }
        public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
        public Integer getPoints() { return points; }
        public void setPoints(Integer points) { this.points = points; }
        public String getHintText() { return hintText; }
        public void setHintText(String hintText) { this.hintText = hintText; }
        public List<String> getHints() { return hints; }
        public void setHints(List<String> hints) { this.hints = hints; }
        public String getSolutionSteps() { return solutionSteps; }
        public void setSolutionSteps(String solutionSteps) { this.solutionSteps = solutionSteps; }
        public Boolean getIsActive() { return isActive; }
        public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    }

    // Helper method to convert Contest to ContestResponse
    private ContestResponse convertToContestResponse(Contest contest) {
        ContestResponse response = new ContestResponse();
        response.setId(contest.getId());
        response.setTitle(contest.getTitle());
        response.setDescription(contest.getDescription());
        response.setType(contest.getType());
        response.setStartTime(contest.getStartTime());
        response.setEndTime(contest.getEndTime());
        response.setDuration(contest.getDuration());
        response.setProblemIds(contest.getProblemIds());
        response.setPrizes(contest.getPrizes());
        response.setRules(contest.getRules());
        response.setParticipants(contest.getParticipants());
        response.setStatus(contest.getStatus());
        response.setCreatedAt(contest.getCreatedAt());
        response.setUpdatedAt(contest.getUpdatedAt());
        return response;
    }

}