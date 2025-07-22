package com.educonnect.assessment.controller;

import com.educonnect.assessment.dto.ApiResponse;
import com.educonnect.assessment.enums.Period;
import com.educonnect.assessment.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserDashboard(
            @RequestParam(required = false) Period period,
            @RequestParam(required = false) Long subjectId) {
        
        Map<String, Object> dashboard = analyticsService.getUserDashboard(period, subjectId);
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    @GetMapping("/performance")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserPerformance(
            @RequestParam(required = false) Period period,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) String type) {
        
        Map<String, Object> performance = analyticsService.getUserPerformance(period, subjectId, type);
        return ResponseEntity.ok(ApiResponse.success(performance));
    }

    @GetMapping("/progress")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserProgress(
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Period period) {
        
        Map<String, Object> progress = analyticsService.getUserProgress(subjectId, period);
        return ResponseEntity.ok(ApiResponse.success(progress));
    }

    @GetMapping("/rankings")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserRankings(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Period period) {
        
        Map<String, Object> rankings = analyticsService.getUserRankings(type, subjectId, period);
        return ResponseEntity.ok(ApiResponse.success(rankings));
    }
}