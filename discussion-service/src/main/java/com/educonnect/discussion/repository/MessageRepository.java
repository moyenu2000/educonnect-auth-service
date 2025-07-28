package com.educonnect.discussion.repository;

import com.educonnect.discussion.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    Page<Message> findByConversationId(Long conversationId, Pageable pageable);
    
    @Query("SELECT m FROM Message m WHERE m.conversation.id = :conversationId AND " +
           "(:before IS NULL OR m.createdAt < :before) ORDER BY m.createdAt DESC")
    Page<Message> findByConversationIdAndCreatedAtBefore(
        @Param("conversationId") Long conversationId,
        @Param("before") LocalDateTime before,
        Pageable pageable
    );
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.recipient.id = :userId AND m.isRead = false")
    Long countUnreadMessagesByUserId(@Param("userId") Long userId);
    
    @Modifying
    @Query("UPDATE Message m SET m.isRead = true WHERE m.id = :messageId")
    void markAsRead(@Param("messageId") Long messageId);
    
    @Modifying
    @Query("UPDATE Message m SET m.isRead = true WHERE m.conversation.id = :conversationId AND m.recipient.id = :userId")
    void markAllAsReadInConversation(@Param("conversationId") Long conversationId, @Param("userId") Long userId);
    
    @Query("SELECT m FROM Message m WHERE m.conversation.id = :conversationId AND m.id != :excludeId " +
           "ORDER BY m.createdAt DESC")
    Page<Message> findTopByConversationIdAndIdNotOrderByCreatedAtDesc(
        @Param("conversationId") Long conversationId, 
        @Param("excludeId") Long excludeId,
        Pageable pageable
    );
}