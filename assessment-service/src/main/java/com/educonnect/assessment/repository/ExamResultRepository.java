package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.ExamResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamResultRepository extends JpaRepository<ExamResult, Long> {
    
    Optional<ExamResult> findBySessionId(String sessionId);
    
    Optional<ExamResult> findByUserIdAndExamId(Long userId, Long examId);
    
    List<ExamResult> findByExamId(Long examId);
    
    Page<ExamResult> findByExamIdOrderByScoreDesc(Long examId, Pageable pageable);
    
    Page<ExamResult> findByUserIdOrderBySubmittedAtDesc(Long userId, Pageable pageable);
    
    @Query("SELECT er FROM ExamResult er WHERE er.examId = :examId ORDER BY er.score DESC, er.timeTaken ASC")
    List<ExamResult> findExamResultsOrderedByRank(@Param("examId") Long examId);
    
    @Query("SELECT AVG(er.score) FROM ExamResult er WHERE er.examId = :examId")
    Double getAverageScoreByExamId(@Param("examId") Long examId);
    
    @Query("SELECT MAX(er.score) FROM ExamResult er WHERE er.examId = :examId")
    Integer getMaxScoreByExamId(@Param("examId") Long examId);
    
    @Query("SELECT MIN(er.score) FROM ExamResult er WHERE er.examId = :examId")
    Integer getMinScoreByExamId(@Param("examId") Long examId);
    
    @Query("SELECT COUNT(er) FROM ExamResult er WHERE er.examId = :examId AND er.passed = true")
    long countPassedResultsByExamId(@Param("examId") Long examId);
    
    long countByExamId(Long examId);
    
    boolean existsByUserIdAndExamId(Long userId, Long examId);
    
    @Query("SELECT er.rank FROM ExamResult er WHERE er.userId = :userId AND er.examId = :examId")
    Optional<Integer> findUserRankInExam(@Param("userId") Long userId, @Param("examId") Long examId);
}