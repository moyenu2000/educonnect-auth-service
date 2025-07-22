package com.educonnect.discussion.repository;

import com.educonnect.discussion.entity.AIQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AIQueryRepository extends JpaRepository<AIQuery, Long> {
    
    Page<AIQuery> findByUserId(Long userId, Pageable pageable);
    
    @Query("SELECT aq FROM AIQuery aq WHERE aq.user.id = :userId AND " +
           "(:subjectId IS NULL OR aq.subjectId = :subjectId)")
    Page<AIQuery> findByUserIdAndSubjectId(
        @Param("userId") Long userId,
        @Param("subjectId") Long subjectId,
        Pageable pageable
    );
}