package com.educonnect.assessment.controller;

import com.educonnect.assessment.dto.*;
import com.educonnect.assessment.enums.Difficulty;
import com.educonnect.assessment.enums.QuestionType;
import com.educonnect.assessment.service.PracticeProblemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/practice-questions")
@PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER')")
public class AdminPracticeQuestionController {

    @Autowired
    private PracticeProblemService practiceProblemService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllPracticeProblems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Long topicId,
            @RequestParam(required = false) Difficulty difficulty,
            @RequestParam(required = false) QuestionType type,
            @RequestParam(required = false) String search) {

        Pageable pageable = PageRequest.of(page, size);
        
        Page<PracticeProblemDto> practiceProblems = practiceProblemService.getAllProblemsForAdmin(
                subjectId, topicId, difficulty, type, search, pageable);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("content", practiceProblems.getContent());
        responseData.put("page", practiceProblems.getNumber());
        responseData.put("size", practiceProblems.getSize());
        responseData.put("totalElements", practiceProblems.getTotalElements());
        responseData.put("totalPages", practiceProblems.getTotalPages());
        responseData.put("first", practiceProblems.isFirst());
        responseData.put("last", practiceProblems.isLast());

        return ResponseEntity.ok(ApiResponse.success(responseData));
    }

    @GetMapping("/{problemId}")
    public ResponseEntity<ApiResponse<PracticeProblemDto>> getPracticeProblem(@PathVariable Long problemId) {
        PracticeProblemDto problem = practiceProblemService.getProblemById(problemId, null);
        return ResponseEntity.ok(ApiResponse.success(problem));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PracticeProblemDto>> createPracticeProblem(
            @Valid @RequestBody CreatePracticeProblemRequest request) {
        
        PracticeProblemDto createdProblem = practiceProblemService.createPracticeProblem(
                request.getQuestionId(),
                request.getCustomPoints(),
                request.getCustomDifficulty(),
                request.getHintText(),
                request.getHints(),
                request.getSolutionSteps()
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdProblem, "Practice problem created successfully"));
    }

    @PutMapping("/{problemId}")
    public ResponseEntity<ApiResponse<PracticeProblemDto>> updatePracticeProblem(
            @PathVariable Long problemId,
            @Valid @RequestBody UpdatePracticeProblemRequest request) {
        
        PracticeProblemDto updatedProblem = practiceProblemService.updatePracticeProblem(
                problemId,
                request.getCustomPoints(),
                request.getCustomDifficulty(),
                request.getHintText(),
                request.getHints(),
                request.getSolutionSteps()
        );

        return ResponseEntity.ok(ApiResponse.success(updatedProblem, "Practice problem updated successfully"));
    }

    @DeleteMapping("/{problemId}")
    public ResponseEntity<ApiResponse<String>> deletePracticeProblem(@PathVariable Long problemId) {
        practiceProblemService.deletePracticeProblem(problemId);
        return ResponseEntity.ok(ApiResponse.success("Practice problem deleted successfully"));
    }

    @PostMapping("/bulk-create")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bulkCreateFromQuestions(
            @Valid @RequestBody BulkCreatePracticeProblemsRequest request) {
        
        List<PracticeProblemDto> createdProblems = practiceProblemService.bulkCreateFromQuestions(
                request.getQuestionIds(),
                request.getDefaultPoints(),
                request.getDefaultDifficulty()
        );

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("createdProblems", createdProblems);
        responseData.put("totalCreated", createdProblems.size());
        responseData.put("requestedCount", request.getQuestionIds().size());

        return ResponseEntity.ok(ApiResponse.success(responseData, 
                String.format("Successfully created %d practice problems out of %d requested", 
                             createdProblems.size(), request.getQuestionIds().size())));
    }

    @PatchMapping("/{problemId}/status")
    public ResponseEntity<ApiResponse<String>> updateProblemStatus(
            @PathVariable Long problemId,
            @RequestBody Map<String, Boolean> statusUpdate) {
        
        Boolean isActive = statusUpdate.get("isActive");
        if (isActive == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("isActive field is required"));
        }

        practiceProblemService.activateDeactivateProblem(problemId, isActive);
        
        String message = isActive ? "Practice problem activated successfully" : "Practice problem deactivated successfully";
        return ResponseEntity.ok(ApiResponse.success(message));
    }

    @GetMapping("/check-question/{questionId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkIfQuestionIsPractice(@PathVariable Long questionId) {
        boolean isPracticeQuestion = practiceProblemService.isPracticeQuestion(questionId);
        
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("questionId", questionId);
        responseData.put("isPracticeQuestion", isPracticeQuestion);

        return ResponseEntity.ok(ApiResponse.success(responseData));
    }

    // Request DTOs
    public static class CreatePracticeProblemRequest {
        private Long questionId;
        private Integer customPoints;
        private Difficulty customDifficulty;
        private String hintText;
        private List<String> hints;
        private String solutionSteps;

        // Getters and Setters
        public Long getQuestionId() {
            return questionId;
        }

        public void setQuestionId(Long questionId) {
            this.questionId = questionId;
        }

        public Integer getCustomPoints() {
            return customPoints;
        }

        public void setCustomPoints(Integer customPoints) {
            this.customPoints = customPoints;
        }

        public Difficulty getCustomDifficulty() {
            return customDifficulty;
        }

        public void setCustomDifficulty(Difficulty customDifficulty) {
            this.customDifficulty = customDifficulty;
        }

        public String getHintText() {
            return hintText;
        }

        public void setHintText(String hintText) {
            this.hintText = hintText;
        }

        public List<String> getHints() {
            return hints;
        }

        public void setHints(List<String> hints) {
            this.hints = hints;
        }

        public String getSolutionSteps() {
            return solutionSteps;
        }

        public void setSolutionSteps(String solutionSteps) {
            this.solutionSteps = solutionSteps;
        }
    }

    public static class UpdatePracticeProblemRequest {
        private Integer customPoints;
        private Difficulty customDifficulty;
        private String hintText;
        private List<String> hints;
        private String solutionSteps;

        // Getters and Setters
        public Integer getCustomPoints() {
            return customPoints;
        }

        public void setCustomPoints(Integer customPoints) {
            this.customPoints = customPoints;
        }

        public Difficulty getCustomDifficulty() {
            return customDifficulty;
        }

        public void setCustomDifficulty(Difficulty customDifficulty) {
            this.customDifficulty = customDifficulty;
        }

        public String getHintText() {
            return hintText;
        }

        public void setHintText(String hintText) {
            this.hintText = hintText;
        }

        public List<String> getHints() {
            return hints;
        }

        public void setHints(List<String> hints) {
            this.hints = hints;
        }

        public String getSolutionSteps() {
            return solutionSteps;
        }

        public void setSolutionSteps(String solutionSteps) {
            this.solutionSteps = solutionSteps;
        }
    }

    public static class BulkCreatePracticeProblemsRequest {
        private List<Long> questionIds;
        private Integer defaultPoints;
        private Difficulty defaultDifficulty;

        // Getters and Setters
        public List<Long> getQuestionIds() {
            return questionIds;
        }

        public void setQuestionIds(List<Long> questionIds) {
            this.questionIds = questionIds;
        }

        public Integer getDefaultPoints() {
            return defaultPoints;
        }

        public void setDefaultPoints(Integer defaultPoints) {
            this.defaultPoints = defaultPoints;
        }

        public Difficulty getDefaultDifficulty() {
            return defaultDifficulty;
        }

        public void setDefaultDifficulty(Difficulty defaultDifficulty) {
            this.defaultDifficulty = defaultDifficulty;
        }
    }
}