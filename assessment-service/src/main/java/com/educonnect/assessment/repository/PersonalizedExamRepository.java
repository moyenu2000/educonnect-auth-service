package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.PersonalizedExam;
import com.educonnect.assessment.enums.ClassLevel;
import com.educonnect.assessment.enums.ExamStatus;
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
public interface PersonalizedExamRepository extends JpaRepository<PersonalizedExam, Long> {

    Page<PersonalizedExam> findByUserId(Long userId, Pageable pageable);

    Page<PersonalizedExam> findByUserIdAndStatus(Long userId, ExamStatus status, Pageable pageable);

    Page<PersonalizedExam> findByUserIdAndSubjectId(Long userId, Long subjectId, Pageable pageable);

    Page<PersonalizedExam> findByUserIdAndClassLevel(Long userId, ClassLevel classLevel, Pageable pageable);

    @Query("SELECT pe FROM PersonalizedExam pe WHERE pe.userId = :userId AND pe.status = :status ORDER BY pe.createdAt DESC")
    Page<PersonalizedExam> findByUserIdAndStatusOrderByCreatedAtDesc(@Param("userId") Long userId, 
                                                                     @Param("status") ExamStatus status, 
                                                                     Pageable pageable);

    @Query("SELECT pe FROM PersonalizedExam pe WHERE pe.userId = :userId AND pe.status = 'COMPLETED' ORDER BY pe.completedAt DESC")
    Page<PersonalizedExam> findCompletedExamsByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT pe FROM PersonalizedExam pe WHERE pe.userId = :userId AND pe.status = 'IN_PROGRESS' ORDER BY pe.startedAt DESC")
    Optional<PersonalizedExam> findInProgressExamByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(pe) FROM PersonalizedExam pe WHERE pe.userId = :userId AND pe.status = 'COMPLETED'")
    long countCompletedExamsByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(pe) FROM PersonalizedExam pe WHERE pe.userId = :userId AND pe.status = 'COMPLETED' AND pe.score >= pe.passingScore")
    long countPassedExamsByUserId(@Param("userId") Long userId);

    @Query("SELECT AVG(pe.score) FROM PersonalizedExam pe WHERE pe.userId = :userId AND pe.status = 'COMPLETED'")
    Double getAverageScoreByUserId(@Param("userId") Long userId);

    @Query("SELECT pe FROM PersonalizedExam pe WHERE pe.userId = :userId AND pe.subjectId = :subjectId AND pe.status = 'COMPLETED' ORDER BY pe.score DESC")
    Page<PersonalizedExam> findBestScoresByUserIdAndSubjectId(@Param("userId") Long userId, 
                                                              @Param("subjectId") Long subjectId, 
                                                              Pageable pageable);

    @Query("SELECT pe FROM PersonalizedExam pe WHERE pe.userId = :userId AND pe.createdAt BETWEEN :startDate AND :endDate ORDER BY pe.createdAt DESC")
    Page<PersonalizedExam> findByUserIdAndCreatedAtBetween(@Param("userId") Long userId, 
                                                           @Param("startDate") LocalDateTime startDate, 
                                                           @Param("endDate") LocalDateTime endDate, 
                                                           Pageable pageable);
}