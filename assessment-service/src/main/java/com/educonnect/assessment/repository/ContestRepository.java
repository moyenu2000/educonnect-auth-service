package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.Contest;
import com.educonnect.assessment.enums.ContestStatus;
import com.educonnect.assessment.enums.ContestType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContestRepository extends JpaRepository<Contest, Long> {
    
    // Find contests with filters
    Page<Contest> findByStatusAndType(ContestStatus status, ContestType type, Pageable pageable);
    Page<Contest> findByStatus(ContestStatus status, Pageable pageable);
    Page<Contest> findByType(ContestType type, Pageable pageable);
    
    // Find public contests (upcoming and active)
    @Query("SELECT c FROM Contest c WHERE c.status IN ('UPCOMING', 'ACTIVE') ORDER BY c.startTime ASC")
    List<Contest> findPublicContests();
    
    // Find active contests
    List<Contest> findByStatus(ContestStatus status);
    
    // Find contests by time range
    @Query("SELECT c FROM Contest c WHERE c.startTime <= :now AND c.endTime >= :now")
    List<Contest> findActiveContestsByTime(@Param("now") LocalDateTime now);
    
    @Query("SELECT c FROM Contest c WHERE c.endTime <= :now AND c.status = 'ACTIVE'")
    List<Contest> findExpiredActiveContests(@Param("now") LocalDateTime now);
    
    @Query("SELECT c FROM Contest c WHERE c.startTime <= :now AND c.status = 'UPCOMING'")
    List<Contest> findContestsToStart(@Param("now") LocalDateTime now);
    
    // Check if a question is part of any active or upcoming contest
    @Query("SELECT COUNT(c) > 0 FROM Contest c WHERE :questionId MEMBER OF c.problemIds " +
           "AND c.status IN ('ACTIVE', 'UPCOMING')")
    boolean existsActiveContestByQuestionId(@Param("questionId") Long questionId);
    
    // Scheduler support methods
    List<Contest> findByStatusAndStartTimeBefore(ContestStatus status, LocalDateTime dateTime);
    
    List<Contest> findByStatusAndEndTimeBefore(ContestStatus status, LocalDateTime dateTime);
}