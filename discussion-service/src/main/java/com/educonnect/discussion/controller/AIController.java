package com.educonnect.discussion.controller;

import com.educonnect.discussion.dto.AIQueryRequest;
import com.educonnect.discussion.dto.AIQueryResponse;
import com.educonnect.discussion.dto.ApiResponse;
import com.educonnect.discussion.dto.PagedResponse;
import com.educonnect.discussion.entity.AIQuery;
import com.educonnect.discussion.security.CurrentUser;
import com.educonnect.discussion.security.UserPrincipal;
import com.educonnect.discussion.service.AIService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/ask")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<AIQueryResponse>> askAI(
            @Valid @RequestBody AIQueryRequest request,
            @CurrentUser UserPrincipal currentUser) {
        
        AIQueryResponse response = aiService.askAI(request, currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<PagedResponse<AIQuery>>> getAIHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long subjectId,
            @CurrentUser UserPrincipal currentUser) {
        
        Pageable pageable = PageRequest.of(page, size);
        PagedResponse<AIQuery> history = aiService.getAIHistory(currentUser.getId(), subjectId, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}