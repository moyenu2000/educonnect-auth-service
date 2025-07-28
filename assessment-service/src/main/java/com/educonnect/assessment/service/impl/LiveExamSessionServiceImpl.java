package com.educonnect.assessment.service.impl;

import com.educonnect.assessment.dto.*;
import com.educonnect.assessment.entity.*;
import com.educonnect.assessment.enums.ExamStatus;
import com.educonnect.assessment.exception.BadRequestException;
import com.educonnect.assessment.exception.ResourceNotFoundException;
import com.educonnect.assessment.repository.*;
import com.educonnect.assessment.service.LiveExamSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class LiveExamSessionServiceImpl implements LiveExamSessionService {

    @Autowired
    private LiveExamRepository liveExamRepository;

    @Autowired
    private ExamRegistrationRepository examRegistrationRepository;

    @Autowired
    private ExamSessionRepository examSessionRepository;

    @Autowired
    private ExamAnswerRepository examAnswerRepository;

    @Autowired
    private ExamResultRepository examResultRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public ApiResponse<Boolean> registerForExam(Long examId, Long userId) {
        LiveExam exam = liveExamRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Live exam not found with ID: " + examId));

        // Check if registration is still open
        if (exam.getStatus() != ExamStatus.SCHEDULED) {
            throw new BadRequestException("Registration is not open for this exam");
        }

        // Check if exam hasn't started yet
        if (LocalDateTime.now().isAfter(exam.getScheduledAt())) {
            throw new BadRequestException("Registration period has ended");
        }

        // Check if user is already registered
        if (examRegistrationRepository.existsByUserIdAndExamId(userId, examId)) {
            throw new BadRequestException("User is already registered for this exam");
        }

        // Create registration
        ExamRegistration registration = new ExamRegistration();
        registration.setUserId(userId);
        registration.setExamId(examId);
        examRegistrationRepository.save(registration);

        // Update participant count
        exam.setTotalParticipants(exam.getTotalParticipants() + 1);
        liveExamRepository.save(exam);

        Map<String, Object> data = new HashMap<>();
        data.put("registered", true);
        data.put("registrationId", registration.getId());

        return new ApiResponse<>(true, true, "Successfully registered for the exam");
    }

    @Override
    public ExamSessionResponse startExam(Long examId, Long userId, String ipAddress, String userAgent) {
        LiveExam exam = liveExamRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Live exam not found with ID: " + examId));

        // Validate exam can be started
        validateExamStart(exam, userId);

        // Check for existing active session
        Optional<ExamSession> existingSession = examSessionRepository.findByUserIdAndExamIdAndIsActiveTrue(userId, examId);
        if (existingSession.isPresent()) {
            return resumeExistingSession(existingSession.get());
        }

        // Create new session
        ExamSession session = new ExamSession();
        session.setUserId(userId);
        session.setExamId(examId);
        session.setTimeRemaining(exam.getDuration() * 60); // Convert minutes to seconds
        session.setExpiresAt(LocalDateTime.now().plusMinutes(exam.getDuration()));
        session.setIpAddress(ipAddress);
        session.setUserAgent(userAgent);

        session = examSessionRepository.save(session);

        // Mark registration as attended
        ExamRegistration registration = examRegistrationRepository.findByUserIdAndExamId(userId, examId)
                .orElseThrow(() -> new BadRequestException("User is not registered for this exam"));
        registration.setAttended(true);
        examRegistrationRepository.save(registration);

        // Get exam questions
        List<Question> questions = questionRepository.findAllById(exam.getQuestionIds());

        ExamSessionResponse response = new ExamSessionResponse();
        response.setSessionId(session.getSessionId());
        response.setQuestions(questions);
        response.setTimeLimit(exam.getDuration() * 60);
        response.setStartTime(session.getStartTime());
        response.setExpiresAt(session.getExpiresAt());
        response.setInstructions(exam.getInstructions());

        return response;
    }

    @Override
    public ApiResponse<Boolean> submitAnswer(ExamAnswerRequest request, Long userId) {
        // Validate session
        ExamSession session = examSessionRepository.findBySessionId(request.getSessionId())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid session ID"));

        validateExamSession(request.getSessionId(), userId);

        // Check if session is still active
        if (!session.getIsActive() || session.getIsCompleted()) {
            throw new BadRequestException("Exam session is no longer active");
        }

        // Check if time hasn't expired
        if (LocalDateTime.now().isAfter(session.getExpiresAt())) {
            throw new BadRequestException("Exam time has expired");
        }

        // Get question for validation
        Question question = questionRepository.findByIdAndIsActiveTrue(request.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        // Check answer correctness
        boolean isCorrect = checkAnswer(question, request.getAnswer());

        // Save or update answer
        ExamAnswer examAnswer = examAnswerRepository.findBySessionIdAndQuestionId(
                request.getSessionId(), request.getQuestionId())
                .orElse(new ExamAnswer());

        examAnswer.setSessionId(request.getSessionId());
        examAnswer.setQuestionId(request.getQuestionId());
        examAnswer.setAnswer(request.getAnswer());
        examAnswer.setTimeTaken(request.getTimeTaken());
        examAnswer.setIsCorrect(isCorrect);

        examAnswerRepository.save(examAnswer);

        Map<String, Object> data = new HashMap<>();
        data.put("submitted", true);
        long totalAnswered = examAnswerRepository.countAnswersBySessionId(request.getSessionId());
        long totalQuestions = session.getExam().getQuestionIds().size();
        data.put("remaining", totalQuestions - totalAnswered);

        return new ApiResponse<>(true, true, "Answer submitted successfully");
    }

    @Override
    public ExamResultResponse finishExam(ExamFinishRequest request, Long userId) {
        ExamSession session = examSessionRepository.findBySessionId(request.getSessionId())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid session ID"));

        validateExamSession(request.getSessionId(), userId);

        if (session.getIsCompleted()) {
            throw new BadRequestException("Exam has already been completed");
        }

        // Process final answers
        for (ExamFinishRequest.FinalAnswer finalAnswer : request.getFinalAnswers()) {
            ExamAnswer examAnswer = examAnswerRepository.findBySessionIdAndQuestionId(
                    request.getSessionId(), finalAnswer.getQuestionId())
                    .orElse(new ExamAnswer());

            Question question = questionRepository.findByIdAndIsActiveTrue(finalAnswer.getQuestionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

            examAnswer.setSessionId(request.getSessionId());
            examAnswer.setQuestionId(finalAnswer.getQuestionId());
            examAnswer.setAnswer(finalAnswer.getAnswer());
            examAnswer.setIsCorrect(checkAnswer(question, finalAnswer.getAnswer()));
            examAnswer.setIsFinal(true);

            examAnswerRepository.save(examAnswer);
        }

        // Complete session
        session.setIsCompleted(true);
        session.setIsActive(false);
        session.setEndTime(LocalDateTime.now());
        examSessionRepository.save(session);

        // Calculate results
        ExamResult result = calculateExamResult(session);
        result = examResultRepository.save(result);

        // Update rankings
        updateExamRankings(session.getExamId());

        return convertToExamResultResponse(result);
    }

    @Override
    public ExamResultResponse getExamResults(Long examId, Long userId) {
        ExamResult result = examResultRepository.findByUserIdAndExamId(userId, examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam result not found"));

        return convertToExamResultResponse(result);
    }

    @Override
    public Page<LeaderboardEntry> getExamLeaderboard(Long examId, Pageable pageable, Long userId) {
        Page<ExamResult> resultsPage = examResultRepository.findByExamIdOrderByScoreDesc(examId, pageable);

        List<LeaderboardEntry> leaderboard = resultsPage.getContent().stream()
                .map(this::convertToLeaderboardEntry)
                .collect(Collectors.toList());

        return new PageImpl<>(leaderboard, pageable, resultsPage.getTotalElements());
    }

    @Override
    public boolean isUserRegistered(Long examId, Long userId) {
        return examRegistrationRepository.existsByUserIdAndExamId(userId, examId);
    }

    @Override
    public boolean hasUserCompletedExam(Long examId, Long userId) {
        return examSessionRepository.existsByUserIdAndExamIdAndIsCompletedTrue(userId, examId);
    }

    @Override
    public void updateExamRankings(Long examId) {
        List<ExamResult> results = examResultRepository.findExamResultsOrderedByRank(examId);
        
        for (int i = 0; i < results.size(); i++) {
            ExamResult result = results.get(i);
            result.setRank(i + 1);
            
            // Calculate percentile
            double percentile = ((double) (results.size() - i) / results.size()) * 100;
            result.setPercentile(percentile);
        }
        
        examResultRepository.saveAll(results);
    }

    @Override
    public void expireInactiveSessions() {
        List<ExamSession> expiredSessions = examSessionRepository.findExpiredActiveSessions(LocalDateTime.now());
        
        for (ExamSession session : expiredSessions) {
            session.setIsActive(false);
            session.setEndTime(LocalDateTime.now());
            examSessionRepository.save(session);
            
            // Auto-submit exam if not completed
            if (!session.getIsCompleted()) {
                autoSubmitExam(session);
            }
        }
    }

    @Override
    public void validateExamSession(String sessionId, Long userId) {
        ExamSession session = examSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid session ID"));

        if (!session.getUserId().equals(userId)) {
            throw new BadRequestException("Session does not belong to the current user");
        }

        if (!session.getIsActive()) {
            throw new BadRequestException("Session is not active");
        }

        if (LocalDateTime.now().isAfter(session.getExpiresAt())) {
            throw new BadRequestException("Session has expired");
        }
    }

    private void validateExamStart(LiveExam exam, Long userId) {
        // Check if exam is active
        if (exam.getStatus() != ExamStatus.ACTIVE) {
            throw new BadRequestException("Exam is not currently active");
        }

        // Check if user is registered
        if (!examRegistrationRepository.existsByUserIdAndExamId(userId, exam.getId())) {
            throw new BadRequestException("User is not registered for this exam");
        }

        // Check if user has already completed the exam
        if (examSessionRepository.existsByUserIdAndExamIdAndIsCompletedTrue(userId, exam.getId())) {
            throw new BadRequestException("User has already completed this exam");
        }

        // Check if exam is within the scheduled time window
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime examStart = exam.getScheduledAt();
        LocalDateTime examEnd = examStart.plusMinutes(exam.getDuration());

        if (now.isBefore(examStart)) {
            throw new BadRequestException("Exam has not started yet");
        }

        if (now.isAfter(examEnd)) {
            throw new BadRequestException("Exam time has ended");
        }
    }

    private ExamSessionResponse resumeExistingSession(ExamSession session) {
        LiveExam exam = session.getExam();
        List<Question> questions = questionRepository.findAllById(exam.getQuestionIds());

        ExamSessionResponse response = new ExamSessionResponse();
        response.setSessionId(session.getSessionId());
        response.setQuestions(questions);
        response.setTimeLimit(session.getTimeRemaining());
        response.setStartTime(session.getStartTime());
        response.setExpiresAt(session.getExpiresAt());
        response.setInstructions(exam.getInstructions());

        return response;
    }

    private boolean checkAnswer(Question question, String userAnswer) {
        if (question.getCorrectAnswer() == null || userAnswer == null) {
            return false;
        }

        String correctAnswer = question.getCorrectAnswer().trim().toLowerCase();
        String providedAnswer = userAnswer.trim().toLowerCase();

        return correctAnswer.equals(providedAnswer);
    }

    private ExamResult calculateExamResult(ExamSession session) {
        List<ExamAnswer> answers = examAnswerRepository.findBySessionId(session.getSessionId());
        LiveExam exam = session.getExam();

        int totalQuestions = exam.getQuestionIds().size();
        int correctAnswers = (int) answers.stream().filter(ExamAnswer::getIsCorrect).count();
        int incorrectAnswers = (int) answers.stream().filter(a -> !a.getIsCorrect()).count();
        int unanswered = totalQuestions - answers.size();

        // Calculate score (simple percentage)
        int score = totalQuestions > 0 ? (correctAnswers * 100) / totalQuestions : 0;
        
        // Calculate total time taken
        Integer totalTimeTaken = examAnswerRepository.sumTimeTakenBySessionId(session.getSessionId());
        if (totalTimeTaken == null) totalTimeTaken = 0;

        // Check if passed
        boolean passed = score >= exam.getPassingScore();

        ExamResult result = new ExamResult();
        result.setExamId(session.getExamId());
        result.setUserId(session.getUserId());
        result.setSessionId(session.getSessionId());
        result.setScore(score);
        result.setTotalQuestions(totalQuestions);
        result.setCorrectAnswers(correctAnswers);
        result.setIncorrectAnswers(incorrectAnswers);
        result.setUnanswered(unanswered);
        result.setTimeTaken(totalTimeTaken);
        result.setPassed(passed);

        return result;
    }

    private ExamResultResponse convertToExamResultResponse(ExamResult result) {
        ExamResultResponse response = new ExamResultResponse();
        response.setSubmissionId(result.getId());
        response.setScore(result.getScore());
        response.setTotalQuestions(result.getTotalQuestions());
        response.setCorrectAnswers(result.getCorrectAnswers());
        response.setIncorrectAnswers(result.getIncorrectAnswers());
        response.setUnanswered(result.getUnanswered());
        response.setTimeTaken(result.getTimeTaken());
        response.setRank(result.getRank());
        response.setPercentile(result.getPercentile());
        response.setPassed(result.getPassed());
        response.setSubmittedAt(result.getSubmittedAt());

        // Get answers
        List<ExamAnswer> answers = examAnswerRepository.findBySessionId(result.getSessionId());
        response.setAnswers(answers);

        // Calculate performance metrics
        ExamResultResponse.ExamPerformance performance = new ExamResultResponse.ExamPerformance();
        double accuracy = result.getTotalQuestions() > 0 ? 
                ((double) result.getCorrectAnswers() / result.getTotalQuestions()) * 100 : 0;
        performance.setAccuracy(accuracy);
        performance.setAverageTimePerQuestion(result.getTotalQuestions() > 0 ? 
                result.getTimeTaken() / result.getTotalQuestions() : 0);
        performance.setFeedback(generatePerformanceFeedback(result));
        response.setPerformance(performance);

        // Ranking info
        ExamResultResponse.RankingInfo ranking = new ExamResultResponse.RankingInfo();
        long totalParticipants = examResultRepository.countByExamId(result.getExamId());
        ranking.setTotalParticipants((int) totalParticipants);
        ranking.setUserRank(result.getRank());
        ranking.setCategory(getRankingCategory(result.getPercentile()));
        response.setRanking(ranking);

        return response;
    }

    private LeaderboardEntry convertToLeaderboardEntry(ExamResult result) {
        LeaderboardEntry entry = new LeaderboardEntry();
        entry.setRank(result.getRank());
        entry.setUserId(result.getUserId());
        entry.setUsername("User " + result.getUserId()); // Would get from user service in real app
        entry.setScore(result.getScore());
        entry.setTimeTaken(result.getTimeTaken());
        entry.setPassed(result.getPassed());
        
        double accuracy = result.getTotalQuestions() > 0 ? 
                ((double) result.getCorrectAnswers() / result.getTotalQuestions()) * 100 : 0;
        entry.setAccuracy(accuracy);

        return entry;
    }

    private void autoSubmitExam(ExamSession session) {
        // Mark session as completed
        session.setIsCompleted(true);
        session.setEndTime(LocalDateTime.now());
        examSessionRepository.save(session);

        // Calculate results with existing answers only
        ExamResult result = calculateExamResult(session);
        examResultRepository.save(result);

        // Update rankings
        updateExamRankings(session.getExamId());
    }

    private String generatePerformanceFeedback(ExamResult result) {
        double accuracy = result.getTotalQuestions() > 0 ? 
                ((double) result.getCorrectAnswers() / result.getTotalQuestions()) * 100 : 0;

        if (accuracy >= 90) {
            return "Excellent performance! You demonstrated strong mastery of the subject.";
        } else if (accuracy >= 80) {
            return "Good performance! You have a solid understanding of most concepts.";
        } else if (accuracy >= 70) {
            return "Fair performance. Consider reviewing the topics you missed.";
        } else if (accuracy >= 60) {
            return "You passed, but there's room for improvement. Focus on strengthening weak areas.";
        } else {
            return "Consider additional study and practice before retaking the exam.";
        }
    }

    private String getRankingCategory(Double percentile) {
        if (percentile == null) return "Unranked";
        
        if (percentile >= 90) return "Top 10%";
        if (percentile >= 75) return "Top 25%";
        if (percentile >= 50) return "Top 50%";
        return "Below Average";
    }
}