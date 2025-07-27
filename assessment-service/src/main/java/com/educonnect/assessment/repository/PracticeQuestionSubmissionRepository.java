package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.PracticeQuestionSubmission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PracticeQuestionSubmissionRepository extends JpaRepository<PracticeQuestionSubmission, Long> {

    // Find all submissions for a user for a specific question
    List<PracticeQuestionSubmission> findByUserIdAndQuestionIdOrderBySubmittedAtDesc(Long userId, Long questionId);

    // Find all submissions for a user (paginated)
    Page<PracticeQuestionSubmission> findByUserIdOrderBySubmittedAtDesc(Long userId, Pageable pageable);

    // Find latest submission for a user for a specific question
    Optional<PracticeQuestionSubmission> findTopByUserIdAndQuestionIdOrderBySubmittedAtDesc(Long userId, Long questionId);

    // Check if user has solved a question correctly (has at least one correct submission)
    @Query("SELECT COUNT(pqs) > 0 FROM PracticeQuestionSubmission pqs WHERE pqs.userId = :userId AND pqs.questionId = :questionId AND pqs.isCorrect = true")
    boolean hasUserSolvedQuestion(@Param("userId") Long userId, @Param("questionId") Long questionId);

    // Get user's best score for a question
    @Query("SELECT MAX(pqs.pointsEarned) FROM PracticeQuestionSubmission pqs WHERE pqs.userId = :userId AND pqs.questionId = :questionId")
    Optional<Integer> getUserBestScoreForQuestion(@Param("userId") Long userId, @Param("questionId") Long questionId);

    // Count total submissions for a user
    long countByUserId(Long userId);

    // Count correct submissions for a user
    long countByUserIdAndIsCorrect(Long userId, Boolean isCorrect);

    // Find submissions by user and date range
    @Query("SELECT pqs FROM PracticeQuestionSubmission pqs WHERE pqs.userId = :userId AND pqs.submittedAt BETWEEN :startDate AND :endDate ORDER BY pqs.submittedAt DESC")
    Page<PracticeQuestionSubmission> findByUserIdAndSubmittedAtBetween(
            @Param("userId") Long userId, 
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    // Get submission statistics for a user
    @Query("SELECT " +
           "COUNT(pqs) as totalSubmissions, " +
           "COUNT(CASE WHEN pqs.isCorrect = true THEN 1 END) as correctSubmissions, " +
           "SUM(pqs.pointsEarned) as totalPoints, " +
           "COUNT(DISTINCT pqs.questionId) as uniqueQuestions, " +
           "COUNT(DISTINCT CASE WHEN pqs.isCorrect = true THEN pqs.questionId END) as solvedQuestions " +
           "FROM PracticeQuestionSubmission pqs WHERE pqs.userId = :userId")
    Object[] getUserSubmissionStats(@Param("userId") Long userId);

    // Get recent submissions for a user
    List<PracticeQuestionSubmission> findTop10ByUserIdOrderBySubmittedAtDesc(Long userId);

    // Check if user has attempted a question
    boolean existsByUserIdAndQuestionId(Long userId, Long questionId);

    // Get total submissions for a question across all users
    long countByQuestionId(Long questionId);

    // Get correct submissions count for a question
    long countByQuestionIdAndIsCorrect(Long questionId, Boolean isCorrect);
}