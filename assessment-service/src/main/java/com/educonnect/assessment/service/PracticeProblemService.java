package com.educonnect.assessment.service;

import com.educonnect.assessment.dto.*;
import com.educonnect.assessment.enums.Difficulty;
import com.educonnect.assessment.enums.ProblemStatus;
import com.educonnect.assessment.enums.QuestionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PracticeProblemService {
    
    Page<PracticeProblemDto> getProblems(Long subjectId, Long topicId, Difficulty difficulty, 
                                        QuestionType type, ProblemStatus status, String search, 
                                        Long userId, Pageable pageable);
    
    PracticeProblemDto getProblemById(Long problemId, Long userId);
    
    ProblemSubmissionResponse submitSolution(Long problemId, ProblemSubmissionRequest request, Long userId);
    
    HintResponse getHint(Long problemId, Integer hintLevel, Long userId);
    
    ApiResponse<Boolean> toggleBookmark(Long problemId, Long userId);
    
    Page<PracticeProblemDto> getRecommendations(Integer count, Long subjectId, Difficulty difficulty, Long userId, Pageable pageable);
    
    PracticeProblemDto convertToDto(com.educonnect.assessment.entity.PracticeProblem problem, Long userId);
    
    void createProblemFromQuestion(Long questionId);
    
    void updateProblemDifficulty(Long problemId, Difficulty difficulty);
}