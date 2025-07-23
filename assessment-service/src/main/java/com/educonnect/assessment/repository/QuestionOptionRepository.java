package com.educonnect.assessment.repository;

import com.educonnect.assessment.entity.QuestionOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionOptionRepository extends JpaRepository<QuestionOption, Long> {
    
    @Modifying
    @Query("DELETE FROM QuestionOption qo WHERE qo.questionId = :questionId")
    void deleteByQuestionId(@Param("questionId") Long questionId);
}