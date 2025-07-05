package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.DailyQuestion;
import com.educonnect.assessment.enums.ClassLevel;
import com.educonnect.assessment.enums.Difficulty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyQuestionRepository extends JpaRepository<DailyQuestion, Long> {
    
    List<DailyQuestion> findByDate(LocalDate date);
    
    List<DailyQuestion> findByDateAndSubjectId(LocalDate date, Long subjectId);
    
    @Query("SELECT dq FROM DailyQuestion dq JOIN dq.question q JOIN q.subject s WHERE dq.date = :date " +
           "AND (:subjectId IS NULL OR dq.subjectId = :subjectId) " +
           "AND (:classLevel IS NULL OR s.classLevel = :classLevel) " +
           "AND (:difficulty IS NULL OR dq.difficulty = :difficulty)")
    List<DailyQuestion> findFilteredDailyQuestions(
            @Param("date") LocalDate date,
            @Param("subjectId") Long subjectId,
            @Param("classLevel") ClassLevel classLevel,
            @Param("difficulty") Difficulty difficulty);
    
    Optional<DailyQuestion> findByDateAndQuestionId(LocalDate date, Long questionId);
    
    List<DailyQuestion> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    boolean existsByDateAndQuestionId(LocalDate date, Long questionId);
    
    @Query("SELECT COUNT(dq) FROM DailyQuestion dq WHERE dq.date = :date")
    long countByDate(@Param("date") LocalDate date);
}