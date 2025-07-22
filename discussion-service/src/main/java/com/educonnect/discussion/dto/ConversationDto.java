package com.educonnect.discussion.dto;

import com.educonnect.discussion.entity.Conversation;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ConversationDto {
    private Long id;
    private List<UserDto> participants;
    private MessageDto lastMessage;
    private Integer unreadCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ConversationDto() {}

    public ConversationDto(Conversation conversation) {
        this.id = conversation.getId();
        this.participants = conversation.getParticipants() != null ? 
            conversation.getParticipants().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList()) : null;
        this.lastMessage = conversation.getLastMessage() != null ? 
            new MessageDto(conversation.getLastMessage()) : null;
        this.unreadCount = conversation.getUnreadCount();
        this.createdAt = conversation.getCreatedAt();
        this.updatedAt = conversation.getUpdatedAt();
    }

    public static ConversationDto fromEntity(Conversation conversation) {
        return new ConversationDto(conversation);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<UserDto> getParticipants() {
        return participants;
    }

    public void setParticipants(List<UserDto> participants) {
        this.participants = participants;
    }

    public MessageDto getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(MessageDto lastMessage) {
        this.lastMessage = lastMessage;
    }

    public Integer getUnreadCount() {
        return unreadCount;
    }

    public void setUnreadCount(Integer unreadCount) {
        this.unreadCount = unreadCount;
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
}