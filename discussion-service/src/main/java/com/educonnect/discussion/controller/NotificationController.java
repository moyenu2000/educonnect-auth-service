package com.educonnect.discussion.controller;

import com.educonnect.discussion.dto.ApiResponse;
import com.educonnect.discussion.dto.PagedResponse;
import com.educonnect.discussion.entity.Notification;
import com.educonnect.discussion.enums.NotificationType;
import com.educonnect.discussion.security.CurrentUser;
import com.educonnect.discussion.security.UserPrincipal;
import com.educonnect.discussion.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/notifications")
@PreAuthorize("hasRole('USER')")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<Notification>>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) NotificationType type,
            @RequestParam(required = false) Boolean unread,
            @CurrentUser UserPrincipal currentUser) {
        
        Pageable pageable = PageRequest.of(page, size);
        PagedResponse<Notification> notifications = notificationService.getUserNotifications(
            currentUser.getId(), type, unread, pageable);
        
        // Add unread count to response
        Long unreadCount = notificationService.getUnreadNotificationsCount(currentUser.getId());
        notifications.setTotalElements(unreadCount.intValue());
        
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse<String>> markNotificationAsRead(
            @PathVariable Long notificationId,
            @CurrentUser UserPrincipal currentUser) {
        
        notificationService.markNotificationAsRead(notificationId, currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read"));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<String>> markAllNotificationsAsRead(
            @CurrentUser UserPrincipal currentUser) {
        
        notificationService.markAllNotificationsAsRead(currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read"));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(
            @CurrentUser UserPrincipal currentUser) {
        
        Long unreadCount = notificationService.getUnreadNotificationsCount(currentUser.getId());
        
        return ResponseEntity.ok(ApiResponse.success(Map.of("unreadCount", unreadCount)));
    }
}