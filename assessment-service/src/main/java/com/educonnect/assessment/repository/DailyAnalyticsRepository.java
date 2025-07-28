package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.DailyAnalytics;
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
public interface DailyAnalyticsRepository extends JpaRepository<DailyAnalytics, Long> {

    // Find analytics by user, date, and subject
    Optional<DailyAnalytics> findByUserIdAndDateAndSubjectId(Long userId, LocalDate date, Long subjectId);

    // Find analytics by user and date (all subjects)
    List<DailyAnalytics> findByUserIdAndDate(Long userId, LocalDate date);

    // Find analytics by user for a date range
    @Query("SELECT da FROM DailyAnalytics da " +
           "WHERE da.userId = :userId AND da.date BETWEEN :startDate AND :endDate " +
           "ORDER BY da.date DESC")
    List<DailyAnalytics> findByUserIdAndDateRange(@Param("userId") Long userId, 
                                                  @Param("startDate") LocalDate startDate, 
                                                  @Param("endDate") LocalDate endDate);

    // Find analytics by user and subject for a date range
    @Query("SELECT da FROM DailyAnalytics da " +
           "WHERE da.userId = :userId AND da.subjectId = :subjectId " +
           "AND da.date BETWEEN :startDate AND :endDate " +
           "ORDER BY da.date DESC")
    List<DailyAnalytics> findByUserIdAndSubjectIdAndDateRange(@Param("userId") Long userId, 
                                                             @Param("subjectId") Long subjectId,
                                                             @Param("startDate") LocalDate startDate, 
                                                             @Param("endDate") LocalDate endDate);

    // Get user's streak information
    @Query("SELECT da FROM DailyAnalytics da " +
           "WHERE da.userId = :userId AND da.streakMaintained = true " +
           "AND (:subjectId IS NULL OR da.subjectId = :subjectId) " +
           "ORDER BY da.date DESC")
    List<DailyAnalytics> findUserStreakDays(@Param("userId") Long userId, 
                                           @Param("subjectId") Long subjectId);

    // Calculate total points earned by user
    @Query("SELECT SUM(da.totalPointsEarned) FROM DailyAnalytics da " +
           "WHERE da.userId = :userId " +
           "AND (:subjectId IS NULL OR da.subjectId = :subjectId)")
    Long getTotalPointsByUser(@Param("userId") Long userId, 
                             @Param("subjectId") Long subjectId);

    // Get user's overall accuracy
    @Query("SELECT AVG(da.accuracyPercentage) FROM DailyAnalytics da " +
           "WHERE da.userId = :userId AND da.questionsAttempted > 0 " +
           "AND (:subjectId IS NULL OR da.subjectId = :subjectId)")
    Double getAverageAccuracy(@Param("userId") Long userId, 
                             @Param("subjectId") Long subjectId);

    // Get user's performance trend (last N days)
    @Query("SELECT da FROM DailyAnalytics da " +
           "WHERE da.userId = :userId AND da.date >= :fromDate " +
           "AND (:subjectId IS NULL OR da.subjectId = :subjectId) " +
           "ORDER BY da.date DESC")
    List<DailyAnalytics> getPerformanceTrend(@Param("userId") Long userId, 
                                            @Param("fromDate") LocalDate fromDate,
                                            @Param("subjectId") Long subjectId);

    // Get analytics with pagination
    Page<DailyAnalytics> findByUserIdOrderByDateDesc(Long userId, Pageable pageable);

    // Find top performers for a specific date
    @Query("SELECT da FROM DailyAnalytics da " +
           "WHERE da.date = :date " +
           "AND (:subjectId IS NULL OR da.subjectId = :subjectId) " +
           "ORDER BY da.totalPointsEarned DESC, da.accuracyPercentage DESC")
    List<DailyAnalytics> findTopPerformers(@Param("date") LocalDate date, 
                                          @Param("subjectId") Long subjectId, 
                                          Pageable pageable);

    // Get subject-wise performance summary for a user
    @Query("SELECT da.subjectId, " +
           "SUM(da.questionsAttempted) as totalAttempted, " +
           "SUM(da.questionsSolved) as totalSolved, " +
           "SUM(da.totalPointsEarned) as totalPoints, " +
           "AVG(da.accuracyPercentage) as avgAccuracy " +
           "FROM DailyAnalytics da " +
           "WHERE da.userId = :userId " +
           "GROUP BY da.subjectId")
    List<Object[]> getSubjectWisePerformance(@Param("userId") Long userId);

    // Count active days for a user
    @Query("SELECT COUNT(DISTINCT da.date) FROM DailyAnalytics da " +
           "WHERE da.userId = :userId AND da.questionsAttempted > 0")
    Long countActiveDays(@Param("userId") Long userId);

    // Get current streak count
    @Query(value = "WITH consecutive_days AS (" +
                   "  SELECT date, " +
                   "         ROW_NUMBER() OVER (ORDER BY date DESC) as rn, " +
                   "         date - INTERVAL '1 day' * ROW_NUMBER() OVER (ORDER BY date DESC) as grp " +
                   "  FROM daily_analytics " +
                   "  WHERE user_id = :userId AND streak_maintained = true " +
                   "    AND (:subjectId IS NULL OR subject_id = :subjectId) " +
                   "    AND date <= CURRENT_DATE " +
                   ") " +
                   "SELECT COUNT(*) FROM consecutive_days " +
                   "WHERE grp = (SELECT grp FROM consecutive_days WHERE rn = 1)", 
           nativeQuery = true)
    Long getCurrentStreakCount(@Param("userId") Long userId, 
                              @Param("subjectId") Long subjectId);
}