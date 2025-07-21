
package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.Question;
import com.educonnect.assessment.enums.Difficulty;
import com.educonnect.assessment.enums.QuestionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    Page<Question> findByIsActiveTrue(Pageable pageable);
    
    Page<Question> findBySubjectIdAndIsActiveTrue(Long subjectId, Pageable pageable);
    
    Page<Question> findByTopicIdAndIsActiveTrue(Long topicId, Pageable pageable);
    
    Page<Question> findByDifficultyAndIsActiveTrue(Difficulty difficulty, Pageable pageable);
    
    Page<Question> findByTypeAndIsActiveTrue(QuestionType type, Pageable pageable);
    
    Optional<Question> findByIdAndIsActiveTrue(Long id);
    
    @Query("SELECT q FROM Question q WHERE q.isActive = true AND " +
           "(:subjectId IS NULL OR q.subjectId = :subjectId) AND " +
           "(:topicId IS NULL OR q.topicId = :topicId) AND " +
           "(:difficulty IS NULL OR q.difficulty = :difficulty) AND " +
           "(:type IS NULL OR q.type = :type)")
    Page<Question> findFilteredQuestions(
            @Param("subjectId") Long subjectId,
            @Param("topicId") Long topicId,
            @Param("difficulty") Difficulty difficulty,
            @Param("type") QuestionType type,
            @Param("search") String search,
            Pageable pageable);
    
    List<Question> findBySubjectIdAndDifficultyAndIsActiveTrueOrderByCreatedAtDesc(
            Long subjectId, Difficulty difficulty);
    
    @Query("SELECT q FROM Question q WHERE q.subjectId = :subjectId AND q.isActive = true " +
           "ORDER BY RANDOM() LIMIT :count")
    List<Question> findRandomQuestionsBySubject(@Param("subjectId") Long subjectId, 
                                               @Param("count") int count);
    
    @Query("SELECT q FROM Question q WHERE q.subjectId = :subjectId AND q.difficulty = :difficulty " +
           "AND q.isActive = true ORDER BY RANDOM() LIMIT :count")
    List<Question> findRandomQuestionsBySubjectAndDifficulty(
            @Param("subjectId") Long subjectId,
            @Param("difficulty") Difficulty difficulty,
            @Param("count") int count);
    
    long countBySubjectIdAndIsActiveTrue(Long subjectId);
    
    long countByTopicIdAndIsActiveTrue(Long topicId);
    
    boolean existsByCreatedBy(Long userId);
}