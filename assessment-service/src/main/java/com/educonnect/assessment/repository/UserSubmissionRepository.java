package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.UserSubmission;
import com.educonnect.assessment.enums.ContestStatus;
import com.educonnect.assessment.enums.Difficulty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
    @Query("SELECT new map(u.userId as userId, COUNT(u.id) as totalSubmissions, SUM(u.pointsEarned) as totalPoints) " +
           "FROM UserSubmission u WHERE u.contestId = :contestId " +
           "GROUP BY u.userId ORDER BY SUM(u.pointsEarned) DESC")
    List<Map<String, Object>> getContestLeaderboard(@Param("contestId") Long contestId, Pageable pageable);
    
    boolean existsByUserIdAndQuestionIdAndContestId(Long userId, Long questionId, Long contestId);
    
    List<UserSubmission> findByUserIdAndContestIdOrderBySubmittedAtDesc(Long userId, Long contestId);
    
    Page<UserSubmission> findByUserIdAndContestIdIsNotNull(Long userId, Pageable pageable);
    
    @Query("SELECT us FROM UserSubmission us JOIN Contest c ON us.contestId = c.id " +
           "WHERE us.userId = :userId AND us.contestId IS NOT NULL AND c.status = :contestStatus")
    Page<UserSubmission> findByUserIdAndContestIdIsNotNullAndContestStatus(
            @Param("userId") Long userId, 
            @Param("contestStatus") ContestStatus contestStatus, 
            Pageable pageable);
}