package com.educonnect.assessment.service;

import com.educonnect.assessment.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LiveExamSessionService {
    
    ApiResponse<Boolean> registerForExam(Long examId, Long userId);
    
    ExamSessionResponse startExam(Long examId, Long userId, String ipAddress, String userAgent);
    
    ApiResponse<Boolean> submitAnswer(ExamAnswerRequest request, Long userId);
    
    ExamResultResponse finishExam(ExamFinishRequest request, Long userId);
    
    ExamResultResponse getExamResults(Long examId, Long userId);
    
    Page<LeaderboardEntry> getExamLeaderboard(Long examId, Pageable pageable, Long userId);
    
    boolean isUserRegistered(Long examId, Long userId);
    
    boolean hasUserCompletedExam(Long examId, Long userId);
    
    void updateExamRankings(Long examId);
    
    void expireInactiveSessions();
    
    void validateExamSession(String sessionId, Long userId);
}