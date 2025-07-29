package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.PracticeProblem;
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
public interface PracticeProblemRepository extends JpaRepository<PracticeProblem, Long> {
    
    Page<PracticeProblem> findByIsActiveTrue(Pageable pageable);
    
    Page<PracticeProblem> findBySubjectIdAndIsActiveTrue(Long subjectId, Pageable pageable);
    
    Page<PracticeProblem> findByTopicIdAndIsActiveTrue(Long topicId, Pageable pageable);
    
    Page<PracticeProblem> findByDifficultyAndIsActiveTrue(Difficulty difficulty, Pageable pageable);
    
    Page<PracticeProblem> findByTypeAndIsActiveTrue(QuestionType type, Pageable pageable);
    
    Optional<PracticeProblem> findByIdAndIsActiveTrue(Long id);
    
    @Query("SELECT pp FROM PracticeProblem pp WHERE pp.isActive = true AND " +
           "(:subjectId IS NULL OR pp.subjectId = :subjectId) AND " +
           "(:topicId IS NULL OR pp.topicId = :topicId) AND " +
           "(:difficulty IS NULL OR pp.difficulty = :difficulty) AND " +
           "(:type IS NULL OR pp.type = :type)")
    Page<PracticeProblem> findFilteredProblems(
            @Param("subjectId") Long subjectId,
            @Param("topicId") Long topicId,
            @Param("difficulty") Difficulty difficulty,
            @Param("type") QuestionType type,
            Pageable pageable);
    
    @Query("SELECT pp FROM PracticeProblem pp WHERE pp.subjectId = :subjectId AND pp.isActive = true " +
           "ORDER BY FUNCTION('RANDOM') LIMIT :count")
    List<PracticeProblem> findRandomProblemsBySubject(@Param("subjectId") Long subjectId, 
                                                     @Param("count") int count);
    
    @Query("SELECT pp FROM PracticeProblem pp WHERE pp.subjectId = :subjectId AND pp.difficulty = :difficulty " +
           "AND pp.isActive = true ORDER BY FUNCTION('RANDOM')")
    Page<PracticeProblem> findRandomProblemsBySubjectAndDifficulty(
            @Param("subjectId") Long subjectId,
            @Param("difficulty") Difficulty difficulty,
            Pageable pageable);
    
    List<PracticeProblem> findByIdIn(List<Long> ids);
    
    long countBySubjectIdAndIsActiveTrue(Long subjectId);
    
    long countByTopicIdAndIsActiveTrue(Long topicId);
    
    boolean existsByQuestionId(Long questionId);
    
    boolean existsByQuestionIdAndIsActive(Long questionId, Boolean isActive);
    
    Optional<PracticeProblem> findByQuestionIdAndIsActive(Long questionId, Boolean isActive);
    
    @Query(value = "SELECT pp.* FROM practice_problems pp " +
           "JOIN questions q ON pp.question_id = q.id " +
           "WHERE pp.is_active = true AND " +
           "(:subjectId IS NULL OR pp.subject_id = :subjectId) AND " +
           "(:topicId IS NULL OR pp.topic_id = :topicId) AND " +
           "(:difficulty IS NULL OR pp.difficulty = CAST(:difficulty AS VARCHAR)) AND " +
           "(:type IS NULL OR pp.type = CAST(:type AS VARCHAR)) AND " +
           "(:search IS NULL OR q.text ILIKE CONCAT('%', :search, '%')) " +
           "ORDER BY pp.created_at DESC",
           nativeQuery = true)
    Page<PracticeProblem> findActiveProblemsWithFilters(
            @Param("subjectId") Long subjectId,
            @Param("topicId") Long topicId,
            @Param("difficulty") String difficulty,
            @Param("type") String type,
            @Param("search") String search,
            Pageable pageable);
}