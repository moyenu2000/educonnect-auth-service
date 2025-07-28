package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.ContestParticipation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContestParticipationRepository extends JpaRepository<ContestParticipation, Long> {
    
    Optional<ContestParticipation> findByUserIdAndContestId(Long userId, Long contestId);
    
    List<ContestParticipation> findByContestIdOrderByCompletedAtAsc(Long contestId);
    
    List<ContestParticipation> findByContestIdAndHasCompletedTrueOrderByCompletedAtAsc(Long contestId);
    
    @Query("SELECT COUNT(cp) FROM ContestParticipation cp WHERE cp.contestId = :contestId")
    Long countParticipantsByContestId(@Param("contestId") Long contestId);
    
    @Query("SELECT COUNT(cp) FROM ContestParticipation cp WHERE cp.contestId = :contestId AND cp.hasCompleted = true")
    Long countCompletedParticipantsByContestId(@Param("contestId") Long contestId);
}