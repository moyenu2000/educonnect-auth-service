package com.educonnect.assessment.service.impl;

import com.educonnect.assessment.dto.*;
import com.educonnect.assessment.entity.PracticeQuestionSubmission;
import com.educonnect.assessment.entity.Question;
import com.educonnect.assessment.entity.QuestionOption;
import com.educonnect.assessment.repository.PracticeQuestionSubmissionRepository;
import com.educonnect.assessment.repository.QuestionRepository;
import com.educonnect.assessment.service.PracticeQuestionSubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PracticeQuestionSubmissionServiceImpl implements PracticeQuestionSubmissionService {

    @Autowired
    private PracticeQuestionSubmissionRepository submissionRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public PracticeQuestionSubmissionResponse submitAnswer(Long userId, Long questionId, 
                                                         PracticeQuestionSubmissionRequest request, 
                                                         String ipAddress) {
        // Validate question exists
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionId));

        // Evaluate answer correctness
        boolean isCorrect = evaluateAnswer(questionId, request.getAnswer());
        
        // Calculate points earned
        int pointsEarned = calculatePointsEarned(questionId, isCorrect);

        // Create submission
        PracticeQuestionSubmission submission = new PracticeQuestionSubmission(
                userId, questionId, request.getAnswer(), isCorrect, pointsEarned, request.getTimeTaken()
        );
        submission.setIpAddress(ipAddress);
        submission.setDeviceInfo(request.getDeviceInfo());

        // Save submission
        submission = submissionRepository.save(submission);

        // Convert to response with additional feedback
        PracticeQuestionSubmissionResponse response = convertToResponse(submission);
        
        // Add correct answer and explanation for immediate feedback
        response.setCorrectAnswer(getCorrectAnswerText(question));
        response.setExplanation(question.getExplanation());
        
        // Add attempt statistics
        int totalAttempts = getUserTotalAttempts(userId, questionId);
        response.setAttemptNumber(totalAttempts);
        response.setIsLatestAttempt(true);
        
        Integer bestScore = getUserBestScore(userId, questionId);
        response.setBestScore(bestScore != null ? bestScore : pointsEarned);

        return response;
    }

    @Override
    public List<PracticeQuestionSubmissionResponse> getUserSubmissionsForQuestion(Long userId, Long questionId) {
        List<PracticeQuestionSubmission> submissions = 
                submissionRepository.findByUserIdAndQuestionIdOrderBySubmittedAtDesc(userId, questionId);
        
        return submissions.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<PracticeQuestionSubmissionResponse> getUserSubmissions(Long userId, Pageable pageable) {
        Page<PracticeQuestionSubmission> submissions = 
                submissionRepository.findByUserIdOrderBySubmittedAtDesc(userId, pageable);
        
        return submissions.map(this::convertToResponse);
    }

    @Override
    public Page<PracticeQuestionSubmissionResponse> getUserSubmissionHistory(Long userId, 
                                                                           LocalDateTime startDate, 
                                                                           LocalDateTime endDate, 
                                                                           Pageable pageable) {
        Page<PracticeQuestionSubmission> submissions = 
                submissionRepository.findByUserIdAndSubmittedAtBetween(userId, startDate, endDate, pageable);
        
        return submissions.map(this::convertToResponse);
    }

    @Override
    public PracticeQuestionStatsResponse getUserStats(Long userId) {
        System.out.println("DEBUG: getUserStats called with userId: " + userId);
        Object[] stats = submissionRepository.getUserSubmissionStats(userId);
        System.out.println("DEBUG: Raw stats from DB: " + java.util.Arrays.toString(stats));
        
        if (stats != null && stats.length >= 5) {
            Long totalSubmissions = stats[0] != null ? ((Number) stats[0]).longValue() : 0L;
            Long correctSubmissions = stats[1] != null ? ((Number) stats[1]).longValue() : 0L;
            Long totalPoints = stats[2] != null ? ((Number) stats[2]).longValue() : 0L;
            Long uniqueQuestions = stats[3] != null ? ((Number) stats[3]).longValue() : 0L;
            Long solvedQuestions = stats[4] != null ? ((Number) stats[4]).longValue() : 0L;
            
            System.out.println("DEBUG: Parsed stats - total: " + totalSubmissions + ", correct: " + correctSubmissions + 
                             ", points: " + totalPoints + ", unique: " + uniqueQuestions + ", solved: " + solvedQuestions);
            
            return new PracticeQuestionStatsResponse(totalSubmissions, correctSubmissions, 
                                                   totalPoints, uniqueQuestions, solvedQuestions);
        }
        
        System.out.println("DEBUG: Returning default stats (all zeros)");
        return new PracticeQuestionStatsResponse(0L, 0L, 0L, 0L, 0L);
    }

    @Override
    public List<PracticeQuestionSubmissionResponse> getRecentSubmissions(Long userId) {
        List<PracticeQuestionSubmission> submissions = 
                submissionRepository.findTop10ByUserIdOrderBySubmittedAtDesc(userId);
        
        return submissions.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PracticeQuestionSubmissionResponse> getSubmissionHistory(Long userId) {
        List<PracticeQuestionSubmission> submissions = 
                submissionRepository.findByUserIdOrderBySubmittedAtDesc(userId);
        
        return submissions.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public String getSubmissionStatus(Long userId, Long questionId) {
        if (hasUserSolved(userId, questionId)) {
            return "SOLVED";
        } else if (submissionRepository.existsByUserIdAndQuestionId(userId, questionId)) {
            return "ATTEMPTED";
        } else {
            return "NOT_ATTEMPTED";
        }
    }

    @Override
    public boolean hasUserSolved(Long userId, Long questionId) {
        return submissionRepository.hasUserSolvedQuestion(userId, questionId);
    }

    @Override
    public Integer getUserBestScore(Long userId, Long questionId) {
        return submissionRepository.getUserBestScoreForQuestion(userId, questionId).orElse(null);
    }

    @Override
    public int getUserTotalAttempts(Long userId, Long questionId) {
        return (int) submissionRepository.findByUserIdAndQuestionIdOrderBySubmittedAtDesc(userId, questionId).size();
    }

    @Override
    public PracticeQuestionSubmissionResponse getLatestSubmission(Long userId, Long questionId) {
        Optional<PracticeQuestionSubmission> submission = 
                submissionRepository.findTopByUserIdAndQuestionIdOrderBySubmittedAtDesc(userId, questionId);
        
        return submission.map(this::convertToResponse).orElse(null);
    }

    @Override
    public PracticeQuestionSubmissionResponse convertToResponse(PracticeQuestionSubmission submission) {
        return new PracticeQuestionSubmissionResponse(
                submission.getId(),
                submission.getUserId(),
                submission.getQuestionId(),
                submission.getAnswer(),
                submission.getIsCorrect(),
                submission.getPointsEarned(),
                submission.getTimeTakenSeconds(),
                submission.getSubmittedAt()
        );
    }

    @Override
    public boolean evaluateAnswer(Long questionId, String userAnswer) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        switch (question.getType()) {
            case MCQ:
                return evaluateMCQAnswer(question, userAnswer);
            case TRUE_FALSE:
                return evaluateTrueFalseAnswer(question, userAnswer);
            case FILL_BLANK:
            case NUMERIC:
            case ESSAY:
                return evaluateTextAnswer(question, userAnswer);
            default:
                throw new RuntimeException("Unsupported question type: " + question.getType());
        }
    }

    @Override
    public int calculatePointsEarned(Long questionId, boolean isCorrect) {
        if (!isCorrect) {
            return 0;
        }

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        return question.getPoints() != null ? question.getPoints() : 1;
    }

    // Helper methods
    private boolean evaluateMCQAnswer(Question question, String userAnswer) {
        try {
            Long userOptionId = Long.parseLong(userAnswer.trim());
            return userOptionId.equals(question.getCorrectAnswerOptionId());
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private boolean evaluateTrueFalseAnswer(Question question, String userAnswer) {
        String correctAnswer = question.getCorrectAnswerText();
        if (correctAnswer == null) return false;
        
        return correctAnswer.trim().equalsIgnoreCase(userAnswer.trim());
    }

    private boolean evaluateTextAnswer(Question question, String userAnswer) {
        String correctAnswer = question.getCorrectAnswerText();
        if (correctAnswer == null) return false;
        
        // For numeric questions, try to parse and compare as numbers
        if (question.getType().name().equals("NUMERIC")) {
            try {
                double userNum = Double.parseDouble(userAnswer.trim());
                double correctNum = Double.parseDouble(correctAnswer.trim());
                return Math.abs(userNum - correctNum) < 0.001; // Allow small floating point differences
            } catch (NumberFormatException e) {
                return false;
            }
        }
        
        // For text questions, do case-insensitive comparison
        return correctAnswer.trim().equalsIgnoreCase(userAnswer.trim());
    }

    private String getCorrectAnswerText(Question question) {
        if (question.getType().name().equals("MCQ") && question.getCorrectAnswerOptionId() != null) {
            Optional<QuestionOption> correctOption = question.getOptions().stream()
                    .filter(option -> option.getId().equals(question.getCorrectAnswerOptionId()))
                    .findFirst();
            return correctOption.map(QuestionOption::getText).orElse("Correct answer not found");
        }
        return question.getCorrectAnswerText();
    }
}