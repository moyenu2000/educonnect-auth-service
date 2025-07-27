package com.educonnect.discussion.service.impl;

import com.educonnect.discussion.dto.GroupRequest;
import com.educonnect.discussion.dto.PagedResponse;
import com.educonnect.discussion.entity.Group;
import com.educonnect.discussion.entity.GroupMember;
import com.educonnect.discussion.entity.User;
import com.educonnect.discussion.enums.GroupRole;
import com.educonnect.discussion.enums.GroupType;
import com.educonnect.discussion.exception.BadRequestException;
import com.educonnect.discussion.exception.ResourceNotFoundException;
import com.educonnect.discussion.exception.UnauthorizedException;
import com.educonnect.discussion.repository.GroupMemberRepository;
import com.educonnect.discussion.repository.GroupRepository;
import com.educonnect.discussion.repository.UserRepository;
import com.educonnect.discussion.service.GroupService;
import com.educonnect.discussion.service.UserSyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class GroupServiceImpl implements GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private GroupMemberRepository groupMemberRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSyncService userSyncService;

    @Override
    public PagedResponse<Group> getGroups(GroupType type, Long subjectId, Boolean joined, Pageable pageable, Long currentUserId) {
        Page<Group> groupsPage;
        
        if (joined != null && joined && currentUserId != null) {
            groupsPage = groupRepository.findGroupsByMemberId(currentUserId, pageable);
        } else {
            groupsPage = groupRepository.findGroupsWithFilters(type, subjectId, false, pageable); // Only show public groups
        }
        
        return PagedResponse.of(groupsPage);
    }

    @Override
    public Group getGroupById(Long id, Long currentUserId) {
        Group group = groupRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + id));
        
        // Check if private group and user is not a member
        if (group.getIsPrivate()) {
            if (currentUserId == null) {
                throw new UnauthorizedException("Authentication required to view private groups");
            }
            boolean isMember = groupMemberRepository.existsByGroupIdAndUserId(id, currentUserId);
            if (!isMember) {
                throw new UnauthorizedException("You must be a member to view this private group");
            }
        }
        
        return group;
    }

    @Override
    public Group createGroup(GroupRequest request, Long creatorId) {
        User creator = userSyncService.getOrCreateUser(creatorId);
        
        Group group = new Group();
        group.setName(request.getName());
        group.setDescription(request.getDescription());
        group.setType(request.getType());
        group.setSubjectId(request.getSubjectId());
        group.setClassLevel(request.getClassLevel());
        group.setIsPrivate(request.getIsPrivate());
        group.setAvatarUrl(request.getAvatarUrl());
        group.setRules(request.getRules());
        group.setCreatedBy(creator);
        group.setMembersCount(1); // Creator is the first member
        
        Group savedGroup = groupRepository.save(group);
        
        // Add creator as admin
        GroupMember creatorMember = new GroupMember();
        creatorMember.setUser(creator);
        creatorMember.setGroup(savedGroup);
        creatorMember.setRole(GroupRole.ADMIN);
        groupMemberRepository.save(creatorMember);
        
        return savedGroup;
    }

    @Override
    public Group updateGroup(Long id, GroupRequest request, Long currentUserId) {
        Group group = groupRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + id));
        
        // Check if user is admin or moderator
        GroupMember membership = groupMemberRepository.findByGroupIdAndUserId(id, currentUserId)
            .orElseThrow(() -> new UnauthorizedException("You must be a member to update this group"));
        
        if (membership.getRole() != GroupRole.ADMIN && membership.getRole() != GroupRole.MODERATOR) {
            throw new UnauthorizedException("Only admins and moderators can update groups");
        }
        
        group.setName(request.getName());
        group.setDescription(request.getDescription());
        group.setAvatarUrl(request.getAvatarUrl());
        group.setRules(request.getRules());
        
        return groupRepository.save(group);
    }

    @Override
    public void joinGroup(Long groupId, Long userId) {
        Group group = groupRepository.findById(groupId)
            .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + groupId));
        
        User user = userSyncService.getOrCreateUser(userId);
        
        // Check if user is already a member
        if (groupMemberRepository.existsByGroupIdAndUserId(groupId, userId)) {
            // If already a member, leave the group
            groupMemberRepository.deleteByGroupIdAndUserId(groupId, userId);
            groupRepository.decrementMembersCount(groupId);
        } else {
            // Join the group
            GroupMember member = new GroupMember();
            member.setUser(user);
            member.setGroup(group);
            member.setRole(GroupRole.MEMBER);
            groupMemberRepository.save(member);
            groupRepository.incrementMembersCount(groupId);
        }
    }

    @Override
    public PagedResponse<GroupMember> getGroupMembers(Long groupId, GroupRole role, Pageable pageable, Long currentUserId) {
        // Check if user is a member of the group
        if (!groupMemberRepository.existsByGroupIdAndUserId(groupId, currentUserId)) {
            throw new UnauthorizedException("You must be a member to view group members");
        }
        
        Page<GroupMember> membersPage = groupMemberRepository.findMembersWithFilters(groupId, role, pageable);
        return PagedResponse.of(membersPage);
    }

    @Override
    public void changeGroupMemberRole(Long groupId, Long userId, GroupRole newRole, Long currentUserId) {
        if (newRole == null) {
            throw new BadRequestException("Role cannot be null");
        }
        
        // Check if current user is admin
        GroupMember currentUserMembership = groupMemberRepository.findByGroupIdAndUserId(groupId, currentUserId)
            .orElseThrow(() -> new UnauthorizedException("You must be a member to change roles"));
        
        if (currentUserMembership.getRole() != GroupRole.ADMIN) {
            throw new UnauthorizedException("Only admins can change member roles");
        }
        
        GroupMember targetMember = groupMemberRepository.findByGroupIdAndUserId(groupId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("User is not a member of this group"));
        
        // Prevent demoting the last admin
        if (targetMember.getRole() == GroupRole.ADMIN && newRole != GroupRole.ADMIN) {
            long adminCount = groupMemberRepository.countByGroupIdAndRole(groupId, GroupRole.ADMIN);
            if (adminCount <= 1) {
                throw new BadRequestException("Cannot remove the last admin from the group");
            }
        }
        
        targetMember.setRole(newRole);
        groupMemberRepository.save(targetMember);
    }

    @Override
    public void removeGroupMember(Long groupId, Long userId, Long currentUserId) {
        // Check if current user is admin or moderator
        GroupMember currentUserMembership = groupMemberRepository.findByGroupIdAndUserId(groupId, currentUserId)
            .orElseThrow(() -> new UnauthorizedException("You must be a member to remove members"));
        
        if (currentUserMembership.getRole() != GroupRole.ADMIN && currentUserMembership.getRole() != GroupRole.MODERATOR) {
            throw new UnauthorizedException("Only admins and moderators can remove members");
        }
        
        GroupMember targetMember = groupMemberRepository.findByGroupIdAndUserId(groupId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("User is not a member of this group"));
        
        // Prevent removing the last admin
        if (targetMember.getRole() == GroupRole.ADMIN) {
            long adminCount = groupMemberRepository.countByGroupIdAndRole(groupId, GroupRole.ADMIN);
            if (adminCount <= 1) {
                throw new BadRequestException("Cannot remove the last admin from the group");
            }
        }
        
        groupMemberRepository.deleteByGroupIdAndUserId(groupId, userId);
        groupRepository.decrementMembersCount(groupId);
    }

    @Override
    public PagedResponse<Group> searchGroups(String query, GroupType type, Pageable pageable) {
        Page<Group> groupsPage = groupRepository.searchGroups(query, type, pageable);
        return PagedResponse.of(groupsPage);
    }
}