package com.educonnect.discussion.controller;

import com.educonnect.discussion.dto.AnswerDto;
import com.educonnect.discussion.dto.ApiResponse;
import com.educonnect.discussion.dto.AnswerRequest;
import com.educonnect.discussion.dto.PagedResponse;
import com.educonnect.discussion.security.CurrentUser;
import com.educonnect.discussion.security.UserPrincipal;
import com.educonnect.discussion.service.AnswerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class AnswerController {

    @Autowired
    private AnswerService answerService;

    @GetMapping("/discussions/{discussionId}/answers")
    public ResponseEntity<ApiResponse<PagedResponse<AnswerDto>>> getAnswers(
            @PathVariable Long discussionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "NEWEST") String sortBy,
            @CurrentUser UserPrincipal currentUser) {
        
        Pageable pageable = PageRequest.of(page, size);
        Long currentUserId = currentUser != null ? currentUser.getId() : null;
        
        PagedResponse<AnswerDto> answers = answerService.getAnswersByDiscussionId(
            discussionId, sortBy, pageable, currentUserId);
        
        return ResponseEntity.ok(ApiResponse.success(answers));
    }

    @PostMapping("/discussions/{discussionId}/answers")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<AnswerDto>> createAnswer(
            @PathVariable Long discussionId,
            @Valid @RequestBody AnswerRequest request,
            @CurrentUser UserPrincipal currentUser) {
        
        AnswerDto answer = answerService.createAnswer(discussionId, request, currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success(answer, "Answer created successfully"));
    }

    @PutMapping("/answers/{answerId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<AnswerDto>> updateAnswer(
            @PathVariable Long answerId,
            @Valid @RequestBody AnswerRequest request,
            @CurrentUser UserPrincipal currentUser) {
        
        AnswerDto answer = answerService.updateAnswer(answerId, request, currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success(answer, "Answer updated successfully"));
    }

    @DeleteMapping("/answers/{answerId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<String>> deleteAnswer(
            @PathVariable Long answerId,
            @CurrentUser UserPrincipal currentUser) {
        
        answerService.deleteAnswer(answerId, currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success("Answer deleted successfully"));
    }

    @PostMapping("/answers/{answerId}/upvote")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> upvoteAnswer(
            @PathVariable Long answerId,
            @CurrentUser UserPrincipal currentUser) {
        
        answerService.upvoteAnswer(answerId, currentUser.getId());
        
        Map<String, Object> response = Map.of(
            "upvoted", true,
            "message", "Answer upvoted successfully"
        );
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/answers/{answerId}/downvote")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> downvoteAnswer(
            @PathVariable Long answerId,
            @CurrentUser UserPrincipal currentUser) {
        
        answerService.downvoteAnswer(answerId, currentUser.getId());
        
        Map<String, Object> response = Map.of(
            "downvoted", true,
            "message", "Answer downvoted successfully"
        );
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/answers/{answerId}/accept")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> acceptAnswer(
            @PathVariable Long answerId,
            @CurrentUser UserPrincipal currentUser) {
        
        answerService.acceptAnswer(answerId, currentUser.getId());
        
        Map<String, Object> response = Map.of(
            "accepted", true,
            "message", "Answer accepted successfully"
        );
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}