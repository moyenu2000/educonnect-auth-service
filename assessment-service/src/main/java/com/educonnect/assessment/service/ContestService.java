package com.educonnect.assessment.service;

import com.educonnect.assessment.controller.ContestController;
import com.educonnect.assessment.dto.PagedResponse;
import com.educonnect.assessment.entity.Contest;
import com.educonnect.assessment.entity.Question;
import com.educonnect.assessment.entity.UserSubmission;
import com.educonnect.assessment.enums.ContestStatus;
import com.educonnect.assessment.enums.ContestType;

import java.util.List;
import java.util.Map;

public interface ContestService {
    
    // Contest management
    PagedResponse<Contest> getAllContests(int page, int size, ContestStatus status, ContestType type);
    List<Contest> getPublicContests();
    Map<String, Object> getContestDetails(Long contestId);
    Contest createContest(ContestController.ContestRequest request);
    Contest updateContest(Long contestId, ContestController.ContestRequest request);
    void deleteContest(Long contestId);
    
    // Contest participation
    List<Question> getContestQuestions(Long contestId);
    Map<String, Object> submitContestAnswer(Long contestId, Long questionId, Long userId, String answer, Integer timeTaken, String explanation);
    void joinContest(Long contestId, Long userId);
    
    // Contest results and leaderboard
    Map<String, Object> getContestLeaderboard(Long contestId, int page, int size);
    Map<String, Object> getContestResults(Long contestId);
    
    // User submissions
    List<UserSubmission> getUserContestSubmissions(Long contestId, Long userId);
    PagedResponse<UserSubmission> getUserContestSubmissions(Long userId, int page, int size, ContestStatus contestStatus);
    
    // Contest control
    void startContest(Long contestId);
    void endContest(Long contestId);
    void finalizeContestSubmissions(Long contestId);
}