package com.educonnect.discussion.repository;

import com.educonnect.discussion.entity.Notification;
import com.educonnect.discussion.enums.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    Page<Notification> findByUserId(Long userId, Pageable pageable);
    
    Page<Notification> findByUserIdAndType(Long userId, NotificationType type, Pageable pageable);
    
    Page<Notification> findByUserIdAndIsRead(Long userId, Boolean isRead, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND " +
           "(:type IS NULL OR n.type = :type) AND " +
           "(:unread IS NULL OR n.isRead = :unread)")
    Page<Notification> findNotificationsWithFilters(
        @Param("userId") Long userId,
        @Param("type") NotificationType type,
        @Param("unread") Boolean unread,
        Pageable pageable
    );
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.isRead = false")
    Long countUnreadByUserId(@Param("userId") Long userId);
    
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.id = :id")
    void markAsRead(@Param("id") Long id);
    
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.id = :userId")
    void markAllAsReadByUserId(@Param("userId") Long userId);
}