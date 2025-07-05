package com.educonnect.discussion.dto.websocket;

public class TypingStatusDto {
    private Long senderId;
    private String senderName;
    private Long conversationId;
    private boolean isTyping;

    public TypingStatusDto() {}

    public TypingStatusDto(Long senderId, String senderName, Long conversationId, boolean isTyping) {
        this.senderId = senderId;
        this.senderName = senderName;
        this.conversationId = conversationId;
        this.isTyping = isTyping;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }

    public boolean isTyping() {
        return isTyping;
    }

    public void setTyping(boolean typing) {
        isTyping = typing;
    }
}