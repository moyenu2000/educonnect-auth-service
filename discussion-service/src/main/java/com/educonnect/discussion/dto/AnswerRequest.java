package com.educonnect.discussion.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public class AnswerRequest {
    @NotBlank(message = "Content is required")
    private String content;

    private List<String> attachments;
    private Boolean isAnonymous = false;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<String> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<String> attachments) {
        this.attachments = attachments;
    }

    public Boolean getIsAnonymous() {
        return isAnonymous;
    }

    public void setIsAnonymous(Boolean isAnonymous) {
        this.isAnonymous = isAnonymous;
    }
}