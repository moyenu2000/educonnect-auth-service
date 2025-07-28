package com.educonnect.assessment.controller;

import com.educonnect.assessment.dto.*;
import com.educonnect.assessment.entity.LiveExam;
import com.educonnect.assessment.enums.ClassLevel;
import com.educonnect.assessment.enums.ExamStatus;
import com.educonnect.assessment.repository.LiveExamRepository;
import com.educonnect.assessment.service.LiveExamSessionService;
import com.educonnect.assessment.util.SecurityUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/live-exams")
@PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN') or hasRole('QUESTION_SETTER')")
public class LiveExamController {

    @Autowired
    private LiveExamRepository liveExamRepository;

    @Autowired
    private LiveExamSessionService liveExamSessionService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<LiveExam>>> getLiveExams(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String classLevel,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Boolean upcoming) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("scheduledAt").ascending());
        Page<LiveExam> exams;

        if (upcoming != null && upcoming) {
            exams = liveExamRepository.findUpcomingExams(LocalDateTime.now(), pageable);
        } else if (status != null) {
            ExamStatus examStatus = ExamStatus.valueOf(status.toUpperCase());
            if (classLevel != null) {
                ClassLevel level = ClassLevel.valueOf(classLevel.toUpperCase());
                exams = liveExamRepository.findByClassLevelAndStatus(level, examStatus, pageable);
            } else if (subjectId != null) {
                exams = liveExamRepository.findBySubjectIdAndStatus(subjectId, examStatus, pageable);
            } else {
                exams = liveExamRepository.findByStatus(examStatus, pageable);
            }
        } else if (classLevel != null) {
            ClassLevel level = ClassLevel.valueOf(classLevel.toUpperCase());
            exams = liveExamRepository.findByClassLevel(level, pageable);
        } else if (subjectId != null) {
            exams = liveExamRepository.findBySubjectId(subjectId, pageable);
        } else {
            exams = liveExamRepository.findAll(pageable);
        }

        return ResponseEntity.ok(ApiResponse.success(exams));
    }

    @GetMapping("/{examId}")
    public ResponseEntity<ApiResponse<LiveExam>> getLiveExam(@PathVariable Long examId) {
        return liveExamRepository.findById(examId)
                .map(exam -> ResponseEntity.ok(ApiResponse.success(exam)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<Page<LiveExam>>> getUpcomingExams(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("scheduledAt").ascending());
        Page<LiveExam> exams = liveExamRepository.findUpcomingExams(LocalDateTime.now(), pageable);
        
        return ResponseEntity.ok(ApiResponse.success(exams));
    }

    @GetMapping("/live")
    public ResponseEntity<ApiResponse<Page<LiveExam>>> getCurrentLiveExams(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("scheduledAt").descending());
        Page<LiveExam> exams = liveExamRepository.findLiveExams(LocalDateTime.now(), pageable);
        
        return ResponseEntity.ok(ApiResponse.success(exams));
    }

    @PostMapping("/{examId}/join")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> joinLiveExam(@PathVariable Long examId) {
        return liveExamRepository.findById(examId)
                .map(exam -> {
                    if (exam.getStatus() == ExamStatus.ACTIVE) {
                        Map<String, Object> response = Map.of(
                            "examId", examId,
                            "status", "JOINED",
                            "message", "Successfully joined live exam"
                        );
                        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>success(response));
                    } else {
                        return ResponseEntity.badRequest()
                                .body(ApiResponse.<Map<String, Object>>error("Exam is not currently live"));
                    }
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Missing Live Exam Session Management Endpoints

    @PostMapping("/{examId}/register")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Boolean>> registerForExam(@PathVariable Long examId) {
        Long userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new RuntimeException("User not authenticated"));

        ApiResponse<Boolean> response = liveExamSessionService.registerForExam(examId, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{examId}/start")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<ExamSessionResponse>> startExam(
            @PathVariable Long examId,
            HttpServletRequest request) {

        Long userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new RuntimeException("User not authenticated"));

        String ipAddress = getClientIpAddress(request);
        String userAgent = request.getHeader("User-Agent");

        ExamSessionResponse response = liveExamSessionService.startExam(examId, userId, ipAddress, userAgent);
        return ResponseEntity.ok(ApiResponse.success(response, "Exam session started successfully"));
    }

    @PostMapping("/{examId}/submit-answer")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Boolean>> submitAnswer(
            @PathVariable Long examId,
            @Valid @RequestBody ExamAnswerRequest request) {

        Long userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new RuntimeException("User not authenticated"));

        ApiResponse<Boolean> response = liveExamSessionService.submitAnswer(request, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{examId}/finish")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<ExamResultResponse>> finishExam(
            @PathVariable Long examId,
            @Valid @RequestBody ExamFinishRequest request) {

        Long userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new RuntimeException("User not authenticated"));

        ExamResultResponse response = liveExamSessionService.finishExam(request, userId);
        return ResponseEntity.ok(ApiResponse.success(response, "Exam completed successfully"));
    }

    @GetMapping("/{examId}/results")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<ExamResultResponse>> getExamResults(@PathVariable Long examId) {
        Long userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new RuntimeException("User not authenticated"));

        ExamResultResponse response = liveExamSessionService.getExamResults(examId, userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{examId}/leaderboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getExamLeaderboard(
            @PathVariable Long examId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Long userId = SecurityUtils.getCurrentUserId().orElse(null);
        Pageable pageable = PageRequest.of(page, size);

        Page<LeaderboardEntry> leaderboardPage = liveExamSessionService.getExamLeaderboard(
                examId, pageable, userId);

        Map<String, Object> response = new HashMap<>();
        response.put("leaderboard", leaderboardPage.getContent());
        response.put("totalParticipants", leaderboardPage.getTotalElements());
        
        if (userId != null) {
            // Get user's rank if authenticated
            liveExamSessionService.getExamResults(examId, userId);
            // User rank would be included in the leaderboard entry
        }

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }
}