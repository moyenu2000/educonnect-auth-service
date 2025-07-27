package com.educonnect.assessment.service;

import com.educonnect.assessment.dto.*;
import com.educonnect.assessment.entity.PracticeQuestionSubmission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface PracticeQuestionSubmissionService {
    
    // Submission methods
    PracticeQuestionSubmissionResponse submitAnswer(Long userId, Long questionId, 
                                                  PracticeQuestionSubmissionRequest request, 
                                                  String ipAddress);
    
    // Get submissions for a user and question
    List<PracticeQuestionSubmissionResponse> getUserSubmissionsForQuestion(Long userId, Long questionId);
    
    // Get all submissions for a user (paginated)
    Page<PracticeQuestionSubmissionResponse> getUserSubmissions(Long userId, Pageable pageable);
    
    // Get submission history with date range
    Page<PracticeQuestionSubmissionResponse> getUserSubmissionHistory(Long userId, 
                                                                    LocalDateTime startDate, 
                                                                    LocalDateTime endDate, 
                                                                    Pageable pageable);
    
    // Get user statistics
    PracticeQuestionStatsResponse getUserStats(Long userId);
    
    // Get recent submissions
    List<PracticeQuestionSubmissionResponse> getRecentSubmissions(Long userId);
    
    // Check submission status
    String getSubmissionStatus(Long userId, Long questionId);
    
    // Check if user has solved question
    boolean hasUserSolved(Long userId, Long questionId);
    
    // Get user's best score for a question
    Integer getUserBestScore(Long userId, Long questionId);
    
    // Get total attempts for a question by user
    int getUserTotalAttempts(Long userId, Long questionId);
    
    // Get latest submission for a question by user
    PracticeQuestionSubmissionResponse getLatestSubmission(Long userId, Long questionId);
    
    // Convert entity to response DTO
    PracticeQuestionSubmissionResponse convertToResponse(PracticeQuestionSubmission submission);
    
    // Utility method to evaluate answer correctness
    boolean evaluateAnswer(Long questionId, String userAnswer);
    
    // Calculate points earned based on correctness and question points
    int calculatePointsEarned(Long questionId, boolean isCorrect);
}