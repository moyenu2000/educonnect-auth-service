package com.educonnect.discussion.controller;

import com.educonnect.discussion.dto.ApiResponse;
import com.educonnect.discussion.dto.DiscussionDto;
import com.educonnect.discussion.dto.DiscussionRequest;
import com.educonnect.discussion.dto.PagedResponse;
import com.educonnect.discussion.enums.ClassLevel;
import com.educonnect.discussion.enums.DiscussionType;
import com.educonnect.discussion.security.CurrentUser;
import com.educonnect.discussion.security.UserPrincipal;
import com.educonnect.discussion.service.DiscussionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/discussions")
public class DiscussionController {

    @Autowired
    private DiscussionService discussionService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<DiscussionDto>>> getDiscussions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) DiscussionType type,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Long topicId,
            @RequestParam(required = false) ClassLevel classLevel,
            @RequestParam(defaultValue = "NEWEST") String sortBy,
            @CurrentUser UserPrincipal currentUser) {
        
        Pageable pageable = PageRequest.of(page, size);
        Long currentUserId = currentUser != null ? currentUser.getId() : null;
        
        PagedResponse<DiscussionDto> discussions = discussionService.getDiscussions(
            type, subjectId, topicId, classLevel, sortBy, pageable, currentUserId);
        
        return ResponseEntity.ok(ApiResponse.success(discussions));
    }

    @GetMapping("/{discussionId}")
    public ResponseEntity<ApiResponse<DiscussionDto>> getDiscussion(
            @PathVariable Long discussionId,
            @CurrentUser UserPrincipal currentUser) {
        
        Long currentUserId = currentUser != null ? currentUser.getId() : null;
        DiscussionDto discussion = discussionService.getDiscussionById(discussionId, currentUserId);
        
        return ResponseEntity.ok(ApiResponse.success(discussion));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<DiscussionDto>> createDiscussion(
            @Valid @RequestBody DiscussionRequest request,
            @CurrentUser UserPrincipal currentUser) {
        
        DiscussionDto discussion = discussionService.createDiscussion(request, currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success(discussion, "Discussion created successfully"));
    }

    @PutMapping("/{discussionId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<DiscussionDto>> updateDiscussion(
            @PathVariable Long discussionId,
            @Valid @RequestBody DiscussionRequest request,
            @CurrentUser UserPrincipal currentUser) {
        
        DiscussionDto discussion = discussionService.updateDiscussion(discussionId, request, currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success(discussion, "Discussion updated successfully"));
    }

    @DeleteMapping("/{discussionId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<String>> deleteDiscussion(
            @PathVariable Long discussionId,
            @CurrentUser UserPrincipal currentUser) {
        
        discussionService.deleteDiscussion(discussionId, currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success("Discussion deleted successfully"));
    }

    @PostMapping("/{discussionId}/upvote")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> upvoteDiscussion(
            @PathVariable Long discussionId,
            @CurrentUser UserPrincipal currentUser) {
        
        discussionService.upvoteDiscussion(discussionId, currentUser.getId());
        
        Map<String, Object> response = Map.of(
            "upvoted", true,
            "message", "Discussion upvoted successfully"
        );
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{discussionId}/downvote")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> downvoteDiscussion(
            @PathVariable Long discussionId,
            @CurrentUser UserPrincipal currentUser) {
        
        discussionService.downvoteDiscussion(discussionId, currentUser.getId());
        
        Map<String, Object> response = Map.of(
            "downvoted", true,
            "message", "Discussion downvoted successfully"
        );
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{discussionId}/bookmark")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bookmarkDiscussion(
            @PathVariable Long discussionId,
            @CurrentUser UserPrincipal currentUser) {
        
        discussionService.bookmarkDiscussion(discussionId, currentUser.getId());
        
        Map<String, Object> response = Map.of(
            "bookmarked", true,
            "message", "Discussion bookmark toggled successfully"
        );
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<PagedResponse<DiscussionDto>>> getPublicDiscussions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) DiscussionType type,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Long topicId,
            @RequestParam(required = false) ClassLevel classLevel,
            @RequestParam(defaultValue = "NEWEST") String sortBy) {
        
        Pageable pageable = PageRequest.of(page, size);
        
        PagedResponse<DiscussionDto> discussions = discussionService.getDiscussions(
            type, subjectId, topicId, classLevel, sortBy, pageable, null);
        
        return ResponseEntity.ok(ApiResponse.success(discussions));
    }

    @GetMapping("/{discussionId}/public")
    public ResponseEntity<ApiResponse<DiscussionDto>> getPublicDiscussion(
            @PathVariable Long discussionId) {
        
        DiscussionDto discussion = discussionService.getDiscussionById(discussionId, null);
        
        return ResponseEntity.ok(ApiResponse.success(discussion));
    }
}