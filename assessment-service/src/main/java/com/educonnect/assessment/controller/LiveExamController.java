package com.educonnect.assessment.controller;

import com.educonnect.assessment.dto.ApiResponse;
import com.educonnect.assessment.entity.LiveExam;
import com.educonnect.assessment.enums.ClassLevel;
import com.educonnect.assessment.enums.ExamStatus;
import com.educonnect.assessment.repository.LiveExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/live-exams")
@PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN') or hasRole('QUESTION_SETTER')")
public class LiveExamController {

    @Autowired
    private LiveExamRepository liveExamRepository;

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
}