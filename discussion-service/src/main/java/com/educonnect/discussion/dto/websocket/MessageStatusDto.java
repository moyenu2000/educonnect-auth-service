package com.educonnect.discussion.dto.websocket;

import java.time.LocalDateTime;

public class MessageStatusDto {
    private Long messageId;
    private String status; // SENT, DELIVERED, READ
    private LocalDateTime timestamp;

    public MessageStatusDto() {}

    public MessageStatusDto(Long messageId, String status, LocalDateTime timestamp) {
        this.messageId = messageId;
        this.status = status;
        this.timestamp = timestamp;
    }

    public Long getMessageId() {
        return messageId;
    }

    public void setMessageId(Long messageId) {
        this.messageId = messageId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}