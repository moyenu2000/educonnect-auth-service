package com.educonnect.assessment.controller;

import com.educonnect.assessment.dto.*;
import com.educonnect.assessment.enums.Difficulty;
import com.educonnect.assessment.enums.ProblemStatus;
import com.educonnect.assessment.enums.QuestionType;
import com.educonnect.assessment.service.PracticeProblemService;
import com.educonnect.assessment.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/practice-problems")
public class PracticeProblemController {

    @Autowired
    private PracticeProblemService practiceProblemService;

    @GetMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProblems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Long topicId,
            @RequestParam(required = false) Difficulty difficulty,
            @RequestParam(required = false) QuestionType type,
            @RequestParam(required = false) ProblemStatus status,
            @RequestParam(required = false) String search) {

        Long userId = SecurityUtils.getCurrentUserId().orElse(null);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<PracticeProblemDto> problemPage = practiceProblemService.getProblems(
                subjectId, topicId, difficulty, type, status, search, userId, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("problems", problemPage.getContent());
        response.put("totalElements", problemPage.getTotalElements());
        response.put("totalPages", problemPage.getTotalPages());
        response.put("currentPage", page);
        response.put("size", size);
        response.put("first", problemPage.isFirst());
        response.put("last", problemPage.isLast());
        response.put("empty", problemPage.isEmpty());

        // Add filter info
        Map<String, Object> filters = new HashMap<>();
        filters.put("subjectId", subjectId);
        filters.put("topicId", topicId);
        filters.put("difficulty", difficulty);
        filters.put("type", type);
        filters.put("status", status);
        filters.put("search", search);
        response.put("filters", filters);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{problemId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<PracticeProblemDto>> getProblemById(@PathVariable Long problemId) {
        Long userId = SecurityUtils.getCurrentUserId().orElse(null);
        PracticeProblemDto problem = practiceProblemService.getProblemById(problemId, userId);
        return ResponseEntity.ok(ApiResponse.success(problem));
    }

    @PostMapping("/{problemId}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<ProblemSubmissionResponse>> submitSolution(
            @PathVariable Long problemId,
            @Valid @RequestBody ProblemSubmissionRequest request) {

        Long userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new RuntimeException("User not authenticated"));

        ProblemSubmissionResponse response = practiceProblemService.submitSolution(problemId, request, userId);
        return ResponseEntity.ok(ApiResponse.success(response, "Solution submitted successfully"));
    }

    @GetMapping("/{problemId}/hint")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<HintResponse>> getHint(
            @PathVariable Long problemId,
            @RequestParam(required = false) Integer hintLevel) {

        Long userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new RuntimeException("User not authenticated"));

        HintResponse hint = practiceProblemService.getHint(problemId, hintLevel, userId);
        return ResponseEntity.ok(ApiResponse.success(hint));
    }

    @PostMapping("/{problemId}/bookmark")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Boolean>> toggleBookmark(@PathVariable Long problemId) {
        Long userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new RuntimeException("User not authenticated"));

        ApiResponse<Boolean> response = practiceProblemService.toggleBookmark(problemId, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recommendations")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRecommendations(
            @RequestParam(defaultValue = "5") Integer count,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Difficulty difficulty) {

        Long userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new RuntimeException("User not authenticated"));

        Pageable pageable = PageRequest.of(0, count, Sort.by("createdAt").descending());
        Page<PracticeProblemDto> recommendations = practiceProblemService.getRecommendations(
                count, subjectId, difficulty, userId, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("recommendations", recommendations.getContent());
        response.put("reason", "Based on your performance and preferences");

        return ResponseEntity.ok(ApiResponse.success(response));
    }
}