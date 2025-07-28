package com.educonnect.discussion.dto;

import com.educonnect.discussion.entity.Group;
import com.educonnect.discussion.enums.ClassLevel;
import com.educonnect.discussion.enums.GroupRole;
import com.educonnect.discussion.enums.GroupType;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class GroupDto {
    private Long id;
    private String name;
    private String description;
    private GroupType type;
    private Long subjectId;
    private ClassLevel classLevel;
    private Boolean isPrivate;
    private String avatarUrl;
    private String rules;
    private Integer membersCount;
    private Integer discussionsCount;
    private UserDto createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean joined;
    private GroupRole userRole;

    public GroupDto() {}

    public GroupDto(Group group) {
        this.id = group.getId();
        this.name = group.getName();
        this.description = group.getDescription();
        this.type = group.getType();
        this.subjectId = group.getSubjectId();
        this.classLevel = group.getClassLevel();
        this.isPrivate = group.getIsPrivate();
        this.avatarUrl = group.getAvatarUrl();
        this.rules = group.getRules();
        this.membersCount = group.getMembersCount();
        this.discussionsCount = group.getDiscussionsCount();
        this.createdBy = group.getCreatedBy() != null ? new UserDto(group.getCreatedBy()) : null;
        this.createdAt = group.getCreatedAt();
        this.updatedAt = group.getUpdatedAt();
    }

    public static GroupDto fromEntity(Group group) {
        return new GroupDto(group);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public GroupType getType() {
        return type;
    }

    public void setType(GroupType type) {
        this.type = type;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public ClassLevel getClassLevel() {
        return classLevel;
    }

    public void setClassLevel(ClassLevel classLevel) {
        this.classLevel = classLevel;
    }

    public Boolean getIsPrivate() {
        return isPrivate;
    }

    public void setIsPrivate(Boolean isPrivate) {
        this.isPrivate = isPrivate;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getRules() {
        return rules;
    }

    public void setRules(String rules) {
        this.rules = rules;
    }

    public Integer getMembersCount() {
        return membersCount;
    }

    public void setMembersCount(Integer membersCount) {
        this.membersCount = membersCount;
    }

    public Integer getDiscussionsCount() {
        return discussionsCount;
    }

    public void setDiscussionsCount(Integer discussionsCount) {
        this.discussionsCount = discussionsCount;
    }

    public UserDto getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserDto createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Boolean getJoined() {
        return joined;
    }

    public void setJoined(Boolean joined) {
        this.joined = joined;
    }

    public GroupRole getUserRole() {
        return userRole;
    }

    public void setUserRole(GroupRole userRole) {
        this.userRole = userRole;
    }
}