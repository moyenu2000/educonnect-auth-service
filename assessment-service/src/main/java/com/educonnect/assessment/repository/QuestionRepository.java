
package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.Question;
import com.educonnect.assessment.enums.Difficulty;
import com.educonnect.assessment.enums.QuestionType;
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
           "(:type IS NULL OR q.type = :type) AND " +
           "(:search IS NULL OR :search = '' OR " +
           "UPPER(q.text) LIKE UPPER(CONCAT('%', :search, '%')) OR " +
           "UPPER(q.explanation) LIKE UPPER(CONCAT('%', :search, '%')))")
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
    
    // Statistics methods
    long countByDifficulty(Difficulty difficulty);
    
    long countByType(QuestionType type);
    
    @Query(value = "SELECT s.name, COUNT(q.id) FROM assessment.questions q " +
           "JOIN assessment.subjects s ON q.subject_id = s.id " +
           "WHERE q.is_active = true GROUP BY s.name ORDER BY COUNT(q.id) DESC", 
           nativeQuery = true)
    List<Object[]> getQuestionCountBySubject();
    
    @Modifying
    @Query(value = "UPDATE assessment.questions SET text = :text, type = :type, subject_id = :subjectId, topic_id = :topicId, " +
                   "difficulty = :difficulty, explanation = :explanation, points = :points, " +
                   "correct_answer_option_id = :correctAnswerOptionId, correct_answer_text = :correctAnswerText, " +
                   "updated_at = NOW() WHERE id = :id", nativeQuery = true)
    void updateQuestionDetails(@Param("id") Long id, 
                              @Param("text") String text,
                              @Param("type") String type,
                              @Param("subjectId") Long subjectId,
                              @Param("topicId") Long topicId,
                              @Param("difficulty") String difficulty,
                              @Param("explanation") String explanation,
                              @Param("points") Integer points,
                              @Param("correctAnswerOptionId") Long correctAnswerOptionId,
                              @Param("correctAnswerText") String correctAnswerText);
    
    // Native query to get question options without entity loading
    @Query(value = """
        SELECT qo.id, qo.text, qo.option_order 
        FROM assessment.question_options qo 
        WHERE qo.question_id = :questionId 
        ORDER BY qo.option_order
    """, nativeQuery = true)
    List<Object[]> findQuestionOptionsNative(@Param("questionId") Long questionId);
}