package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.Subject;
import com.educonnect.assessment.enums.ClassLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    
    Page<Subject> findByIsActiveTrue(Pageable pageable);
    
    Page<Subject> findByIsActiveTrueAndClassLevel(ClassLevel classLevel, Pageable pageable);
    
    Page<Subject> findByClassLevel(ClassLevel classLevel, Pageable pageable);
    
    List<Subject> findByIsActiveTrueOrderByDisplayOrder();
    
    List<Subject> findByClassLevelAndIsActiveTrueOrderByDisplayOrder(ClassLevel classLevel);
    
    Optional<Subject> findByIdAndIsActiveTrue(Long id);
    
    @Query("SELECT s FROM Subject s WHERE s.isActive = true AND " +
           "(:classLevel IS NULL OR s.classLevel = :classLevel) " +
           "ORDER BY s.displayOrder")
    Page<Subject> findFilteredSubjects(@Param("classLevel") ClassLevel classLevel, Pageable pageable);
    
    boolean existsByNameAndClassLevel(String name, ClassLevel classLevel);
    
    boolean existsByNameAndClassLevelAndIdNot(String name, ClassLevel classLevel, Long id);
}