package com.educonnect.discussion.service;

import com.educonnect.discussion.dto.PagedResponse;
import com.educonnect.discussion.entity.Notification;
import com.educonnect.discussion.enums.NotificationType;
import org.springframework.data.domain.Pageable;

public interface NotificationService {
    
    PagedResponse<Notification> getUserNotifications(Long userId, NotificationType type, Boolean unread, Pageable pageable);
    
    void markNotificationAsRead(Long notificationId, Long userId);
    
    void markAllNotificationsAsRead(Long userId);
    
    Long getUnreadNotificationsCount(Long userId);
    
    void createNotification(Long userId, NotificationType type, String title, String content, Long relatedId, String relatedType);
}