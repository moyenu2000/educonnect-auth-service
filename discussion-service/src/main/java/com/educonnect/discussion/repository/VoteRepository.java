package com.educonnect.discussion.repository;

import com.educonnect.discussion.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    
    Optional<Vote> findByUserIdAndDiscussionId(Long userId, Long discussionId);
    
    Optional<Vote> findByUserIdAndAnswerId(Long userId, Long answerId);
    
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.discussion.id = :discussionId AND v.isUpvote = true")
    Long countUpvotesByDiscussionId(@Param("discussionId") Long discussionId);
    
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.discussion.id = :discussionId AND v.isUpvote = false")
    Long countDownvotesByDiscussionId(@Param("discussionId") Long discussionId);
    
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.answer.id = :answerId AND v.isUpvote = true")
    Long countUpvotesByAnswerId(@Param("answerId") Long answerId);
    
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.answer.id = :answerId AND v.isUpvote = false")
    Long countDownvotesByAnswerId(@Param("answerId") Long answerId);
    
    void deleteByUserIdAndDiscussionId(Long userId, Long discussionId);
    
    void deleteByUserIdAndAnswerId(Long userId, Long answerId);
}