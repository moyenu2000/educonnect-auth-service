package com.educonnect.discussion.controller;

import com.educonnect.discussion.dto.*;
import com.educonnect.discussion.entity.Group;
import com.educonnect.discussion.entity.GroupMember;
import com.educonnect.discussion.enums.GroupRole;
import com.educonnect.discussion.enums.GroupType;
import com.educonnect.discussion.security.CurrentUser;
import com.educonnect.discussion.security.UserPrincipal;
import com.educonnect.discussion.service.DiscussionService;
import com.educonnect.discussion.service.GroupService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/groups")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @Autowired
    private DiscussionService discussionService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<Group>>> getGroups(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) GroupType type,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Boolean joined,
            @CurrentUser UserPrincipal currentUser) {
        
        Pageable pageable = PageRequest.of(page, size);
        Long currentUserId = currentUser != null ? currentUser.getId() : null;
        
        PagedResponse<Group> groups = groupService.getGroups(type, subjectId, joined, pageable, currentUserId);
        
        return ResponseEntity.ok(ApiResponse.success(groups));
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<ApiResponse<Group>> getGroup(
            @PathVariable Long groupId,
            @CurrentUser UserPrincipal currentUser) {
        
        Long currentUserId = currentUser != null ? currentUser.getId() : null;
        Group group = groupService.getGroupById(groupId, currentUserId);
        
        return ResponseEntity.ok(ApiResponse.success(group));
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Group>> createGroup(
            @Valid @RequestBody GroupRequest request,
            @CurrentUser UserPrincipal currentUser) {
        
        Group group = groupService.createGroup(request, currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success(group, "Group created successfully"));
    }

    @PutMapping("/{groupId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Group>> updateGroup(
            @PathVariable Long groupId,
            @Valid @RequestBody GroupRequest request,
            @CurrentUser UserPrincipal currentUser) {
        
        Group group = groupService.updateGroup(groupId, request, currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success(group, "Group updated successfully"));
    }

    @PostMapping("/{groupId}/join")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> joinGroup(
            @PathVariable Long groupId,
            @CurrentUser UserPrincipal currentUser) {
        
        groupService.joinGroup(groupId, currentUser.getId());
        
        Map<String, Object> response = Map.of(
            "joined", true,
            "message", "Group membership toggled successfully"
        );
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{groupId}/members")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<PagedResponse<GroupMember>>> getGroupMembers(
            @PathVariable Long groupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) GroupRole role,
            @CurrentUser UserPrincipal currentUser) {
        
        Pageable pageable = PageRequest.of(page, size);
        PagedResponse<GroupMember> members = groupService.getGroupMembers(groupId, role, pageable, currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success(members));
    }

    @PutMapping("/{groupId}/members/{userId}/role")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<String>> changeGroupMemberRole(
            @PathVariable Long groupId,
            @PathVariable Long userId,
            @RequestBody Map<String, GroupRole> requestBody,
            @CurrentUser UserPrincipal currentUser) {
        
        GroupRole role = requestBody.get("role");
        groupService.changeGroupMemberRole(groupId, userId, role, currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success("Member role updated successfully"));
    }

    @DeleteMapping("/{groupId}/members/{userId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<String>> removeGroupMember(
            @PathVariable Long groupId,
            @PathVariable Long userId,
            @CurrentUser UserPrincipal currentUser) {
        
        groupService.removeGroupMember(groupId, userId, currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success("Member removed successfully"));
    }

    @GetMapping("/{groupId}/discussions")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<PagedResponse<DiscussionDto>>> getGroupDiscussions(
            @PathVariable Long groupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "NEWEST") String sortBy,
            @CurrentUser UserPrincipal currentUser) {
        
        Pageable pageable = PageRequest.of(page, size);
        PagedResponse<DiscussionDto> discussions = discussionService.getGroupDiscussions(
            groupId, sortBy, pageable, currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success(discussions));
    }

    @PostMapping("/{groupId}/discussions")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<DiscussionDto>> createGroupDiscussion(
            @PathVariable Long groupId,
            @Valid @RequestBody DiscussionRequest request,
            @CurrentUser UserPrincipal currentUser) {
        
        DiscussionDto discussion = discussionService.createGroupDiscussion(groupId, request, currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success(discussion, "Group discussion created successfully"));
    }
}