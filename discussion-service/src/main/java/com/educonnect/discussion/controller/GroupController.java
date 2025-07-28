package com.educonnect.discussion.controller;

import com.educonnect.discussion.dto.*;
import com.educonnect.discussion.dto.UpdateGroupRequest;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/groups")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @Autowired
    private DiscussionService discussionService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<GroupDto>>> getGroups(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) GroupType type,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Boolean joined,
            @CurrentUser UserPrincipal currentUser) {
        
        Pageable pageable = PageRequest.of(page, size);
        Long currentUserId = currentUser != null ? currentUser.getId() : null;
        
        PagedResponse<Group> groups = groupService.getGroups(type, subjectId, joined, pageable, currentUserId);
        
        // Convert to DTOs to avoid Hibernate serialization issues
        PagedResponse<GroupDto> groupDtos = new PagedResponse<>(
            groups.getContent().stream().map(GroupDto::fromEntity).toList(),
            groups.getTotalElements(),
            groups.getTotalPages(),
            groups.getCurrentPage(),
            groups.getSize(),
            groups.isFirst(),
            groups.isLast(),
            groups.isEmpty()
        );
        
        return ResponseEntity.ok(ApiResponse.success(groupDtos));
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<ApiResponse<GroupDto>> getGroup(
            @PathVariable Long groupId,
            @CurrentUser UserPrincipal currentUser) {
        
        Long currentUserId = currentUser != null ? currentUser.getId() : null;
        Group group = groupService.getGroupById(groupId, currentUserId);
        
        return ResponseEntity.ok(ApiResponse.success(GroupDto.fromEntity(group)));
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<GroupDto>> createGroup(
            @Valid @RequestBody GroupRequest request,
            @CurrentUser UserPrincipal currentUser) {
        
        Group group = groupService.createGroup(request, currentUser.getId());
        
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(GroupDto.fromEntity(group), "Group created successfully"));
    }

    @PutMapping("/{groupId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<GroupDto>> updateGroup(
            @PathVariable Long groupId,
            @Valid @RequestBody UpdateGroupRequest request,
            @CurrentUser UserPrincipal currentUser) {
        
        Group group = groupService.updateGroup(groupId, request, currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success(GroupDto.fromEntity(group), "Group updated successfully"));
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
    public ResponseEntity<ApiResponse<PagedResponse<GroupMemberDto>>> getGroupMembers(
            @PathVariable Long groupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) GroupRole role,
            @CurrentUser UserPrincipal currentUser) {
        
        Pageable pageable = PageRequest.of(page, size);
        PagedResponse<GroupMember> members = groupService.getGroupMembers(groupId, role, pageable, currentUser.getId());
        
        // Convert to DTOs to avoid Hibernate serialization issues
        PagedResponse<GroupMemberDto> memberDtos = new PagedResponse<>(
            members.getContent().stream().map(GroupMemberDto::fromEntity).toList(),
            members.getTotalElements(),
            members.getTotalPages(),
            members.getCurrentPage(),
            members.getSize(),
            members.isFirst(),
            members.isLast(),
            members.isEmpty()
        );
        
        return ResponseEntity.ok(ApiResponse.success(memberDtos));
    }

    @PutMapping("/{groupId}/members/{userId}/role")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<String>> changeGroupMemberRole(
            @PathVariable Long groupId,
            @PathVariable Long userId,
            @RequestBody Map<String, GroupRole> requestBody,
            @CurrentUser UserPrincipal currentUser) {
        
        GroupRole role = requestBody.get("role");
        if (role == null) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Role is required"));
        }
        
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
        
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
            .body(ApiResponse.success("Member removed successfully"));
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
        
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(discussion, "Group discussion created successfully"));
    }
}