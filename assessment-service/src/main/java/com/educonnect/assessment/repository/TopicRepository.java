package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.Topic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    
    Page<Topic> findByIsActiveTrue(Pageable pageable);
    
    Page<Topic> findBySubjectIdAndIsActiveTrue(Long subjectId, Pageable pageable);
    
    Page<Topic> findBySubjectId(Long subjectId, Pageable pageable);
    
    List<Topic> findBySubjectIdAndIsActiveTrueOrderByDisplayOrder(Long subjectId);
    
    Optional<Topic> findByIdAndIsActiveTrue(Long id);
    
    @Query("SELECT t FROM Topic t WHERE t.isActive = true AND " +
           "(:subjectId IS NULL OR t.subjectId = :subjectId) " +
           "ORDER BY t.displayOrder")
    Page<Topic> findFilteredTopics(@Param("subjectId") Long subjectId, Pageable pageable);
    
    boolean existsByNameAndSubjectId(String name, Long subjectId);
    
    boolean existsByNameAndSubjectIdAndIdNot(String name, Long subjectId, Long id);
    
    long countBySubjectIdAndIsActiveTrue(Long subjectId);
}