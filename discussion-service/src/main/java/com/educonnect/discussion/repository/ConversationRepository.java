package com.educonnect.discussion.repository;

import com.educonnect.discussion.entity.Conversation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    
    @Query("SELECT c FROM Conversation c JOIN c.participants p WHERE p.id = :userId ORDER BY c.updatedAt DESC")
    Page<Conversation> findByParticipantsId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT c FROM Conversation c WHERE SIZE(c.participants) = 2 AND " +
           "EXISTS (SELECT p1 FROM c.participants p1 WHERE p1.id = :user1Id) AND " +
           "EXISTS (SELECT p2 FROM c.participants p2 WHERE p2.id = :user2Id)")
    Optional<Conversation> findDirectConversation(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
}