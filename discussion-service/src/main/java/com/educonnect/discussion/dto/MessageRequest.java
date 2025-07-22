package com.educonnect.discussion.dto;

import com.educonnect.discussion.enums.MessageType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class MessageRequest {
    @NotNull(message = "Recipient ID is required")
    private Long recipientId;

    @NotBlank(message = "Content is required")
    private String content;

    @NotNull(message = "Message type is required")
    private MessageType type;

    private List<String> attachments;

    public Long getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
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

    public List<String> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<String> attachments) {
        this.attachments = attachments;
    }
}