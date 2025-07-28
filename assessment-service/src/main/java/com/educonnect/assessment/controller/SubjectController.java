package com.educonnect.assessment.controller;

import com.educonnect.assessment.dto.ApiResponse;
import com.educonnect.assessment.dto.PagedResponse;
import com.educonnect.assessment.dto.SubjectRequest;
import com.educonnect.assessment.entity.Subject;
import com.educonnect.assessment.enums.ClassLevel;
import com.educonnect.assessment.service.SubjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subjects")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<PagedResponse<Subject>>> getAllSubjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) ClassLevel classLevel) {
        
        PagedResponse<Subject> subjects = subjectService.getAllSubjects(page, size, classLevel, false);
        return ResponseEntity.ok(ApiResponse.success(subjects));
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<List<Subject>>> getPublicSubjects(
            @RequestParam(required = false) ClassLevel classLevel) {
        
        List<Subject> subjects = subjectService.getPublicSubjects(classLevel);
        return ResponseEntity.ok(ApiResponse.success(subjects));
    }

    @GetMapping("/{subjectId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Subject>> getSubjectById(@PathVariable Long subjectId) {
        Subject subject = subjectService.getActiveSubjectById(subjectId);
        return ResponseEntity.ok(ApiResponse.success(subject));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER')")
    public ResponseEntity<ApiResponse<Subject>> createSubject(@Valid @RequestBody SubjectRequest request) {
        Subject subject = subjectService.createSubject(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(subject, "Subject created successfully"));
    }

    @PutMapping("/{subjectId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER')")
    public ResponseEntity<ApiResponse<Subject>> updateSubject(
            @PathVariable Long subjectId,
            @Valid @RequestBody SubjectRequest request) {
        
        Subject subject = subjectService.updateSubject(subjectId, request);
        return ResponseEntity.ok(ApiResponse.success(subject, "Subject updated successfully"));
    }

    @DeleteMapping("/{subjectId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER')")
    public ResponseEntity<ApiResponse<String>> deleteSubject(@PathVariable Long subjectId) {
        subjectService.deleteSubject(subjectId);
        return ResponseEntity.ok(ApiResponse.success("Subject deleted successfully"));
    }
}