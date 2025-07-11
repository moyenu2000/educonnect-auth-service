package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.ExamAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamAnswerRepository extends JpaRepository<ExamAnswer, Long> {
    
    Optional<ExamAnswer> findBySessionIdAndQuestionId(String sessionId, Long questionId);
    
    List<ExamAnswer> findBySessionId(String sessionId);
    
    List<ExamAnswer> findBySessionIdOrderByQuestionId(String sessionId);
    
    @Query("SELECT ea FROM ExamAnswer ea WHERE ea.sessionId = :sessionId AND ea.isFinal = true")
    List<ExamAnswer> findFinalAnswersBySessionId(@Param("sessionId") String sessionId);
    
    @Query("SELECT COUNT(ea) FROM ExamAnswer ea WHERE ea.sessionId = :sessionId")
    long countAnswersBySessionId(@Param("sessionId") String sessionId);
    
    @Query("SELECT COUNT(ea) FROM ExamAnswer ea WHERE ea.sessionId = :sessionId AND ea.isCorrect = true")
    long countCorrectAnswersBySessionId(@Param("sessionId") String sessionId);
    
    @Query("SELECT SUM(ea.timeTaken) FROM ExamAnswer ea WHERE ea.sessionId = :sessionId")
    Integer sumTimeTakenBySessionId(@Param("sessionId") String sessionId);
    
    boolean existsBySessionIdAndQuestionId(String sessionId, Long questionId);
    
    @Query("SELECT ea FROM ExamAnswer ea WHERE ea.session.examId = :examId")
    List<ExamAnswer> findByExamId(@Param("examId") Long examId);
}