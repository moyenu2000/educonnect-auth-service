package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.LiveExam;
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

@Repository
public interface LiveExamRepository extends JpaRepository<LiveExam, Long> {

    Page<LiveExam> findByStatus(ExamStatus status, Pageable pageable);

    @Query("SELECT le FROM LiveExam le WHERE le.scheduledAt > :now AND le.status = 'SCHEDULED' ORDER BY le.scheduledAt ASC")
    Page<LiveExam> findUpcomingExams(@Param("now") LocalDateTime now, Pageable pageable);

    @Query("SELECT le FROM LiveExam le WHERE le.scheduledAt <= :now AND le.status = 'LIVE' ORDER BY le.scheduledAt DESC")
    Page<LiveExam> findLiveExams(@Param("now") LocalDateTime now, Pageable pageable);

    Page<LiveExam> findByClassLevel(ClassLevel classLevel, Pageable pageable);

    Page<LiveExam> findBySubjectId(Long subjectId, Pageable pageable);

    @Query("SELECT le FROM LiveExam le WHERE le.classLevel = :classLevel AND le.status = :status ORDER BY le.scheduledAt ASC")
    Page<LiveExam> findByClassLevelAndStatus(@Param("classLevel") ClassLevel classLevel, 
                                             @Param("status") ExamStatus status, Pageable pageable);

    @Query("SELECT le FROM LiveExam le WHERE le.subjectId = :subjectId AND le.status = :status ORDER BY le.scheduledAt ASC")
    Page<LiveExam> findBySubjectIdAndStatus(@Param("subjectId") Long subjectId, 
                                            @Param("status") ExamStatus status, Pageable pageable);

    @Query("SELECT COUNT(le) FROM LiveExam le WHERE le.scheduledAt BETWEEN :startDate AND :endDate")
    long countByScheduledAtBetween(@Param("startDate") LocalDateTime startDate, 
                                   @Param("endDate") LocalDateTime endDate);
    
    // Admin analytics queries - real data only
    @Query("SELECT COUNT(le) FROM LiveExam le")
    long countTotalExams();
    
    @Query("SELECT COUNT(le) FROM LiveExam le WHERE le.status = 'LIVE'")
    long countActiveExams();
    
    @Query("SELECT COUNT(le) FROM LiveExam le WHERE le.status = 'COMPLETED'")
    long countCompletedExams();
}