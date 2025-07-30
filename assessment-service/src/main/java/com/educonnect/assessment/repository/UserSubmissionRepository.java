package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.UserSubmission;
import com.educonnect.assessment.enums.ContestStatus;
import com.educonnect.assessment.enums.Difficulty;
import com.educonnect.assessment.enums.ExamSubmissionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface UserSubmissionRepository extends JpaRepository<UserSubmission, Long> {
    
    Optional<UserSubmission> findByUserIdAndQuestionIdAndIsDailyQuestion(
            Long userId, Long questionId, Boolean isDailyQuestion);
    
    List<UserSubmission> findByUserIdAndIsDailyQuestionTrueOrderBySubmittedAtDesc(Long userId);
    
    Page<UserSubmission> findByUserIdAndIsDailyQuestionTrue(Long userId, Pageable pageable);
    
    List<UserSubmission> findByUserIdAndContestIdIsNotNullOrderBySubmittedAtDesc(Long userId);
    
    @Query("SELECT us FROM UserSubmission us JOIN us.question q WHERE us.userId = :userId " +
           "AND us.isDailyQuestion = true AND " +
           "(:subjectId IS NULL OR q.subjectId = :subjectId) AND " +
           "(:status IS NULL OR us.isCorrect = :status) AND " +
           "(:difficulty IS NULL OR q.difficulty = :difficulty)")
    Page<UserSubmission> findDailyQuestionHistory(
            @Param("userId") Long userId,
            @Param("subjectId") Long subjectId,
            @Param("status") Boolean status,
            @Param("difficulty") Difficulty difficulty,
            Pageable pageable);
    
    @Query("SELECT COUNT(us) FROM UserSubmission us WHERE us.userId = :userId " +
           "AND us.isDailyQuestion = true AND us.isCorrect = true")
    long countCorrectDailyAnswers(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(us) FROM UserSubmission us WHERE us.userId = :userId " +
           "AND us.isDailyQuestion = true")
    long countTotalDailyAnswers(@Param("userId") Long userId);
    
    @Query("SELECT us FROM UserSubmission us JOIN DailyQuestion dq ON us.questionId = dq.questionId " +
           "WHERE us.userId = :userId AND us.isDailyQuestion = true " +
           "AND dq.date = :date AND us.submissionStatus = 'DRAFT'")
    List<UserSubmission> findDraftDailySubmissionsByUserAndDate(
            @Param("userId") Long userId, 
            @Param("date") LocalDate date);
    
    @Query("SELECT us FROM UserSubmission us JOIN DailyQuestion dq ON us.questionId = dq.questionId " +
           "WHERE us.userId = :userId AND us.isDailyQuestion = true " +
           "AND dq.date = :date AND us.submissionStatus = 'FINALIZED'")
    List<UserSubmission> findFinalizedDailySubmissionsByUserAndDate(
            @Param("userId") Long userId, 
            @Param("date") LocalDate date);
    
    List<UserSubmission> findByUserIdAndExamId(Long userId, Long examId);
    
    List<UserSubmission> findByUserIdAndContestId(Long userId, Long contestId);
    
    @Query("SELECT us FROM UserSubmission us WHERE us.userId = :userId " +
           "AND us.submittedAt BETWEEN :startDate AND :endDate " +
           "AND us.isDailyQuestion = true ORDER BY us.submittedAt")
    List<UserSubmission> findDailySubmissionsBetween(
            @Param("userId") Long userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
    
    // Contest-related methods
    @Query("SELECT new map(u.userId as userId, COUNT(u.id) as totalSubmissions, SUM(u.pointsEarned) as totalPoints, " +
           "cp.completedAt as completedAt, cp.hasCompleted as hasCompleted) " +
           "FROM UserSubmission u " +
           "INNER JOIN ContestParticipation cp ON u.userId = cp.userId AND u.contestId = cp.contestId " +
           "WHERE u.contestId = :contestId AND cp.hasCompleted = true " +
           "GROUP BY u.userId, cp.completedAt, cp.hasCompleted " +
           "ORDER BY SUM(u.pointsEarned) DESC, cp.completedAt ASC")
    List<Map<String, Object>> getContestLeaderboard(@Param("contestId") Long contestId, Pageable pageable);
    
    boolean existsByUserIdAndQuestionIdAndContestId(Long userId, Long questionId, Long contestId);
    
    UserSubmission findByUserIdAndQuestionIdAndContestId(Long userId, Long questionId, Long contestId);
    
    List<UserSubmission> findByUserIdAndContestIdOrderBySubmittedAtDesc(Long userId, Long contestId);
    
    List<UserSubmission> findByContestIdAndSubmissionStatus(Long contestId, ExamSubmissionStatus submissionStatus);
    
    Page<UserSubmission> findByUserIdAndContestIdIsNotNull(Long userId, Pageable pageable);
    
    @Query("SELECT us FROM UserSubmission us JOIN Contest c ON us.contestId = c.id " +
           "WHERE us.userId = :userId AND us.contestId IS NOT NULL AND c.status = :contestStatus")
    Page<UserSubmission> findByUserIdAndContestIdIsNotNullAndContestStatus(
            @Param("userId") Long userId, 
            @Param("contestStatus") ContestStatus contestStatus, 
            Pageable pageable);
    
    // Combined analytics queries for all submissions (daily, exam, contest)
    @Query("SELECT COUNT(us) FROM UserSubmission us WHERE us.userId = :userId " +
           "AND us.submittedAt >= :startDate " +
           "AND (:subjectId IS NULL OR us.question.subjectId = :subjectId)")
    long countTotalSubmissionsByUserAndPeriod(@Param("userId") Long userId,
                                              @Param("subjectId") Long subjectId,
                                              @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(us) FROM UserSubmission us WHERE us.userId = :userId " +
           "AND us.isCorrect = true AND us.submittedAt >= :startDate " +
           "AND (:subjectId IS NULL OR us.question.subjectId = :subjectId)")
    long countCorrectSubmissionsByUserAndPeriod(@Param("userId") Long userId,
                                                @Param("subjectId") Long subjectId,
                                                @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT AVG(us.timeTaken) FROM UserSubmission us WHERE us.userId = :userId " +
           "AND us.submittedAt >= :startDate " +
           "AND (:subjectId IS NULL OR us.question.subjectId = :subjectId)")
    Double getAverageTimeByUserAndPeriod(@Param("userId") Long userId,
                                         @Param("subjectId") Long subjectId,
                                         @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT SUM(us.pointsEarned) FROM UserSubmission us WHERE us.userId = :userId " +
           "AND us.submittedAt >= :startDate " +
           "AND (:subjectId IS NULL OR us.question.subjectId = :subjectId)")
    Long getTotalPointsByUserAndPeriod(@Param("userId") Long userId,
                                       @Param("subjectId") Long subjectId,
                                       @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT us.question.difficulty, COUNT(us), " +
           "COALESCE(SUM(CASE WHEN us.isCorrect = true THEN 1 ELSE 0 END), 0) " +
           "FROM UserSubmission us " +
           "WHERE us.userId = :userId AND us.submittedAt >= :startDate " +
           "AND (:subjectId IS NULL OR us.question.subjectId = :subjectId) " +
           "GROUP BY us.question.difficulty")
    List<Object[]> getAccuracyByDifficultyAndPeriod(@Param("userId") Long userId,
                                                    @Param("subjectId") Long subjectId,
                                                    @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT us.question.subjectId, s.name, COUNT(us), " +
           "COALESCE(SUM(CASE WHEN us.isCorrect = true THEN 1 ELSE 0 END), 0) " +
           "FROM UserSubmission us JOIN Subject s ON us.question.subjectId = s.id " +
           "WHERE us.userId = :userId AND us.submittedAt >= :startDate " +
           "GROUP BY us.question.subjectId, s.name")
    List<Object[]> getAccuracyBySubjectAndPeriod(@Param("userId") Long userId,
                                                 @Param("startDate") LocalDateTime startDate);
    
    // Global rankings for all submissions
    @Query("SELECT us.userId, SUM(us.pointsEarned) as totalPoints " +
           "FROM UserSubmission us " +
           "WHERE us.submittedAt >= :startDate " +
           "GROUP BY us.userId ORDER BY totalPoints DESC")
    List<Object[]> getGlobalRankingsAllSubmissions(@Param("startDate") LocalDateTime startDate);
    
    // Question Analytics Methods
    long countByQuestionId(Long questionId);
    
    long countByQuestionIdAndIsCorrect(Long questionId, Boolean isCorrect);
    
    @Query("SELECT COUNT(DISTINCT us.userId) FROM UserSubmission us WHERE us.questionId = :questionId")
    Long countDistinctUsersByQuestionId(@Param("questionId") Long questionId);
    
    @Query("SELECT AVG(us.timeTaken) FROM UserSubmission us WHERE us.questionId = :questionId")
    Double getAverageTimeByQuestionId(@Param("questionId") Long questionId);
    
    @Query("SELECT SUM(us.pointsEarned) FROM UserSubmission us WHERE us.questionId = :questionId")
    Long getTotalPointsByQuestionId(@Param("questionId") Long questionId);
    
    long countByQuestionIdAndIsDailyQuestion(Long questionId, Boolean isDailyQuestion);
    
    @Query("SELECT COUNT(us) FROM UserSubmission us WHERE us.questionId = :questionId AND us.isDailyQuestion = :isDailyQuestion AND us.contestId IS NULL")
    long countByQuestionIdAndIsDailyQuestionAndContestIdIsNull(@Param("questionId") Long questionId, @Param("isDailyQuestion") Boolean isDailyQuestion);
    
    @Query("SELECT COUNT(us) FROM UserSubmission us WHERE us.questionId = :questionId AND us.contestId IS NOT NULL")
    long countByQuestionIdAndContestIdIsNotNull(@Param("questionId") Long questionId);
    
    List<UserSubmission> findTop10ByQuestionIdOrderBySubmittedAtDesc(Long questionId);
    
    // Admin analytics queries - real data only
    @Query("SELECT COUNT(DISTINCT us.userId) FROM UserSubmission us")
    long countDistinctUsers();
    
    @Query("SELECT COUNT(DISTINCT us.userId) FROM UserSubmission us WHERE us.submittedAt >= :startDate")
    long countActiveUsersInPeriod(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(DISTINCT us.userId) FROM UserSubmission us " +
           "WHERE us.userId IN (SELECT MIN(us2.userId) FROM UserSubmission us2 " +
           "WHERE us2.submittedAt >= :startDate GROUP BY us2.userId)")
    long countNewUsersInPeriod(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT AVG(us.pointsEarned) FROM UserSubmission us WHERE us.isCorrect = true")
    Double getAverageScore();
    
    @Query("SELECT COUNT(us) FROM UserSubmission us")
    long getTotalSubmissions();
    
    @Query("SELECT COUNT(us) FROM UserSubmission us WHERE us.submittedAt >= :startDate")
    long getSubmissionsInPeriod(@Param("startDate") LocalDateTime startDate);
}