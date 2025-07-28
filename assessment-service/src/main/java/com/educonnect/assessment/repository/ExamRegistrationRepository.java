package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.ExamRegistration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamRegistrationRepository extends JpaRepository<ExamRegistration, Long> {
    
    Optional<ExamRegistration> findByUserIdAndExamId(Long userId, Long examId);
    
    boolean existsByUserIdAndExamId(Long userId, Long examId);
    
    List<ExamRegistration> findByExamId(Long examId);
    
    Page<ExamRegistration> findByUserId(Long userId, Pageable pageable);
    
    long countByExamId(Long examId);
    
    @Query("SELECT er FROM ExamRegistration er WHERE er.examId = :examId AND er.attended = true")
    List<ExamRegistration> findAttendedRegistrationsByExamId(@Param("examId") Long examId);
    
    @Query("SELECT COUNT(er) FROM ExamRegistration er WHERE er.examId = :examId AND er.attended = true")
    long countAttendedByExamId(@Param("examId") Long examId);
    
    @Query("SELECT er FROM ExamRegistration er WHERE er.userId = :userId AND er.exam.status = 'ACTIVE'")
    List<ExamRegistration> findActiveExamRegistrations(@Param("userId") Long userId);
}