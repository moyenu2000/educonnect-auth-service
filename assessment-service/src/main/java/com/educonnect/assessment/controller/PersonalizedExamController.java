package com.educonnect.assessment.controller;

import com.educonnect.assessment.dto.ApiResponse;
import com.educonnect.assessment.entity.PersonalizedExam;
import com.educonnect.assessment.enums.ClassLevel;
import com.educonnect.assessment.enums.ExamStatus;
import com.educonnect.assessment.repository.PersonalizedExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/personalized-exams")
@PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
public class PersonalizedExamController {

    @Autowired
    private PersonalizedExamRepository personalizedExamRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PersonalizedExam>>> getPersonalizedExams(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String classLevel,
            @RequestParam(required = false) Long subjectId,
            Authentication authentication) {

        // For now, using a mock userId - in real implementation, get from JWT token
        Long userId = 1L; // Extract from authentication.getPrincipal()

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PersonalizedExam> exams;

        if (status != null) {
            ExamStatus examStatus = ExamStatus.valueOf(status.toUpperCase());
            if ("COMPLETED".equals(status.toUpperCase())) {
                exams = personalizedExamRepository.findCompletedExamsByUserId(userId, pageable);
            } else {
                exams = personalizedExamRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, examStatus, pageable);
            }
        } else if (classLevel != null) {
            ClassLevel level = ClassLevel.valueOf(classLevel.toUpperCase());
            exams = personalizedExamRepository.findByUserIdAndClassLevel(userId, level, pageable);
        } else if (subjectId != null) {
            exams = personalizedExamRepository.findByUserIdAndSubjectId(userId, subjectId, pageable);
        } else {
            exams = personalizedExamRepository.findByUserId(userId, pageable);
        }

        return ResponseEntity.ok(ApiResponse.success(exams));
    }

    @GetMapping("/{examId}")
    public ResponseEntity<ApiResponse<PersonalizedExam>> getPersonalizedExam(
            @PathVariable Long examId,
            Authentication authentication) {
        
        return personalizedExamRepository.findById(examId)
                .map(exam -> ResponseEntity.ok(ApiResponse.success(exam)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<PersonalizedExam>> createPersonalizedExam(
            @RequestBody CreatePersonalizedExamRequest request,
            Authentication authentication) {
        
        // For now, using a mock userId - in real implementation, get from JWT token
        Long userId = 1L; // Extract from authentication.getPrincipal()

        PersonalizedExam exam = new PersonalizedExam();
        exam.setUserId(userId);
        exam.setTitle(request.getTitle());
        exam.setDescription(request.getDescription());
        exam.setSubjectId(request.getSubjectId());
        exam.setClassLevel(request.getClassLevel());
        exam.setDuration(request.getDuration());
        exam.setQuestionIds(request.getQuestionIds());
        exam.setInstructions(request.getInstructions());
        exam.setPassingScore(request.getPassingScore() != null ? request.getPassingScore() : 60);
        exam.setStatus(ExamStatus.SCHEDULED);

        PersonalizedExam savedExam = personalizedExamRepository.save(exam);
        return ResponseEntity.ok(ApiResponse.success(savedExam, "Personalized exam created successfully"));
    }

    @PostMapping("/{examId}/start")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> startPersonalizedExam(
            @PathVariable Long examId,
            Authentication authentication) {
        
        return personalizedExamRepository.findById(examId)
                .map(exam -> {
                    if (exam.getStatus() == ExamStatus.SCHEDULED) {
                        exam.setStatus(ExamStatus.IN_PROGRESS);
                        exam.setStartedAt(LocalDateTime.now());
                        personalizedExamRepository.save(exam);
                        
                        Map<String, Object> response = Map.of(
                            "examId", examId,
                            "status", "IN_PROGRESS",
                            "startedAt", exam.getStartedAt(),
                            "duration", exam.getDuration(),
                            "message", "Exam started successfully"
                        );
                        return ResponseEntity.ok(ApiResponse.success(response));
                    } else {
                        return ResponseEntity.badRequest()
                                .body(ApiResponse.error("Exam cannot be started in current status: " + exam.getStatus()));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{examId}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitPersonalizedExam(
            @PathVariable Long examId,
            @RequestBody SubmitExamRequest request,
            Authentication authentication) {
        
        return personalizedExamRepository.findById(examId)
                .map(exam -> {
                    if (exam.getStatus() == ExamStatus.IN_PROGRESS) {
                        exam.setStatus(ExamStatus.COMPLETED);
                        exam.setCompletedAt(LocalDateTime.now());
                        exam.setScore(request.getScore());
                        exam.setCorrectAnswers(request.getCorrectAnswers());
                        exam.setIncorrectAnswers(request.getIncorrectAnswers());
                        exam.setUnansweredQuestions(request.getUnansweredQuestions());
                        personalizedExamRepository.save(exam);
                        
                        Map<String, Object> response = Map.of(
                            "examId", examId,
                            "status", "COMPLETED",
                            "score", exam.getScore(),
                            "correctAnswers", exam.getCorrectAnswers(),
                            "incorrectAnswers", exam.getIncorrectAnswers(),
                            "unansweredQuestions", exam.getUnansweredQuestions(),
                            "passed", exam.getScore() >= exam.getPassingScore(),
                            "message", "Exam submitted successfully"
                        );
                        return ResponseEntity.ok(ApiResponse.success(response));
                    } else {
                        return ResponseEntity.badRequest()
                                .body(ApiResponse.error("Exam cannot be submitted in current status: " + exam.getStatus()));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPersonalizedExamStats(
            Authentication authentication) {
        
        // For now, using a mock userId - in real implementation, get from JWT token
        Long userId = 1L; // Extract from authentication.getPrincipal()

        long totalExams = personalizedExamRepository.countCompletedExamsByUserId(userId);
        long passedExams = personalizedExamRepository.countPassedExamsByUserId(userId);
        Double averageScore = personalizedExamRepository.getAverageScoreByUserId(userId);

        Map<String, Object> stats = Map.of(
            "totalExams", totalExams,
            "passedExams", passedExams,
            "failedExams", totalExams - passedExams,
            "averageScore", averageScore != null ? averageScore : 0.0,
            "passRate", totalExams > 0 ? (double) passedExams / totalExams * 100 : 0.0
        );

        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // Request DTOs
    public static class CreatePersonalizedExamRequest {
        private String title;
        private String description;
        private Long subjectId;
        private ClassLevel classLevel;
        private Integer duration;
        private java.util.List<Long> questionIds;
        private String instructions;
        private Integer passingScore;

        // Getters and setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public Long getSubjectId() { return subjectId; }
        public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
        public ClassLevel getClassLevel() { return classLevel; }
        public void setClassLevel(ClassLevel classLevel) { this.classLevel = classLevel; }
        public Integer getDuration() { return duration; }
        public void setDuration(Integer duration) { this.duration = duration; }
        public java.util.List<Long> getQuestionIds() { return questionIds; }
        public void setQuestionIds(java.util.List<Long> questionIds) { this.questionIds = questionIds; }
        public String getInstructions() { return instructions; }
        public void setInstructions(String instructions) { this.instructions = instructions; }
        public Integer getPassingScore() { return passingScore; }
        public void setPassingScore(Integer passingScore) { this.passingScore = passingScore; }
    }

    public static class SubmitExamRequest {
        private Integer score;
        private Integer correctAnswers;
        private Integer incorrectAnswers;
        private Integer unansweredQuestions;

        // Getters and setters
        public Integer getScore() { return score; }
        public void setScore(Integer score) { this.score = score; }
        public Integer getCorrectAnswers() { return correctAnswers; }
        public void setCorrectAnswers(Integer correctAnswers) { this.correctAnswers = correctAnswers; }
        public Integer getIncorrectAnswers() { return incorrectAnswers; }
        public void setIncorrectAnswers(Integer incorrectAnswers) { this.incorrectAnswers = incorrectAnswers; }
        public Integer getUnansweredQuestions() { return unansweredQuestions; }
        public void setUnansweredQuestions(Integer unansweredQuestions) { this.unansweredQuestions = unansweredQuestions; }
    }
}