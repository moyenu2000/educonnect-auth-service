package com.educonnect.discussion.dto;

import com.educonnect.discussion.entity.GroupMember;
import com.educonnect.discussion.enums.GroupRole;

import java.time.LocalDateTime;

public class GroupMemberDto {
    private Long id;
    private UserDto user;
    private GroupRole role;
    private LocalDateTime joinedAt;

    public GroupMemberDto() {}

    public GroupMemberDto(GroupMember groupMember) {
        this.id = groupMember.getId();
        this.user = UserDto.fromEntity(groupMember.getUser());
        this.role = groupMember.getRole();
        this.joinedAt = groupMember.getJoinedAt();
    }

    public static GroupMemberDto fromEntity(GroupMember groupMember) {
        return new GroupMemberDto(groupMember);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public GroupRole getRole() {
        return role;
    }

    public void setRole(GroupRole role) {
        this.role = role;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}