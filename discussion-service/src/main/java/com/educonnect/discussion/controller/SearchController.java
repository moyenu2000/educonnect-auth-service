package com.educonnect.discussion.controller;

import com.educonnect.discussion.dto.ApiResponse;
import com.educonnect.discussion.dto.DiscussionDto;
import com.educonnect.discussion.dto.PagedResponse;
import com.educonnect.discussion.dto.UserDto;
import com.educonnect.discussion.entity.Group;
import com.educonnect.discussion.enums.DiscussionType;
import com.educonnect.discussion.enums.GroupType;
import com.educonnect.discussion.security.CurrentUser;
import com.educonnect.discussion.security.UserPrincipal;
import com.educonnect.discussion.service.DiscussionService;
import com.educonnect.discussion.service.GroupService;
import com.educonnect.discussion.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/search")
public class SearchController {

    @Autowired
    private DiscussionService discussionService;

    @Autowired
    private GroupService groupService;

    @Autowired
    private UserService userService;

    @GetMapping("/discussions")
    public ResponseEntity<ApiResponse<PagedResponse<DiscussionDto>>> searchDiscussions(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) DiscussionType type,
            @RequestParam(defaultValue = "NEWEST") String sortBy,
            @CurrentUser UserPrincipal currentUser) {
        
        Pageable pageable = PageRequest.of(page, size);
        Long currentUserId = currentUser != null ? currentUser.getId() : null;
        
        PagedResponse<DiscussionDto> discussions = discussionService.searchDiscussions(
            q, subjectId, type, sortBy, pageable, currentUserId);
        
        return ResponseEntity.ok(ApiResponse.success(discussions));
    }

    @GetMapping("/groups")
    public ResponseEntity<ApiResponse<PagedResponse<Group>>> searchGroups(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) GroupType type,
            @CurrentUser UserPrincipal currentUser) {
        
        Pageable pageable = PageRequest.of(page, size);
        PagedResponse<Group> groups = groupService.searchGroups(q, type, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(groups));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PagedResponse<UserDto>>> searchUsers(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @CurrentUser UserPrincipal currentUser) {
        
        Pageable pageable = PageRequest.of(page, size);
        PagedResponse<UserDto> users = userService.searchUsers(q, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(users));
    }
}