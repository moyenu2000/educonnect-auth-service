package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.ProblemBookmark;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProblemBookmarkRepository extends JpaRepository<ProblemBookmark, Long> {
    
    Optional<ProblemBookmark> findByUserIdAndProblemId(Long userId, Long problemId);
    
    Page<ProblemBookmark> findByUserId(Long userId, Pageable pageable);
    
    @Query("SELECT pb FROM ProblemBookmark pb WHERE pb.userId = :userId AND " +
           "pb.problem.subjectId = :subjectId ORDER BY pb.bookmarkedAt DESC")
    Page<ProblemBookmark> findByUserIdAndSubjectId(@Param("userId") Long userId, 
                                                   @Param("subjectId") Long subjectId, 
                                                   Pageable pageable);
    
    boolean existsByUserIdAndProblemId(Long userId, Long problemId);
    
    void deleteByUserIdAndProblemId(Long userId, Long problemId);
    
    long countByUserId(Long userId);
    
    @Query("SELECT pb.problemId FROM ProblemBookmark pb WHERE pb.userId = :userId")
    List<Long> findBookmarkedProblemIdsByUserId(@Param("userId") Long userId);
}