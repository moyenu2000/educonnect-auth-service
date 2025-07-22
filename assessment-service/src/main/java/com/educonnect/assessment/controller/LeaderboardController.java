package com.educonnect.assessment.controller;

import com.educonnect.assessment.dto.ApiResponse;
import com.educonnect.assessment.enums.ClassLevel;
import com.educonnect.assessment.enums.Period;
import com.educonnect.assessment.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/leaderboard")
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping("/global")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getGlobalLeaderboard(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Period period,
            @RequestParam(required = false) Long subjectId) {
        
        Map<String, Object> leaderboard = leaderboardService.getGlobalLeaderboard(page, size, period, subjectId);
        return ResponseEntity.ok(ApiResponse.success(leaderboard));
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPublicLeaderboard(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Map<String, Object> leaderboard = leaderboardService.getGlobalLeaderboard(page, size, Period.ALL_TIME, null);
        return ResponseEntity.ok(ApiResponse.success(leaderboard));
    }

    @GetMapping("/subject/{subjectId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSubjectLeaderboard(
            @PathVariable Long subjectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Period period) {
        
        Map<String, Object> leaderboard = leaderboardService.getSubjectLeaderboard(subjectId, page, size, period);
        return ResponseEntity.ok(ApiResponse.success(leaderboard));
    }

    @GetMapping("/class/{classLevel}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getClassLeaderboard(
            @PathVariable ClassLevel classLevel,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Period period,
            @RequestParam(required = false) Long subjectId) {
        
        Map<String, Object> leaderboard = leaderboardService.getClassLeaderboard(
                classLevel, page, size, period, subjectId);
        return ResponseEntity.ok(ApiResponse.success(leaderboard));
    }
}