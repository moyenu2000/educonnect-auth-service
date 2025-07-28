package com.educonnect.discussion.dto;

import com.educonnect.discussion.entity.Message;
import com.educonnect.discussion.enums.MessageType;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class MessageDto {
    private Long id;
    private String content;
    private MessageType type;
    private UserDto sender;
    private UserDto recipient;
    private Long conversationId;
    private List<String> attachments;
    private Boolean isRead;
    private Boolean isEdited;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MessageDto() {}

    public MessageDto(Message message) {
        this.id = message.getId();
        this.content = message.getContent();
        this.type = message.getType();
        this.sender = message.getSender() != null ? new UserDto(message.getSender()) : null;
        this.recipient = message.getRecipient() != null ? new UserDto(message.getRecipient()) : null;
        this.conversationId = message.getConversation() != null ? message.getConversation().getId() : null;
        this.attachments = message.getAttachments() != null ? message.getAttachments() : new ArrayList<>();
        this.isRead = message.getIsRead();
        this.isEdited = message.getIsEdited();
        this.createdAt = message.getCreatedAt();
        this.updatedAt = message.getUpdatedAt();
    }

    public static MessageDto fromEntity(Message message) {
        return new MessageDto(message);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public UserDto getSender() {
        return sender;
    }

    public void setSender(UserDto sender) {
        this.sender = sender;
    }

    public UserDto getRecipient() {
        return recipient;
    }

    public void setRecipient(UserDto recipient) {
        this.recipient = recipient;
    }

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }

    public List<String> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<String> attachments) {
        this.attachments = attachments;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public Boolean getIsEdited() {
        return isEdited;
    }

    public void setIsEdited(Boolean isEdited) {
        this.isEdited = isEdited;
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