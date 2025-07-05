package com.educonnect.discussion.controller;

import com.educonnect.discussion.dto.ApiResponse;
import com.educonnect.discussion.dto.ConversationDto;
import com.educonnect.discussion.dto.MessageDto;
import com.educonnect.discussion.dto.MessageRequest;
import com.educonnect.discussion.dto.PagedResponse;
import com.educonnect.discussion.entity.Conversation;
import com.educonnect.discussion.entity.Message;
import com.educonnect.discussion.security.CurrentUser;
import com.educonnect.discussion.security.UserPrincipal;
import com.educonnect.discussion.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/messages")
@PreAuthorize("hasRole('USER')")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<PagedResponse<ConversationDto>>> getConversations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @CurrentUser UserPrincipal currentUser) {
        
        Pageable pageable = PageRequest.of(page, size);
        PagedResponse<ConversationDto> conversations = messageService.getUserConversations(currentUser.getId(), pageable);
        
        return ResponseEntity.ok(ApiResponse.success(conversations));
    }

    @GetMapping("/conversations/{conversationId}")
    public ResponseEntity<ApiResponse<PagedResponse<MessageDto>>> getConversationMessages(
            @PathVariable Long conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime before,
            @CurrentUser UserPrincipal currentUser) {
        
        Pageable pageable = PageRequest.of(page, size);
        PagedResponse<MessageDto> messages = messageService.getConversationMessages(
            conversationId, before, pageable, currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MessageDto>> sendMessage(
            @Valid @RequestBody MessageRequest request,
            @CurrentUser UserPrincipal currentUser) {
        
        MessageDto message = messageService.sendMessage(request, currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success(message, "Message sent successfully"));
    }

    @PutMapping("/{messageId}")
    public ResponseEntity<ApiResponse<MessageDto>> updateMessage(
            @PathVariable Long messageId,
            @RequestBody Map<String, String> requestBody,
            @CurrentUser UserPrincipal currentUser) {
        
        String content = requestBody.get("content");
        MessageDto message = messageService.updateMessage(messageId, content, currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success(message, "Message updated successfully"));
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<ApiResponse<String>> deleteMessage(
            @PathVariable Long messageId,
            @CurrentUser UserPrincipal currentUser) {
        
        messageService.deleteMessage(messageId, currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success("Message deleted successfully"));
    }

    @PutMapping("/{messageId}/read")
    public ResponseEntity<ApiResponse<String>> markMessageAsRead(
            @PathVariable Long messageId,
            @CurrentUser UserPrincipal currentUser) {
        
        messageService.markMessageAsRead(messageId, currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success("Message marked as read"));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(
            @CurrentUser UserPrincipal currentUser) {
        
        Long unreadCount = messageService.getUnreadMessagesCount(currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success(Map.of("unreadCount", unreadCount)));
    }
}