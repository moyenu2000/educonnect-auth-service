package com.educonnect.discussion.repository;

import com.educonnect.discussion.entity.Answer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    
    Page<Answer> findByDiscussionId(Long discussionId, Pageable pageable);
    
    Page<Answer> findByAuthorId(Long authorId, Pageable pageable);
    
    @Query("SELECT a FROM Answer a WHERE a.discussion.id = :discussionId AND a.isAccepted = true")
    Optional<Answer> findAcceptedAnswerByDiscussionId(@Param("discussionId") Long discussionId);
    
    @Modifying
    @Query("UPDATE Answer a SET a.isAccepted = false WHERE a.discussion.id = :discussionId")
    void unacceptAllAnswersForDiscussion(@Param("discussionId") Long discussionId);
    
    @Query("SELECT COUNT(a) FROM Answer a WHERE a.discussion.id = :discussionId")
    Long countByDiscussionId(@Param("discussionId") Long discussionId);
    
    @Query("SELECT COUNT(a) FROM Answer a WHERE a.author.id = :authorId")
    Long countByAuthorId(@Param("authorId") Long authorId);
}