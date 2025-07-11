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
import java.util.List;
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
}