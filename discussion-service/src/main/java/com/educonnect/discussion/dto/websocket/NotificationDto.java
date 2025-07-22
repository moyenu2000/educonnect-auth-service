package com.educonnect.discussion.dto.websocket;

import java.time.LocalDateTime;

public class NotificationDto {
    private String title;
    private String content;
    private LocalDateTime timestamp;

    public NotificationDto() {}

    public NotificationDto(String title, String content, LocalDateTime timestamp) {
        this.title = title;
        this.content = content;
        this.timestamp = timestamp;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}