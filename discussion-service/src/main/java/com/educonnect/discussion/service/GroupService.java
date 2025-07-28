package com.educonnect.discussion.service;

import com.educonnect.discussion.dto.GroupRequest;
import com.educonnect.discussion.dto.UpdateGroupRequest;
import com.educonnect.discussion.dto.PagedResponse;
import com.educonnect.discussion.entity.Group;
import com.educonnect.discussion.entity.GroupMember;
import com.educonnect.discussion.enums.GroupRole;
import com.educonnect.discussion.enums.GroupType;
import org.springframework.data.domain.Pageable;

public interface GroupService {
    
    PagedResponse<Group> getGroups(GroupType type, Long subjectId, Boolean joined, Pageable pageable, Long currentUserId);
    
    Group getGroupById(Long id, Long currentUserId);
    
    Group createGroup(GroupRequest request, Long creatorId);
    
    Group updateGroup(Long id, UpdateGroupRequest request, Long currentUserId);
    
    void joinGroup(Long groupId, Long userId);
    
    PagedResponse<GroupMember> getGroupMembers(Long groupId, GroupRole role, Pageable pageable, Long currentUserId);
    
    void changeGroupMemberRole(Long groupId, Long userId, GroupRole newRole, Long currentUserId);
    
    void removeGroupMember(Long groupId, Long userId, Long currentUserId);
    
    PagedResponse<Group> searchGroups(String query, GroupType type, Pageable pageable);
}