package com.educonnect.discussion.service.impl;

import com.educonnect.discussion.dto.PagedResponse;
import com.educonnect.discussion.entity.Notification;
import com.educonnect.discussion.entity.User;
import com.educonnect.discussion.enums.NotificationType;
import com.educonnect.discussion.exception.ResourceNotFoundException;
import com.educonnect.discussion.exception.UnauthorizedException;
import com.educonnect.discussion.repository.NotificationRepository;
import com.educonnect.discussion.repository.UserRepository;
import com.educonnect.discussion.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public PagedResponse<Notification> getUserNotifications(Long userId, NotificationType type, Boolean unread, Pageable pageable) {
        Page<Notification> notificationsPage = notificationRepository.findNotificationsWithFilters(
            userId, type, unread != null && unread ? false : null, pageable);
        
        return PagedResponse.of(notificationsPage);
    }

    @Override
    public void markNotificationAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));
        
        if (!notification.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only mark your own notifications as read");
        }
        
        notificationRepository.markAsRead(notificationId);
    }

    @Override
    public void markAllNotificationsAsRead(Long userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }

    @Override
    public Long getUnreadNotificationsCount(Long userId) {
        return notificationRepository.countUnreadByUserId(userId);
    }

    @Override
    public void createNotification(Long userId, NotificationType type, String title, String content, Long relatedId, String relatedType) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Notification notification = new Notification();
        notification.setType(type);
        notification.setTitle(title);
        notification.setContent(content);
        notification.setUser(user);
        notification.setRelatedId(relatedId);
        notification.setRelatedType(relatedType);
        
        notificationRepository.save(notification);
    }
}