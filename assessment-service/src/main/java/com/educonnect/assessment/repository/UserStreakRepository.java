package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.UserStreak;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserStreakRepository extends JpaRepository<UserStreak, Long> {
    
    Optional<UserStreak> findByUserIdAndSubjectId(Long userId, Long subjectId);
    
    List<UserStreak> findByUserIdAndIsActiveTrue(Long userId);
    
    List<UserStreak> findByUserIdOrderByCurrentStreakDesc(Long userId);
    
    @Query("SELECT us FROM UserStreak us WHERE us.userId = :userId " +
           "AND (:subjectId IS NULL OR us.subjectId = :subjectId) " +
           "AND us.isActive = true")
    List<UserStreak> findUserStreaks(@Param("userId") Long userId, @Param("subjectId") Long subjectId);
    
    @Query("SELECT us FROM UserStreak us WHERE us.userId = :userId " +
           "ORDER BY us.longestStreak DESC LIMIT 1")
    Optional<UserStreak> findLongestStreakByUser(@Param("userId") Long userId);
    
    @Query("SELECT SUM(us.currentStreak) FROM UserStreak us WHERE us.userId = :userId AND us.isActive = true")
    Integer getTotalActiveStreak(@Param("userId") Long userId);
}