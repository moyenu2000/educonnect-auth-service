package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.DailyQuestion;
import com.educonnect.assessment.enums.ClassLevel;
import com.educonnect.assessment.enums.Difficulty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
@Repository
public interface DailyQuestionRepository extends JpaRepository<DailyQuestion, Long> {
    
    List<DailyQuestion> findByDate(LocalDate date);
    
    List<DailyQuestion> findByDateAndSubjectId(LocalDate date, Long subjectId);
    
    @Query("SELECT dq FROM DailyQuestion dq JOIN dq.question q JOIN q.subject s WHERE dq.date = :date " +
           "AND (:subjectId IS NULL OR dq.subjectId = :subjectId) " +
           "AND (:classLevel IS NULL OR s.classLevel = :classLevel)")
    List<DailyQuestion> findFilteredDailyQuestions(
            @Param("date") LocalDate date,
            @Param("subjectId") Long subjectId,
            @Param("classLevel") ClassLevel classLevel);
    
    @Query("SELECT dq FROM DailyQuestion dq WHERE dq.date = :date " +
           "AND (:subjectId IS NULL OR dq.subjectId = :subjectId) " +
           "AND (:difficulty IS NULL OR dq.difficulty = :difficulty)")
    List<DailyQuestion> findFilteredDailyQuestionsWithDifficulty(
            @Param("date") LocalDate date,
            @Param("subjectId") Long subjectId,
            @Param("classLevel") ClassLevel classLevel,
            @Param("difficulty") Difficulty difficulty);
    
    Optional<DailyQuestion> findByDateAndQuestionId(LocalDate date, Long questionId);
    
    List<DailyQuestion> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    boolean existsByDateAndQuestionId(LocalDate date, Long questionId);
    
    boolean existsByQuestionId(Long questionId);
    
    // Find by subject for a date range
    @Query("SELECT dq FROM DailyQuestion dq WHERE dq.subjectId = :subjectId " +
           "AND dq.date BETWEEN :startDate AND :endDate ORDER BY dq.date DESC")
    List<DailyQuestion> findBySubjectIdAndDateRange(@Param("subjectId") Long subjectId,
                                                   @Param("startDate") LocalDate startDate,
                                                   @Param("endDate") LocalDate endDate);
    
    // Get questions for analytics
    @Query("SELECT dq FROM DailyQuestion dq WHERE dq.date = :date " +
           "AND (:subjectId IS NULL OR dq.subjectId = :subjectId)")
    List<DailyQuestion> findForAnalytics(@Param("date") LocalDate date,
                                        @Param("subjectId") Long subjectId);
    
    @Query("SELECT COUNT(dq) FROM DailyQuestion dq WHERE dq.date = :date")
    long countByDate(@Param("date") LocalDate date);
    
    // Delete all daily questions for a specific date
    @Modifying
    @Query("DELETE FROM DailyQuestion dq WHERE dq.date = :date")
    void deleteByDate(@Param("date") LocalDate date);
    
    // Native delete for more reliable deletion
    @Modifying
    @Query(value = "DELETE FROM daily_questions WHERE date = :date", nativeQuery = true)
    int deleteByDateNative(@Param("date") LocalDate date);
    
    // Native upsert query
    @Modifying
    @Query(value = """
        INSERT INTO daily_questions (question_id, date, subject_id, difficulty, points, bonus_points, created_at)
        VALUES (:questionId, :date, :subjectId, :difficulty, :points, 0, NOW())
        ON CONFLICT (date, question_id) 
        DO UPDATE SET 
            subject_id = EXCLUDED.subject_id,
            difficulty = EXCLUDED.difficulty,
            points = EXCLUDED.points
    """, nativeQuery = true)
    void upsertDailyQuestion(@Param("questionId") Long questionId, 
                           @Param("date") LocalDate date, 
                           @Param("subjectId") Long subjectId,
                           @Param("difficulty") String difficulty, 
                           @Param("points") Integer points);
    
    // Native query to get daily questions with question data without entity loading
    @Query(value = """
        SELECT 
            dq.id, dq.question_id, dq.date, dq.subject_id, dq.difficulty, 
            dq.points, dq.bonus_points, q.text, q.type
        FROM daily_questions dq
        LEFT JOIN questions q ON dq.question_id = q.id
        WHERE dq.date = :date
        ORDER BY dq.id
    """, nativeQuery = true)
    List<Object[]> findDailyQuestionsWithQuestionDataNative(@Param("date") LocalDate date);
    
    // Native query to get all daily questions (for history)
    @Query(value = """
        SELECT 
            dq.id, dq.question_id, dq.date, dq.subject_id, dq.difficulty, 
            dq.points, dq.bonus_points, q.text, q.type, s.name as subject_name
        FROM daily_questions dq
        LEFT JOIN questions q ON dq.question_id = q.id
        LEFT JOIN subjects s ON dq.subject_id = s.id
        WHERE (:startDate IS NULL OR dq.date >= :startDate)
        AND (:endDate IS NULL OR dq.date <= :endDate)
        ORDER BY dq.date DESC, dq.id
    """, nativeQuery = true)
    List<Object[]> findAllDailyQuestionsNative(@Param("startDate") LocalDate startDate, 
                                             @Param("endDate") LocalDate endDate);

}