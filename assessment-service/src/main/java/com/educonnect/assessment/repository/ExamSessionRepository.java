package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.ExamSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExamSessionRepository extends JpaRepository<ExamSession, Long> {
    
    Optional<ExamSession> findBySessionId(String sessionId);
    
    Optional<ExamSession> findByUserIdAndExamIdAndIsActiveTrue(Long userId, Long examId);
    
    List<ExamSession> findByUserIdAndExamId(Long userId, Long examId);
    
    List<ExamSession> findByExamId(Long examId);
    
    List<ExamSession> findByExamIdAndIsActiveTrue(Long examId);
    
    @Query("SELECT es FROM ExamSession es WHERE es.examId = :examId AND es.isCompleted = true")
    List<ExamSession> findCompletedSessionsByExamId(@Param("examId") Long examId);
    
    @Query("SELECT es FROM ExamSession es WHERE es.expiresAt < :now AND es.isActive = true")
    List<ExamSession> findExpiredActiveSessions(@Param("now") LocalDateTime now);
    
    @Query("SELECT COUNT(es) FROM ExamSession es WHERE es.examId = :examId AND es.isCompleted = true")
    long countCompletedSessionsByExamId(@Param("examId") Long examId);
    
    boolean existsByUserIdAndExamIdAndIsCompletedTrue(Long userId, Long examId);
    
    @Query("SELECT es FROM ExamSession es WHERE es.userId = :userId AND es.isActive = true")
    List<ExamSession> findActiveSessionsByUserId(@Param("userId") Long userId);
}