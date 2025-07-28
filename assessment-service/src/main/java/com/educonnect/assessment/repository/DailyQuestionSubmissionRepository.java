package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.DailyQuestionSubmission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyQuestionSubmissionRepository extends JpaRepository<DailyQuestionSubmission, Long> {

    // Find submission by user and daily question
    Optional<DailyQuestionSubmission> findByUserIdAndDailyQuestionId(Long userId, Long dailyQuestionId);

    // Find all submissions by user for a specific date
    @Query("SELECT dqs FROM DailyQuestionSubmission dqs " +
           "JOIN dqs.dailyQuestion dq " +
           "WHERE dqs.userId = :userId AND dq.date = :date")
    List<DailyQuestionSubmission> findByUserIdAndDate(@Param("userId") Long userId, 
                                                      @Param("date") LocalDate date);

    // Find submissions by user with pagination
    Page<DailyQuestionSubmission> findByUserIdOrderBySubmittedAtDesc(Long userId, Pageable pageable);

    // Find submissions by user and subject with pagination
    @Query("SELECT dqs FROM DailyQuestionSubmission dqs " +
           "JOIN dqs.dailyQuestion dq " +
           "WHERE dqs.userId = :userId AND dq.subjectId = :subjectId " +
           "ORDER BY dqs.submittedAt DESC")
    Page<DailyQuestionSubmission> findByUserIdAndSubjectId(@Param("userId") Long userId, 
                                                           @Param("subjectId") Long subjectId, 
                                                           Pageable pageable);

    // Count correct answers by user
    @Query("SELECT COUNT(dqs) FROM DailyQuestionSubmission dqs WHERE dqs.userId = :userId AND dqs.isCorrect = true")
    long countCorrectSubmissionsByUserId(@Param("userId") Long userId);

    // Count total submissions by user
    long countByUserId(Long userId);

    // Find submissions for analytics calculation
    @Query("SELECT dqs FROM DailyQuestionSubmission dqs " +
           "JOIN dqs.dailyQuestion dq " +
           "WHERE dqs.userId = :userId AND dq.date = :date " +
           "AND (:subjectId IS NULL OR dq.subjectId = :subjectId)")
    List<DailyQuestionSubmission> findForAnalytics(@Param("userId") Long userId, 
                                                   @Param("date") LocalDate date, 
                                                   @Param("subjectId") Long subjectId);

    // Get user's recent performance
    @Query("SELECT dqs FROM DailyQuestionSubmission dqs " +
           "JOIN dqs.dailyQuestion dq " +
           "WHERE dqs.userId = :userId AND dq.date >= :fromDate " +
           "ORDER BY dq.date DESC, dqs.submittedAt DESC")
    List<DailyQuestionSubmission> findRecentSubmissions(@Param("userId") Long userId, 
                                                        @Param("fromDate") LocalDate fromDate);

    // Check if user has attempted a specific daily question
    boolean existsByUserIdAndDailyQuestionId(Long userId, Long dailyQuestionId);

    // Get submissions for a specific daily question (for admin analytics)
    List<DailyQuestionSubmission> findByDailyQuestionId(Long dailyQuestionId);

    // Get average time taken for a question
    @Query("SELECT AVG(dqs.timeTakenSeconds) FROM DailyQuestionSubmission dqs WHERE dqs.dailyQuestionId = :dailyQuestionId")
    Double findAverageTimeByDailyQuestionId(@Param("dailyQuestionId") Long dailyQuestionId);

    // Get accuracy rate for a question
    @Query("SELECT (COUNT(CASE WHEN dqs.isCorrect = true THEN 1 END) * 100.0 / COUNT(dqs)) " +
           "FROM DailyQuestionSubmission dqs WHERE dqs.dailyQuestionId = :dailyQuestionId")
    Double findAccuracyRateByDailyQuestionId(@Param("dailyQuestionId") Long dailyQuestionId);
}