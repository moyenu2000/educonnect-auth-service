package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.ProblemSubmission;
import com.educonnect.assessment.enums.ProblemStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface ProblemSubmissionRepository extends JpaRepository<ProblemSubmission, Long> {
    
    Optional<ProblemSubmission> findTopByUserIdAndProblemIdOrderBySubmittedAtDesc(Long userId, Long problemId);
    
    List<ProblemSubmission> findByUserIdAndProblemId(Long userId, Long problemId);
    
    Page<ProblemSubmission> findByUserId(Long userId, Pageable pageable);
    
    Page<ProblemSubmission> findByUserIdAndStatus(Long userId, ProblemStatus status, Pageable pageable);
    
    @Query("SELECT ps FROM ProblemSubmission ps WHERE ps.userId = :userId AND " +
           "ps.problem.subjectId = :subjectId ORDER BY ps.submittedAt DESC")
    Page<ProblemSubmission> findByUserIdAndSubjectId(@Param("userId") Long userId, 
                                                     @Param("subjectId") Long subjectId, 
                                                     Pageable pageable);
    
    @Query("SELECT COUNT(ps) FROM ProblemSubmission ps WHERE ps.userId = :userId AND ps.isCorrect = true")
    long countCorrectSubmissionsByUser(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(ps) FROM ProblemSubmission ps WHERE ps.userId = :userId")
    long countTotalSubmissionsByUser(@Param("userId") Long userId);
    
    @Query("SELECT AVG(ps.timeTaken) FROM ProblemSubmission ps WHERE ps.userId = :userId AND ps.isCorrect = true")
    Double getAverageTimeByUser(@Param("userId") Long userId);
    
    @Query("SELECT ps.problem.subjectId, COUNT(ps) FROM ProblemSubmission ps " +
           "WHERE ps.userId = :userId AND ps.isCorrect = true " +
           "GROUP BY ps.problem.subjectId")
    List<Object[]> getSubjectWiseCorrectCounts(@Param("userId") Long userId);
    
    boolean existsByUserIdAndProblemIdAndIsCorrectTrue(Long userId, Long problemId);
    
    @Query("SELECT COUNT(DISTINCT ps.problemId) FROM ProblemSubmission ps " +
           "WHERE ps.userId = :userId AND ps.isCorrect = true")
    long countUniqueSolvedProblemsByUser(@Param("userId") Long userId);
    
    @Query("SELECT ps FROM ProblemSubmission ps WHERE ps.userId = :userId AND " +
           "ps.submittedAt >= :startDate ORDER BY ps.submittedAt DESC")
    List<ProblemSubmission> findRecentSubmissions(@Param("userId") Long userId, 
                                                  @Param("startDate") LocalDateTime startDate);
    
    // Analytics queries for real data
    @Query(value = "SELECT pp.difficulty, COUNT(ps.id), " +
           "COALESCE(SUM(CASE WHEN ps.is_correct = true THEN 1 ELSE 0 END), 0) " +
           "FROM assessment.problem_submissions ps " +
           "JOIN assessment.practice_problems pp ON ps.problem_id = pp.id " +
           "WHERE ps.user_id = :userId " +
           "AND (:subjectId IS NULL OR pp.subject_id = :subjectId) " +
           "AND ps.submitted_at >= :startDate " +
           "GROUP BY pp.difficulty", nativeQuery = true)
    List<Object[]> getAccuracyByDifficulty(@Param("userId") Long userId, 
                                           @Param("subjectId") Long subjectId,
                                           @Param("startDate") LocalDateTime startDate);
    
    @Query(value = "SELECT pp.subject_id, s.name, COUNT(ps.id), " +
           "COALESCE(SUM(CASE WHEN ps.is_correct = true THEN 1 ELSE 0 END), 0) " +
           "FROM assessment.problem_submissions ps " +
           "JOIN assessment.practice_problems pp ON ps.problem_id = pp.id " +
           "JOIN assessment.subjects s ON pp.subject_id = s.id " +
           "WHERE ps.user_id = :userId AND ps.submitted_at >= :startDate " +
           "GROUP BY pp.subject_id, s.name", nativeQuery = true)
    List<Object[]> getAccuracyBySubject(@Param("userId") Long userId, 
                                        @Param("startDate") LocalDateTime startDate);
    
    @Query(value = "SELECT pp.topic_id, t.name, COUNT(ps.id), " +
           "COALESCE(SUM(CASE WHEN ps.is_correct = true THEN 1 ELSE 0 END), 0) " +
           "FROM assessment.problem_submissions ps " +
           "JOIN assessment.practice_problems pp ON ps.problem_id = pp.id " +
           "JOIN assessment.topics t ON pp.topic_id = t.id " +
           "WHERE ps.user_id = :userId AND ps.submitted_at >= :startDate " +
           "AND (:subjectId IS NULL OR pp.subject_id = :subjectId) " +
           "GROUP BY pp.topic_id, t.name", nativeQuery = true)
    List<Object[]> getAccuracyByTopic(@Param("userId") Long userId, 
                                      @Param("subjectId") Long subjectId,
                                      @Param("startDate") LocalDateTime startDate);
    
    @Query(value = "SELECT AVG(ps.time_taken), pp.difficulty " +
           "FROM assessment.problem_submissions ps " +
           "JOIN assessment.practice_problems pp ON ps.problem_id = pp.id " +
           "WHERE ps.user_id = :userId AND ps.submitted_at >= :startDate " +
           "AND (:subjectId IS NULL OR pp.subject_id = :subjectId) " +
           "GROUP BY pp.difficulty", nativeQuery = true)
    List<Object[]> getAverageTimeByDifficulty(@Param("userId") Long userId, 
                                              @Param("subjectId") Long subjectId,
                                              @Param("startDate") LocalDateTime startDate);
    
    @Query(value = "SELECT DATE(ps.submitted_at), COUNT(ps.id), " +
           "COALESCE(SUM(CASE WHEN ps.is_correct = true THEN 1 ELSE 0 END), 0), " +
           "COALESCE(AVG(ps.time_taken), 0) " +
           "FROM assessment.problem_submissions ps " +
           "JOIN assessment.practice_problems pp ON ps.problem_id = pp.id " +
           "WHERE ps.user_id = :userId AND ps.submitted_at >= :startDate " +
           "AND (:subjectId IS NULL OR pp.subject_id = :subjectId) " +
           "GROUP BY DATE(ps.submitted_at) ORDER BY DATE(ps.submitted_at)", nativeQuery = true)
    List<Object[]> getDailyTrends(@Param("userId") Long userId, 
                                  @Param("subjectId") Long subjectId,
                                  @Param("startDate") LocalDateTime startDate);
    
    @Query(value = "SELECT COALESCE(SUM(ps.points_earned), 0) FROM assessment.problem_submissions ps " +
           "WHERE ps.user_id = :userId AND ps.submitted_at >= :startDate", nativeQuery = true)
    Long getTotalPointsByUser(@Param("userId") Long userId, 
                              @Param("startDate") LocalDateTime startDate);
    
    // Ranking queries
    @Query(value = "SELECT ps.user_id, SUM(ps.points_earned) as totalPoints " +
           "FROM assessment.problem_submissions ps " +
           "WHERE ps.submitted_at >= :startDate " +
           "GROUP BY ps.user_id ORDER BY totalPoints DESC", nativeQuery = true)
    List<Object[]> getGlobalRankings(@Param("startDate") LocalDateTime startDate);
    
    @Query(value = "SELECT ps.user_id, SUM(ps.points_earned) as totalPoints " +
           "FROM assessment.problem_submissions ps " +
           "JOIN assessment.practice_problems pp ON ps.problem_id = pp.id " +
           "WHERE pp.subject_id = :subjectId AND ps.submitted_at >= :startDate " +
           "GROUP BY ps.user_id ORDER BY totalPoints DESC", nativeQuery = true)
    List<Object[]> getSubjectRankings(@Param("subjectId") Long subjectId,
                                      @Param("startDate") LocalDateTime startDate);
    
    // Weak/Strong areas analysis
    @Query(value = "SELECT t.name, " +
           "CAST(COALESCE(SUM(CASE WHEN ps.is_correct = true THEN 1 ELSE 0 END), 0) AS DOUBLE) / " +
           "CAST(COUNT(ps.id) AS DOUBLE) * 100 as accuracy " +
           "FROM assessment.problem_submissions ps " +
           "JOIN assessment.practice_problems pp ON ps.problem_id = pp.id " +
           "JOIN assessment.topics t ON pp.topic_id = t.id " +
           "WHERE ps.user_id = :userId AND ps.submitted_at >= :startDate " +
           "AND (:subjectId IS NULL OR pp.subject_id = :subjectId) " +
           "GROUP BY t.name HAVING COUNT(ps.id) >= 3 " +
           "ORDER BY accuracy ASC", nativeQuery = true)
    List<Object[]> getWeakTopics(@Param("userId") Long userId, 
                                 @Param("subjectId") Long subjectId,
                                 @Param("startDate") LocalDateTime startDate);
    
    @Query(value = "SELECT t.name, " +
           "CAST(COALESCE(SUM(CASE WHEN ps.is_correct = true THEN 1 ELSE 0 END), 0) AS DOUBLE) / " +
           "CAST(COUNT(ps.id) AS DOUBLE) * 100 as accuracy " +
           "FROM assessment.problem_submissions ps " +
           "JOIN assessment.practice_problems pp ON ps.problem_id = pp.id " +
           "JOIN assessment.topics t ON pp.topic_id = t.id " +
           "WHERE ps.user_id = :userId AND ps.submitted_at >= :startDate " +
           "AND (:subjectId IS NULL OR pp.subject_id = :subjectId) " +
           "GROUP BY t.name HAVING COUNT(ps.id) >= 3 " +
           "ORDER BY accuracy DESC", nativeQuery = true)
    List<Object[]> getStrongTopics(@Param("userId") Long userId, 
                                   @Param("subjectId") Long subjectId,
                                   @Param("startDate") LocalDateTime startDate);
    
    // Admin analytics queries - real data only
    @Query("SELECT COUNT(DISTINCT ps.userId) FROM ProblemSubmission ps")
    long countDistinctUsers();
    
    @Query("SELECT COUNT(DISTINCT ps.userId) FROM ProblemSubmission ps WHERE ps.submittedAt >= :startDate")
    long countActiveUsersInPeriod(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(ps) FROM ProblemSubmission ps")
    long countTotalSubmissions();
    
    @Query("SELECT COUNT(ps) FROM ProblemSubmission ps WHERE ps.isCorrect = true")
    long countCorrectSubmissions();
    
    @Query("SELECT COUNT(ps) FROM ProblemSubmission ps WHERE ps.submittedAt >= :startDate")
    long getSubmissionsInPeriod(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT AVG(ps.timeTaken) FROM ProblemSubmission ps")
    Double getAverageTime();
    
    @Query("SELECT p.difficulty, COUNT(ps) FROM ProblemSubmission ps " +
           "JOIN ps.problem p GROUP BY p.difficulty")
    List<Object[]> getDifficultyDistributionRaw();
    
    default Map<String, Long> getDifficultyDistribution() {
        List<Object[]> raw = getDifficultyDistributionRaw();
        Map<String, Long> result = new HashMap<>();
        for (Object[] row : raw) {
            result.put(row[0].toString(), (Long) row[1]);
        }
        return result;
    }
}