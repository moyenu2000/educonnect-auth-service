package com.educonnect.assessment.service;

import com.educonnect.assessment.dto.PagedResponse;
import com.educonnect.assessment.entity.DailyQuestion;
import com.educonnect.assessment.entity.Question;
import com.educonnect.assessment.entity.UserSubmission;
import com.educonnect.assessment.entity.UserStreak;
import com.educonnect.assessment.enums.ClassLevel;
import com.educonnect.assessment.enums.Difficulty;
import com.educonnect.assessment.repository.DailyQuestionRepository;
import com.educonnect.assessment.repository.QuestionRepository;
import com.educonnect.assessment.repository.UserSubmissionRepository;
import com.educonnect.assessment.repository.UserStreakRepository;
import com.educonnect.assessment.exception.ResourceNotFoundException;
import com.educonnect.assessment.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class DailyQuestionService {

    @Autowired
    private DailyQuestionRepository dailyQuestionRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserSubmissionRepository userSubmissionRepository;

    @Autowired
    private UserStreakRepository userStreakRepository;

    public Map<String, Object> getDailyQuestions(LocalDate date, Long subjectId, 
                                                ClassLevel classLevel, Difficulty difficulty) {
        if (date == null) {
            date = LocalDate.now();
        }

        List<DailyQuestion> dailyQuestions = dailyQuestionRepository.findFilteredDailyQuestionsWithDifficulty(
                date, subjectId, classLevel, difficulty);

        Map<String, Object> result = new HashMap<>();
        result.put("questions", dailyQuestions);
        result.put("totalQuestions", dailyQuestions.size());

        // Add streak info if user is authenticated
        SecurityUtils.getCurrentUserId().ifPresent(userId -> {
            Map<String, Object> streakInfo = getUserStreakInfo(userId, subjectId);
            result.put("streakInfo", streakInfo);
        });

        return result;
    }

    public Map<String, Object> getDailyQuestionDetails(LocalDate date, Long subjectId, 
                                                     ClassLevel classLevel, Difficulty difficulty) {
        if (date == null) {
            date = LocalDate.now();
        }

        List<DailyQuestion> dailyQuestions = dailyQuestionRepository.findFilteredDailyQuestionsWithDifficulty(
                date, subjectId, classLevel, difficulty);

        Long userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("User must be authenticated"));

        // Convert to detailed response with question content and submission status
        List<Map<String, Object>> questionDetails = dailyQuestions.stream()
                .map(dq -> {
                    Map<String, Object> details = new HashMap<>();
                    Question question = dq.getQuestion();
                    
                    if (question != null) {
                        details.put("id", dq.getId());
                        details.put("questionId", dq.getQuestionId());
                        details.put("questionText", question.getText());
                        details.put("options", question.getOptions());
                        details.put("difficulty", dq.getDifficulty());
                        details.put("points", dq.getPoints());
                        details.put("subjectId", dq.getSubjectId());
                        details.put("date", dq.getDate());
                        
                        // Check if user has attempted this question
                        Optional<UserSubmission> submission = userSubmissionRepository
                                .findByUserIdAndQuestionIdAndIsDailyQuestion(userId, dq.getQuestionId(), true);
                        
                        details.put("attempted", submission.isPresent());
                        if (submission.isPresent()) {
                            details.put("correct", submission.get().getIsCorrect());
                            details.put("userAnswer", submission.get().getAnswer());
                            details.put("pointsEarned", submission.get().getPointsEarned());
                            details.put("submittedAt", submission.get().getSubmittedAt());
                        } else {
                            details.put("correct", false);
                        }
                    }
                    
                    return details;
                })
                .toList();

        Map<String, Object> result = new HashMap<>();
        result.put("questions", questionDetails);
        result.put("totalQuestions", questionDetails.size());
        result.put("date", date);

        // Add streak info
        Map<String, Object> streakInfo = getUserStreakInfo(userId, subjectId);
        result.put("streakInfo", streakInfo);

        return result;
    }

    public List<DailyQuestion> getPublicDailyQuestions() {
        LocalDate today = LocalDate.now();
        List<DailyQuestion> todayQuestions = dailyQuestionRepository.findByDate(today);
        
        // Auto-create daily questions if none exist for today
        if (todayQuestions.isEmpty()) {
            // Create sample daily questions with available question IDs
            createSampleDailyQuestions(today);
            todayQuestions = dailyQuestionRepository.findByDate(today);
        }
        
        return todayQuestions;
    }
    
    private void createSampleDailyQuestions(LocalDate date) {
        try {
            // Create daily questions with question IDs that should exist
            Long[] questionIds = {49L, 50L, 51L};
            Long[] subjectIds = {1L, 1L, 1L}; // Mathematics
            
            for (int i = 0; i < questionIds.length; i++) {
                DailyQuestion dailyQuestion = new DailyQuestion();
                dailyQuestion.setQuestionId(questionIds[i]);
                dailyQuestion.setDate(date);
                dailyQuestion.setSubjectId(subjectIds[i]);
                dailyQuestion.setDifficulty(com.educonnect.assessment.enums.Difficulty.EASY);
                dailyQuestion.setPoints(1);
                
                dailyQuestionRepository.save(dailyQuestion);
            }
            
            System.out.println("Auto-created " + questionIds.length + " daily questions for " + date);
        } catch (Exception e) {
            System.err.println("Failed to create sample daily questions: " + e.getMessage());
        }
    }

    public Map<String, Object> submitDailyQuestionAnswer(Long questionId, String answer, 
                                                       Integer timeTaken, String explanation) {
        Long userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("User must be authenticated to submit answers"));

        // Check if already answered today
        Optional<UserSubmission> existingSubmission = userSubmissionRepository
                .findByUserIdAndQuestionIdAndIsDailyQuestion(userId, questionId, true);
        
        if (existingSubmission.isPresent()) {
            throw new IllegalArgumentException("You have already answered this daily question");
        }

        // Find today's daily question
        Optional<DailyQuestion> dailyQuestion = dailyQuestionRepository
                .findByDateAndQuestionId(LocalDate.now(), questionId);
        
        if (dailyQuestion.isEmpty()) {
            throw new IllegalArgumentException("This is not a daily question for today");
        }

        DailyQuestion dq = dailyQuestion.get();
        Question question = dq.getQuestion();
        
        // Check answer
        boolean isCorrect = question.getCorrectAnswer().equalsIgnoreCase(answer.trim());
        int pointsEarned = isCorrect ? dq.getPoints() : 0;

        // Save submission
        UserSubmission submission = new UserSubmission();
        submission.setUserId(userId);
        submission.setQuestionId(questionId);
        submission.setAnswer(answer);
        submission.setIsCorrect(isCorrect);
        submission.setTimeTaken(timeTaken);
        submission.setPointsEarned(pointsEarned);
        submission.setExplanation(explanation);
        submission.setIsDailyQuestion(true);

        userSubmissionRepository.save(submission);

        // Update streak
        Map<String, Object> streakInfo = updateUserStreak(userId, dq.getSubjectId(), isCorrect);

        // Get ranking info (simplified)
        Map<String, Object> ranking = getUserRanking(userId);

        Map<String, Object> result = new HashMap<>();
        result.put("correct", isCorrect);
        result.put("correctAnswer", question.getCorrectAnswer());
        result.put("explanation", question.getExplanation());
        result.put("points", pointsEarned);
        result.put("streak", streakInfo);
        result.put("ranking", ranking);

        return result;
    }

    public Map<String, Object> getUserStreakInfo(Long userId, Long subjectId) {
        List<UserStreak> streaks = userStreakRepository.findUserStreaks(userId, subjectId);
        
        Map<String, Object> streakInfo = new HashMap<>();
        
        if (subjectId != null) {
            Optional<UserStreak> subjectStreak = streaks.stream()
                    .filter(s -> s.getSubjectId().equals(subjectId))
                    .findFirst();
            
            if (subjectStreak.isPresent()) {
                UserStreak streak = subjectStreak.get();
                streakInfo.put("currentStreak", streak.getCurrentStreak());
                streakInfo.put("longestStreak", streak.getLongestStreak());
            } else {
                streakInfo.put("currentStreak", 0);
                streakInfo.put("longestStreak", 0);
            }
        } else {
            int totalCurrentStreak = streaks.stream().mapToInt(UserStreak::getCurrentStreak).sum();
            int maxLongestStreak = streaks.stream().mapToInt(UserStreak::getLongestStreak).max().orElse(0);
            
            streakInfo.put("currentStreak", totalCurrentStreak);
            streakInfo.put("longestStreak", maxLongestStreak);
        }

        streakInfo.put("streakHistory", getStreakHistory(userId));
        streakInfo.put("subjectStreaks", streaks);

        return streakInfo;
    }

    public PagedResponse<UserSubmission> getDailyQuestionHistory(int page, int size, Long subjectId, 
                                                               Boolean status, Difficulty difficulty) {
        Long userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("User must be authenticated"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("submittedAt").descending());
        Page<UserSubmission> submissions = userSubmissionRepository.findDailyQuestionHistory(
                userId, subjectId, status, difficulty, pageable);

        Map<String, Object> stats = getDailyQuestionStats(userId);

        PagedResponse<UserSubmission> response = new PagedResponse<>(
                submissions.getContent(),
                (int) submissions.getTotalElements(),
                submissions.getTotalPages(),
                submissions.getNumber(),
                submissions.getSize()
        );

        // Add stats to response (you might need to modify PagedResponse to support this)
        return response;
    }

    private Map<String, Object> updateUserStreak(Long userId, Long subjectId, boolean isCorrect) {
        Optional<UserStreak> existingStreak = userStreakRepository.findByUserIdAndSubjectId(userId, subjectId);
        
        UserStreak streak;
        if (existingStreak.isPresent()) {
            streak = existingStreak.get();
        } else {
            streak = new UserStreak();
            streak.setUserId(userId);
            streak.setSubjectId(subjectId);
        }

        LocalDate today = LocalDate.now();
        LocalDate lastActivity = streak.getLastActivity();

        if (isCorrect) {
            if (lastActivity != null && lastActivity.equals(today.minusDays(1))) {
                // Consecutive day
                streak.setCurrentStreak(streak.getCurrentStreak() + 1);
            } else if (lastActivity == null || !lastActivity.equals(today)) {
                // First day or non-consecutive
                streak.setCurrentStreak(1);
            }
            
            if (streak.getCurrentStreak() > streak.getLongestStreak()) {
                streak.setLongestStreak(streak.getCurrentStreak());
            }
        } else {
            // Wrong answer breaks streak
            streak.setCurrentStreak(0);
        }

        streak.setLastActivity(today);
        streak.setIsActive(isCorrect);
        userStreakRepository.save(streak);

        Map<String, Object> streakInfo = new HashMap<>();
        streakInfo.put("currentStreak", streak.getCurrentStreak());
        streakInfo.put("longestStreak", streak.getLongestStreak());
        streakInfo.put("isActive", streak.getIsActive());

        return streakInfo;
    }

    private Map<String, Object> getUserRanking(Long userId) {
        // Simplified ranking calculation
        long correctAnswers = userSubmissionRepository.countCorrectDailyAnswers(userId);
        long totalAnswers = userSubmissionRepository.countTotalDailyAnswers(userId);
        
        Map<String, Object> ranking = new HashMap<>();
        ranking.put("correctAnswers", correctAnswers);
        ranking.put("totalAnswers", totalAnswers);
        ranking.put("accuracy", totalAnswers > 0 ? (double) correctAnswers / totalAnswers * 100 : 0);
        
        return ranking;
    }

    private List<Map<String, Object>> getStreakHistory(Long userId) {
        // Simplified streak history - you might want to implement a more detailed version
        List<UserSubmission> recentSubmissions = userSubmissionRepository
                .findByUserIdAndIsDailyQuestionTrueOrderBySubmittedAtDesc(userId);
        
        // Convert to streak history format
        return recentSubmissions.stream()
                .limit(30) // Last 30 days
                .map(submission -> {
                    Map<String, Object> entry = new HashMap<>();
                    entry.put("date", submission.getSubmittedAt().toLocalDate());
                    entry.put("correct", submission.getIsCorrect());
                    entry.put("points", submission.getPointsEarned());
                    return entry;
                })
                .toList();
    }

    private Map<String, Object> getDailyQuestionStats(Long userId) {
        long correctAnswers = userSubmissionRepository.countCorrectDailyAnswers(userId);
        long totalAnswers = userSubmissionRepository.countTotalDailyAnswers(userId);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAnswered", totalAnswers);
        stats.put("correctAnswers", correctAnswers);
        stats.put("incorrectAnswers", totalAnswers - correctAnswers);
        stats.put("accuracy", totalAnswers > 0 ? (double) correctAnswers / totalAnswers * 100 : 0);
        
        return stats;
    }

    // Admin functionality
    @Transactional
    public void setDailyQuestions(LocalDate date, List<Long> questionIds, Map<String, Object> subjectDistribution) {
        // Remove existing daily questions for the date
        List<DailyQuestion> existing = dailyQuestionRepository.findByDate(date);
        dailyQuestionRepository.deleteAll(existing);

        // Add new daily questions
        for (Long questionId : questionIds) {
            // Fetch the question to get subject and difficulty
            Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));
            
            DailyQuestion dailyQuestion = new DailyQuestion();
            dailyQuestion.setQuestionId(questionId);
            dailyQuestion.setDate(date);
            dailyQuestion.setSubjectId(question.getSubjectId());
            dailyQuestion.setDifficulty(question.getDifficulty());
            dailyQuestionRepository.save(dailyQuestion);
        }
    }
}