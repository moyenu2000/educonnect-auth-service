package com.educonnect.discussion.repository;

import com.educonnect.discussion.entity.Discussion;
import com.educonnect.discussion.enums.ClassLevel;
import com.educonnect.discussion.enums.DiscussionStatus;
import com.educonnect.discussion.enums.DiscussionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiscussionRepository extends JpaRepository<Discussion, Long> {
    
    Page<Discussion> findByStatus(DiscussionStatus status, Pageable pageable);
    
    Page<Discussion> findByStatusAndType(DiscussionStatus status, DiscussionType type, Pageable pageable);
    
    Page<Discussion> findByStatusAndSubjectId(DiscussionStatus status, Long subjectId, Pageable pageable);
    
    Page<Discussion> findByStatusAndTopicId(DiscussionStatus status, Long topicId, Pageable pageable);
    
    Page<Discussion> findByStatusAndClassLevel(DiscussionStatus status, ClassLevel classLevel, Pageable pageable);
    
    Page<Discussion> findByGroupId(Long groupId, Pageable pageable);
    
    Page<Discussion> findByAuthorId(Long authorId, Pageable pageable);
    
    @Query("SELECT d FROM Discussion d WHERE d.status = :status AND " +
           "(:type IS NULL OR d.type = :type) AND " +
           "(:subjectId IS NULL OR d.subjectId = :subjectId) AND " +
           "(:topicId IS NULL OR d.topicId = :topicId) AND " +
           "(:classLevel IS NULL OR d.classLevel = :classLevel) AND " +
           "(:groupId IS NULL OR d.groupId = :groupId)")
    Page<Discussion> findDiscussionsWithFilters(
        @Param("status") DiscussionStatus status,
        @Param("type") DiscussionType type,
        @Param("subjectId") Long subjectId,
        @Param("topicId") Long topicId,
        @Param("classLevel") ClassLevel classLevel,
        @Param("groupId") Long groupId,
        Pageable pageable
    );
    
    @Query("SELECT d FROM Discussion d WHERE d.status = 'ACTIVE' AND " +
           "(d.title LIKE %:query% OR d.content LIKE %:query%) AND " +
           "(:subjectId IS NULL OR d.subjectId = :subjectId) AND " +
           "(:type IS NULL OR d.type = :type)")
    Page<Discussion> searchDiscussions(
        @Param("query") String query,
        @Param("subjectId") Long subjectId,
        @Param("type") DiscussionType type,
        Pageable pageable
    );
    
    @Modifying
    @Query("UPDATE Discussion d SET d.viewsCount = d.viewsCount + 1 WHERE d.id = :id")
    void incrementViewsCount(@Param("id") Long id);
    
    @Modifying
    @Query("UPDATE Discussion d SET d.answersCount = d.answersCount + 1 WHERE d.id = :id")
    void incrementAnswersCount(@Param("id") Long id);
    
    @Modifying
    @Query("UPDATE Discussion d SET d.answersCount = d.answersCount - 1 WHERE d.id = :id AND d.answersCount > 0")
    void decrementAnswersCount(@Param("id") Long id);
    
    @Query("SELECT COUNT(d) FROM Discussion d WHERE d.groupId = :groupId AND d.status = 'ACTIVE'")
    Long countByGroupId(@Param("groupId") Long groupId);
}