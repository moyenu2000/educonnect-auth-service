package com.educonnect.assessment.service;

import com.educonnect.assessment.dto.PagedResponse;
import com.educonnect.assessment.entity.DailyQuestion;
import com.educonnect.assessment.entity.Question;
import com.educonnect.assessment.entity.UserSubmission;
import com.educonnect.assessment.entity.UserStreak;
import com.educonnect.assessment.enums.ClassLevel;
import com.educonnect.assessment.enums.Difficulty;
import com.educonnect.assessment.enums.ExamSubmissionStatus;
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
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

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

    /**
     * Get current date adjusted for timezone (server time + 6 hours for Asia/Dhaka)
     */
    private LocalDate getCurrentDateAdjusted() {
        // Add 6 hours to server time to match Asia/Dhaka timezone
        return java.time.LocalDateTime.now().plusHours(6).toLocalDate();
    }

    public Map<String, Object> getDailyQuestions(LocalDate date, Long subjectId, 
                                                ClassLevel classLevel, Difficulty difficulty) {
        if (date == null) {
            date = getCurrentDateAdjusted();
        }

        List<DailyQuestion> dailyQuestions = dailyQuestionRepository.findFilteredDailyQuestionsWithDifficulty(
                date, subjectId, classLevel, difficulty);
        
        // Filter by classLevel if needed (do it in service since Subject entity relationship is complex)
        if (classLevel != null) {
            dailyQuestions = dailyQuestions.stream()
                    .filter(dq -> {
                        try {
                            Optional<Question> questionOpt = questionRepository.findById(dq.getQuestionId());
                            return questionOpt.isPresent() && 
                                   questionOpt.get().getSubject() != null && 
                                   classLevel.equals(questionOpt.get().getSubject().getClassLevel());
                        } catch (Exception e) {
                            return false; // Skip if there's an issue with the question/subject
                        }
                    })
                    .toList();
        }

        // Convert to detailed questions with text and options
        List<Map<String, Object>> detailedQuestions = dailyQuestions.stream()
                .map(dq -> {
                    Map<String, Object> questionDetail = new HashMap<>();
                    Question question = questionRepository.findById(dq.getQuestionId()).orElse(null);
                    
                    questionDetail.put("id", dq.getId());
                    questionDetail.put("questionId", dq.getQuestionId());
                    questionDetail.put("date", dq.getDate());
                    questionDetail.put("subjectId", dq.getSubjectId());
                    questionDetail.put("difficulty", dq.getDifficulty());
                    questionDetail.put("points", dq.getPoints());
                    questionDetail.put("bonusPoints", dq.getBonusPoints());
                    
                    if (question != null) {
                        questionDetail.put("text", question.getText());
                        questionDetail.put("type", question.getType());
                        
                        // Safely handle options to avoid circular reference issues
                        try {
                            List<Map<String, Object>> safeOptions = question.getOptions().stream()
                                    .map(option -> {
                                        Map<String, Object> safeOption = new HashMap<>();
                                        safeOption.put("id", option.getId());
                                        safeOption.put("text", option.getText());
                                        safeOption.put("optionOrder", option.getOptionOrder());
                                        return safeOption;
                                    })
                                    .toList();
                            questionDetail.put("options", safeOptions);
                        } catch (Exception e) {
                            System.out.println("DEBUG: Failed to load options for question " + question.getId() + ": " + e.getMessage());
                            questionDetail.put("options", new ArrayList<>());
                        }
                    }
                    
                    return questionDetail;
                })
                .toList();

        Map<String, Object> result = new HashMap<>();
        result.put("questions", detailedQuestions);
        result.put("totalQuestions", detailedQuestions.size());

        // SIMPLIFIED: Always use default streak info to avoid any serialization issues
        result.put("streakInfo", getDefaultStreakInfo());

        return result;
    }
    
    public Map<String, Object> getUserStreakInfoSafe(Long userId, Long subjectId) {
        try {
            System.out.println("DEBUG: Getting streak info for user " + userId + " and subject " + subjectId);
            
            // Return default safe streak info to avoid any entity serialization issues
            Map<String, Object> streakInfo = new HashMap<>();
            streakInfo.put("currentStreak", 0);
            streakInfo.put("longestStreak", 0);
            streakInfo.put("streakHistory", new ArrayList<>());
            streakInfo.put("subjectStreaks", new ArrayList<>());
            
            System.out.println("DEBUG: Successfully created safe default streak info");
            return streakInfo;
            
        } catch (Exception e) {
            System.out.println("DEBUG: getUserStreakInfoSafe failed for user " + userId + ": " + e.getMessage());
            e.printStackTrace();
            return getDefaultStreakInfo();
        }
    }
    
    private Map<String, Object> getDefaultStreakInfo() {
        Map<String, Object> defaultStreakInfo = new HashMap<>();
        defaultStreakInfo.put("currentStreak", 0);
        defaultStreakInfo.put("longestStreak", 0);
        defaultStreakInfo.put("streakHistory", new ArrayList<>());
        defaultStreakInfo.put("subjectStreaks", new ArrayList<>());
        return defaultStreakInfo;
    }
    
    @Transactional(readOnly = true)
    public Map<String, Object> getDailyQuestionsRaw(LocalDate date, Long subjectId, 
                                                   ClassLevel classLevel, Difficulty difficulty) {
        if (date == null) {
            date = getCurrentDateAdjusted();
        }

        System.out.println("DEBUG: getDailyQuestionsRaw called with date=" + date + 
                          ", subjectId=" + subjectId + ", difficulty=" + difficulty);

        try {
            // Use raw repository query to avoid entity loading issues
            List<Object[]> rawResults = dailyQuestionRepository.findDailyQuestionsWithQuestionDataNative(date);
            
            List<Map<String, Object>> detailedQuestions = new ArrayList<>();
            
            for (Object[] row : rawResults) {
                // Extract values first
                Long questionSubjectId = row[3] != null ? ((Number) row[3]).longValue() : 0L;
                String questionDifficulty = row[4] != null ? row[4].toString() : "EASY";
                
                // Apply filtering
                boolean shouldInclude = true;
                
                // Filter by subject
                if (subjectId != null && !subjectId.equals(questionSubjectId)) {
                    shouldInclude = false;
                }
                
                // Filter by difficulty
                if (difficulty != null && !difficulty.toString().equals(questionDifficulty)) {
                    shouldInclude = false;
                }
                
                // Skip this question if it doesn't match filters
                if (!shouldInclude) {
                    continue;
                }
                
                Map<String, Object> questionDetail = new HashMap<>();
                
                // Raw data mapping from SQL result
                questionDetail.put("id", row[0] != null ? ((Number) row[0]).longValue() : 0L);
                questionDetail.put("questionId", row[1] != null ? ((Number) row[1]).longValue() : 0L);
                questionDetail.put("date", row[2] != null ? row[2].toString() : date.toString());
                questionDetail.put("subjectId", questionSubjectId);
                questionDetail.put("difficulty", questionDifficulty);
                questionDetail.put("points", row[5] != null ? ((Number) row[5]).intValue() : 10);
                questionDetail.put("bonusPoints", row[6] != null ? ((Number) row[6]).intValue() : 0);
                questionDetail.put("text", row[7] != null ? row[7].toString() : "Question text unavailable");
                questionDetail.put("type", row[8] != null ? row[8].toString() : "MCQ");
                
                // Get options for this question using raw query
                Long questionId = row[1] != null ? ((Number) row[1]).longValue() : 0L;
                List<Map<String, Object>> options = getQuestionOptionsRaw(questionId);
                questionDetail.put("options", options);
                
                detailedQuestions.add(questionDetail);
            }
            
            Map<String, Object> result = new HashMap<>();
            result.put("questions", detailedQuestions);
            result.put("totalQuestions", detailedQuestions.size());
            
            // Simple streak info
            Map<String, Object> streakInfo = new HashMap<>();
            streakInfo.put("currentStreak", 0);
            streakInfo.put("longestStreak", 0);
            streakInfo.put("streakHistory", new ArrayList<>());
            streakInfo.put("subjectStreaks", new ArrayList<>());
            result.put("streakInfo", streakInfo);
            
            return result;
            
        } catch (Exception e) {
            System.out.println("ERROR: getDailyQuestionsRaw failed: " + e.getMessage());
            e.printStackTrace();
            
            // Fallback response
            Map<String, Object> result = new HashMap<>();
            result.put("questions", new ArrayList<>());
            result.put("totalQuestions", 0);
            result.put("streakInfo", new HashMap<>());
            return result;
        }
    }
    
    private List<Map<String, Object>> getQuestionOptionsRaw(Long questionId) {
        try {
            List<Object[]> optionRows = questionRepository.findQuestionOptionsNative(questionId);
            List<Map<String, Object>> options = new ArrayList<>();
            
            for (Object[] optionRow : optionRows) {
                Map<String, Object> option = new HashMap<>();
                option.put("id", optionRow[0] != null ? ((Number) optionRow[0]).longValue() : 0L);
                option.put("text", optionRow[1] != null ? optionRow[1].toString() : "");
                option.put("optionOrder", optionRow[2] != null ? ((Number) optionRow[2]).intValue() : 0);
                options.add(option);
            }
            
            return options;
        } catch (Exception e) {
            System.out.println("ERROR: getQuestionOptionsRaw failed for questionId " + questionId + ": " + e.getMessage());
            return new ArrayList<>();
        }
    }
    
    @Transactional(readOnly = true)
    public Map<String, Object> getAllDailyQuestions(LocalDate startDate, LocalDate endDate) {
        try {
            // Get all daily questions within date range
            List<Object[]> rawResults = dailyQuestionRepository.findAllDailyQuestionsNative(startDate, endDate);
            
            List<Map<String, Object>> allQuestions = new ArrayList<>();
            
            for (Object[] row : rawResults) {
                Map<String, Object> questionDetail = new HashMap<>();
                
                // Raw data mapping from SQL result
                questionDetail.put("id", row[0] != null ? ((Number) row[0]).longValue() : 0L);
                questionDetail.put("questionId", row[1] != null ? ((Number) row[1]).longValue() : 0L);
                questionDetail.put("date", row[2] != null ? row[2].toString() : "");
                questionDetail.put("subjectId", row[3] != null ? ((Number) row[3]).longValue() : 0L);
                questionDetail.put("difficulty", row[4] != null ? row[4].toString() : "EASY");
                questionDetail.put("points", row[5] != null ? ((Number) row[5]).intValue() : 10);
                questionDetail.put("bonusPoints", row[6] != null ? ((Number) row[6]).intValue() : 0);
                questionDetail.put("text", row[7] != null ? row[7].toString() : "Question text unavailable");
                questionDetail.put("type", row[8] != null ? row[8].toString() : "MCQ");
                questionDetail.put("subjectName", row[9] != null ? row[9].toString() : "Unknown Subject");
                
                // Get options for this question
                Long questionId = row[1] != null ? ((Number) row[1]).longValue() : 0L;
                List<Map<String, Object>> options = getQuestionOptionsRaw(questionId);
                questionDetail.put("options", options);
                
                allQuestions.add(questionDetail);
            }
            
            // Group by date for easier frontend consumption
            Map<String, List<Map<String, Object>>> questionsByDate = new HashMap<>();
            for (Map<String, Object> question : allQuestions) {
                String date = (String) question.get("date");
                questionsByDate.computeIfAbsent(date, k -> new ArrayList<>()).add(question);
            }
            
            Map<String, Object> result = new HashMap<>();
            result.put("questions", allQuestions);
            result.put("questionsByDate", questionsByDate);
            result.put("totalQuestions", allQuestions.size());
            result.put("totalDates", questionsByDate.size());
            
            return result;
            
        } catch (Exception e) {
            System.out.println("ERROR: getAllDailyQuestions failed: " + e.getMessage());
            e.printStackTrace();
            
            // Fallback response
            Map<String, Object> result = new HashMap<>();
            result.put("questions", new ArrayList<>());
            result.put("questionsByDate", new HashMap<>());
            result.put("totalQuestions", 0);
            result.put("totalDates", 0);
            return result;
        }
    }

    public Map<String, Object> getDailyQuestionDetails(LocalDate date, Long subjectId, 
                                                     ClassLevel classLevel, Difficulty difficulty) {
        if (date == null) {
            date = getCurrentDateAdjusted();
        }

        List<DailyQuestion> dailyQuestions = dailyQuestionRepository.findFilteredDailyQuestionsWithDifficulty(
                date, subjectId, classLevel, difficulty);
        
        // Filter by classLevel if needed (do it in service since Subject entity relationship is complex)
        if (classLevel != null) {
            dailyQuestions = dailyQuestions.stream()
                    .filter(dq -> {
                        try {
                            Optional<Question> questionOpt = questionRepository.findById(dq.getQuestionId());
                            return questionOpt.isPresent() && 
                                   questionOpt.get().getSubject() != null && 
                                   classLevel.equals(questionOpt.get().getSubject().getClassLevel());
                        } catch (Exception e) {
                            return false; // Skip if there's an issue with the question/subject
                        }
                    })
                    .toList();
        }

        Long userId = SecurityUtils.getCurrentUserId()
                .orElse(93L); // Default test user ID for testing

        // Convert to detailed response with question content and submission status
        List<Map<String, Object>> questionDetails = dailyQuestions.stream()
                .map(dq -> {
                    Map<String, Object> details = new HashMap<>();
                    Optional<Question> questionOpt = questionRepository.findById(dq.getQuestionId());
                    
                    if (questionOpt.isPresent()) {
                        Question question = questionOpt.get();
                        details.put("id", dq.getId());
                        details.put("questionId", dq.getQuestionId());
                        details.put("questionText", question.getText());
                        details.put("options", question.getOptions());
                        details.put("difficulty", dq.getDifficulty());
                        details.put("points", dq.getPoints());
                        details.put("subjectId", dq.getSubjectId());
                        details.put("date", dq.getDate());
                        details.put("type", question.getType());
                        
                        // For previous days' questions, include correct answers for learning
                        LocalDate today = getCurrentDateAdjusted();
                        boolean isPreviousDay = dq.getDate().isBefore(today);
                        
                        if (isPreviousDay) {
                            details.put("correctAnswerOptionId", question.getCorrectAnswerOptionId());
                            details.put("correctAnswerText", question.getCorrectAnswerText());
                            details.put("explanation", question.getExplanation());
                        }
                        
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
        Map<String, Object> streakInfo = getUserStreakInfoSafe(userId, subjectId);
        result.put("streakInfo", streakInfo);

        return result;
    }

    public List<DailyQuestion> getPublicDailyQuestions() {
        LocalDate today = getCurrentDateAdjusted();
        List<DailyQuestion> todayQuestions = dailyQuestionRepository.findByDate(today);
        
        // Auto-create daily questions if none exist for today
        if (todayQuestions.isEmpty()) {
            // Create sample daily questions with available question IDs
            createSampleDailyQuestions(today);
            todayQuestions = dailyQuestionRepository.findByDate(today);
        }
        
        return todayQuestions;
    }
    
    /**
     * Get today's practice questions for students - returns all practice questions for today
     * All questions added to practice for today are available to students
     */
    public Map<String, Object> getTodaysPracticeQuestions() {
        LocalDate today = getCurrentDateAdjusted();
        
        try {
            // Use the existing raw method to get today's questions with full details
            Map<String, Object> result = getDailyQuestionsRaw(today, null, null, null);
            
            // The result already contains questions, totalQuestions, and streakInfo
            // Just add a message for clarity
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> questions = (List<Map<String, Object>>) result.get("questions");
            
            if (questions == null || questions.isEmpty()) {
                result.put("hasPracticeQuestions", false);
                result.put("message", "No practice questions available for today");
            } else {
                result.put("hasPracticeQuestions", true);
                result.put("message", "Today's practice questions retrieved successfully");
            }
            
            return result;
            
        } catch (Exception e) {
            System.out.println("ERROR: Failed to get today's practice questions: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> result = new HashMap<>();
            result.put("hasPracticeQuestions", false);
            result.put("message", "Error retrieving today's practice questions");
            result.put("questions", new ArrayList<>());
            result.put("totalQuestions", 0);
            result.put("streakInfo", getDefaultStreakInfo());
            return result;
        }
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

    public Map<String, Object> submitDraftDailyQuestionAnswer(Long questionId, String answer, 
                                                              Integer timeTaken, String explanation) {
        Long userId = SecurityUtils.getCurrentUserId()
                .orElse(39L); // TEMPORARY: Use test user ID 39 for testing

        // Check if already submitted (either draft or finalized)
        Optional<UserSubmission> existingSubmission = userSubmissionRepository
                .findByUserIdAndQuestionIdAndIsDailyQuestion(userId, questionId, true);
        
        if (existingSubmission.isPresent()) {
            // Update existing draft submission
            UserSubmission submission = existingSubmission.get();
            if (submission.getSubmissionStatus() == ExamSubmissionStatus.FINALIZED) {
                throw new IllegalArgumentException("This daily question has already been finalized");
            }
            
            submission.setAnswer(answer);
            submission.setTimeTaken(timeTaken);
            submission.setExplanation(explanation);
            submission.setSubmissionStatus(ExamSubmissionStatus.DRAFT);
            submission.setSubmittedAt(LocalDateTime.now());
            
            userSubmissionRepository.save(submission);
            
            Map<String, Object> result = new HashMap<>();
            result.put("status", "draft_updated");
            result.put("submissionId", submission.getId());
            result.put("message", "Draft submission updated successfully");
            return result;
        }

        // Find daily question for any date (draft submissions allowed for any date)
        List<DailyQuestion> dailyQuestions = dailyQuestionRepository.findAll()
                .stream()
                .filter(dq -> dq.getQuestionId().equals(questionId))
                .toList();
        Optional<DailyQuestion> dailyQuestion = dailyQuestions.stream().findFirst();
        
        if (dailyQuestion.isEmpty()) {
            throw new IllegalArgumentException("This is not a daily question.");
        }

        DailyQuestion dq = dailyQuestion.get();
        
        // Create draft submission without calculating marks
        UserSubmission submission = new UserSubmission();
        submission.setUserId(userId);
        submission.setQuestionId(questionId);
        submission.setAnswer(answer);
        submission.setTimeTaken(timeTaken);
        submission.setExplanation(explanation);
        submission.setIsDailyQuestion(true);
        submission.setSubmissionStatus(ExamSubmissionStatus.DRAFT);
        submission.setIsCorrect(false); // Will be calculated during finalization
        submission.setPointsEarned(0); // Will be calculated during finalization
        submission.setIsMarksCalculated(false);

        userSubmissionRepository.save(submission);

        Map<String, Object> result = new HashMap<>();
        result.put("status", "draft_saved");
        result.put("submissionId", submission.getId());
        result.put("message", "Answer saved as draft successfully");
        return result;
    }

    public Map<String, Object> submitDailyQuestionAnswer(Long questionId, String answer, 
                                                       Integer timeTaken, String explanation) {
        // For testing: use a default user ID when authentication is disabled
        Long userId = SecurityUtils.getCurrentUserId().orElse(93L); // Default to test student user ID

        // Check if already answered today
        Optional<UserSubmission> existingSubmission = userSubmissionRepository
                .findByUserIdAndQuestionIdAndIsDailyQuestion(userId, questionId, true);
        
        if (existingSubmission.isPresent()) {
            throw new IllegalArgumentException("You have already answered this daily question");
        }

        // Find today's daily question - ONLY allow submissions for today's date (adjusted for timezone)
        LocalDate today = getCurrentDateAdjusted();
        Optional<DailyQuestion> dailyQuestion = dailyQuestionRepository
                .findByDateAndQuestionId(today, questionId);
        
        if (dailyQuestion.isEmpty()) {
            throw new IllegalArgumentException("This is not a daily question for today. Daily questions can only be submitted on their assigned date.");
        }

        DailyQuestion dq = dailyQuestion.get();
        Question question = questionRepository.findById(dq.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + dq.getQuestionId()));
        
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

    @Transactional
    public Map<String, Object> batchSubmitDailyQuestions(LocalDate date) {
        Long userId = SecurityUtils.getCurrentUserId()
                .orElse(39L); // TEMPORARY: Use test user ID 39 for testing

        // IMPORTANT: Only allow batch submission for today's date (adjusted for timezone)
        LocalDate today = getCurrentDateAdjusted();
        if (!date.equals(today)) {
            throw new IllegalArgumentException("Daily questions can only be submitted on their assigned date. Today is " + today + " but you're trying to submit for " + date);
        }

        // Get all draft submissions for this user and date
        List<UserSubmission> draftSubmissions = userSubmissionRepository
                .findDraftDailySubmissionsByUserAndDate(userId, date);

        if (draftSubmissions.isEmpty()) {
            throw new IllegalArgumentException("No draft submissions found for the specified date");
        }

        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> processedSubmissions = new ArrayList<>();
        int totalPoints = 0;
        int correctAnswers = 0;

        for (UserSubmission submission : draftSubmissions) {
            // Get the daily question and original question
            Optional<DailyQuestion> dailyQuestionOpt = dailyQuestionRepository
                    .findByDateAndQuestionId(date, submission.getQuestionId());
            
            if (dailyQuestionOpt.isEmpty()) {
                continue; // Skip if daily question not found
            }

            DailyQuestion dq = dailyQuestionOpt.get();
            Optional<Question> questionOpt = questionRepository.findById(dq.getQuestionId());
            
            if (questionOpt.isEmpty()) {
                continue; // Skip if question not found
            }
            Question question = questionOpt.get();

            // Calculate correctness and points
            boolean isCorrect = question.getCorrectAnswer() != null && 
                              question.getCorrectAnswer().equalsIgnoreCase(submission.getAnswer().trim());
            int pointsEarned = isCorrect ? dq.getPoints() : 0;

            // Update submission to finalized status
            submission.setIsCorrect(isCorrect);
            submission.setPointsEarned(pointsEarned);
            submission.setSubmissionStatus(ExamSubmissionStatus.FINALIZED);
            submission.setIsMarksCalculated(true);
            submission.setFinalizedAt(LocalDateTime.now());

            userSubmissionRepository.save(submission);

            // Add to results
            Map<String, Object> submissionResult = new HashMap<>();
            submissionResult.put("questionId", submission.getQuestionId());
            submissionResult.put("answer", submission.getAnswer());
            submissionResult.put("isCorrect", isCorrect);
            submissionResult.put("correctAnswer", question.getCorrectAnswer());
            submissionResult.put("explanation", question.getExplanation());
            submissionResult.put("pointsEarned", pointsEarned);
            submissionResult.put("timeTaken", submission.getTimeTaken());
            
            processedSubmissions.add(submissionResult);
            totalPoints += pointsEarned;
            if (isCorrect) correctAnswers++;
        }

        // Update streak if all questions are correct
        if (correctAnswers == draftSubmissions.size() && correctAnswers > 0) {
            // Get subject ID from first submission
            if (!draftSubmissions.isEmpty()) {
                Optional<DailyQuestion> firstDailyQuestion = dailyQuestionRepository
                        .findByDateAndQuestionId(date, draftSubmissions.get(0).getQuestionId());
                if (firstDailyQuestion.isPresent()) {
                    updateUserStreak(userId, firstDailyQuestion.get().getSubjectId(), true);
                }
            }
        }

        result.put("status", "batch_finalized");
        result.put("totalSubmissions", draftSubmissions.size());
        result.put("correctAnswers", correctAnswers);
        result.put("totalPoints", totalPoints);
        result.put("accuracy", draftSubmissions.size() > 0 ? (double) correctAnswers / draftSubmissions.size() * 100 : 0);
        result.put("submissions", processedSubmissions);
        result.put("message", "All daily questions finalized successfully");

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

        // TEMPORARILY DISABLED: getStreakHistory to avoid serialization issues
        streakInfo.put("streakHistory", new ArrayList<>());
        
        // Always use empty list to avoid any serialization issues
        streakInfo.put("subjectStreaks", new ArrayList<>());

        return streakInfo;
    }

    public PagedResponse<UserSubmission> getDailyQuestionHistory(int page, int size, Long subjectId, 
                                                               Boolean status, Difficulty difficulty) {
        Long userId = SecurityUtils.getCurrentUserId()
                .orElse(93L); // Default test user ID for testing

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

        LocalDate today = getCurrentDateAdjusted();
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

    public Map<String, Object> checkDailyQuestionSubmissionStatus(LocalDate date) {
        Long userId = SecurityUtils.getCurrentUserId()
                .orElse(39L); // TEMPORARY: Use test user ID 39 for testing

        // Get all daily questions for the specified date
        List<DailyQuestion> dailyQuestions = dailyQuestionRepository.findByDate(date);
        
        if (dailyQuestions.isEmpty()) {
            Map<String, Object> result = new HashMap<>();
            result.put("hasQuestions", false);
            result.put("isSubmitted", false);
            result.put("canSubmit", false);
            result.put("message", "No daily questions found for this date");
            return result;
        }

        // Check if user has finalized submissions for all daily questions of this date
        List<UserSubmission> finalizedSubmissions = userSubmissionRepository
                .findFinalizedDailySubmissionsByUserAndDate(userId, date);

        // Count how many questions have finalized submissions
        Set<Long> submittedQuestionIds = finalizedSubmissions.stream()
                .map(UserSubmission::getQuestionId)
                .collect(Collectors.toSet());

        Set<Long> allQuestionIds = dailyQuestions.stream()
                .map(DailyQuestion::getQuestionId)
                .collect(Collectors.toSet());

        boolean allSubmitted = submittedQuestionIds.containsAll(allQuestionIds);
        
        // Also check for draft submissions
        List<UserSubmission> draftSubmissions = userSubmissionRepository
                .findDraftDailySubmissionsByUserAndDate(userId, date);

        Map<String, Object> result = new HashMap<>();
        result.put("hasQuestions", true);
        result.put("isSubmitted", allSubmitted);
        result.put("canSubmit", !allSubmitted);
        result.put("totalQuestions", allQuestionIds.size());
        result.put("submittedQuestions", submittedQuestionIds.size());
        result.put("draftSubmissions", draftSubmissions.size());
        
        if (allSubmitted) {
            result.put("message", "All daily questions for this date have been submitted and finalized");
            // Include the results for viewing
            result.put("submissionResults", finalizedSubmissions.stream()
                    .map(submission -> {
                        Map<String, Object> submissionResult = new HashMap<>();
                        submissionResult.put("questionId", submission.getQuestionId());
                        submissionResult.put("answer", submission.getAnswer());
                        submissionResult.put("isCorrect", submission.getIsCorrect());
                        submissionResult.put("pointsEarned", submission.getPointsEarned());
                        submissionResult.put("timeTaken", submission.getTimeTaken());
                        submissionResult.put("submittedAt", submission.getSubmittedAt());
                        
                        // Get correct answer and explanation from question
                        try {
                            Optional<Question> questionOpt = questionRepository.findById(submission.getQuestionId());
                            if (questionOpt.isPresent()) {
                                Question question = questionOpt.get();
                                submissionResult.put("correctAnswer", question.getCorrectAnswer());
                                submissionResult.put("explanation", question.getExplanation());
                            }
                        } catch (Exception e) {
                            // Ignore errors in getting question details
                        }
                        
                        return submissionResult;
                    })
                    .toList());
        } else {
            result.put("message", "Daily questions can still be submitted for this date");
        }

        return result;
    }

    // Admin functionality - native SQL version (bulletproof)
    @Transactional
    public void setDailyQuestions(LocalDate date, List<Long> questionIds, Map<String, Object> subjectDistribution) {
        System.out.println("Setting daily questions for " + date + " with " + questionIds.size() + " questions");
        
        // Clear existing questions for the date before adding new ones
        // This ensures that the practice questions for a date are exactly what is being set
        try {
            int deletedCount = dailyQuestionRepository.deleteByDateNative(date);
            System.out.println("Deleted " + deletedCount + " existing questions for " + date + " before setting new practice questions");
        } catch (Exception e) {
            System.err.println("Delete failed, continuing with upsert: " + e.getMessage());
        }
        
        // Extract question configurations
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> questionConfigurations = (List<Map<String, Object>>) subjectDistribution.get("questionConfigurations");

        // Use native upsert for each question
        for (Long questionId : questionIds) {
            try {
                // Fetch the question to get subject
                Question question = questionRepository.findById(questionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));
                
                // Find configuration for this question
                Map<String, Object> questionConfig = questionConfigurations != null ? 
                    questionConfigurations.stream()
                        .filter(config -> {
                            Object configQuestionId = config.get("questionId");
                            return configQuestionId != null && 
                                   (configQuestionId.equals(questionId) || 
                                    configQuestionId.equals(questionId.intValue()));
                        })
                        .findFirst()
                        .orElse(null) : null;
                
                // Get difficulty and points from config or defaults
                String difficulty = questionConfig != null && questionConfig.get("difficulty") != null ? 
                    (String) questionConfig.get("difficulty") : 
                    (question.getDifficulty() != null ? question.getDifficulty().name() : "MEDIUM");
                    
                Integer points = questionConfig != null && questionConfig.get("points") != null ?
                    ((Number) questionConfig.get("points")).intValue() : 10;
                
                // Use native upsert
                dailyQuestionRepository.upsertDailyQuestion(
                    questionId, 
                    date, 
                    question.getSubjectId(), 
                    difficulty, 
                    points
                );
                
                System.out.println("Successfully upserted question " + questionId + " for " + date);
                
            } catch (Exception e) {
                System.err.println("Failed to upsert question " + questionId + ": " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Failed to set daily question " + questionId + ": " + e.getMessage(), e);
            }
        }
        
        System.out.println("Completed setting " + questionIds.size() + " daily questions for " + date);
    }
    
    // Separate method to clear existing questions
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void clearDailyQuestionsForDate(LocalDate date) {
        try {
            // Try native delete first
            int deletedCount = dailyQuestionRepository.deleteByDateNative(date);
            System.out.println("Native delete removed " + deletedCount + " questions for " + date);
        } catch (Exception e) {
            System.err.println("Native delete failed, trying JPA delete: " + e.getMessage());
            try {
                // Fallback to JPA delete
                List<DailyQuestion> existing = dailyQuestionRepository.findByDate(date);
                if (!existing.isEmpty()) {
                    dailyQuestionRepository.deleteAll(existing);
                    System.out.println("JPA delete removed " + existing.size() + " questions for " + date);
                }
            } catch (Exception e2) {
                System.err.println("Both delete methods failed: " + e2.getMessage());
            }
        }
    }
    
    // Individual question upsert with retry logic
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void upsertDailyQuestion(LocalDate date, Long questionId, List<Map<String, Object>> questionConfigurations) {
        // Fetch the question to get subject and difficulty
        Question question = questionRepository.findById(questionId)
            .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));
        
        // Find configuration for this specific question
        Map<String, Object> questionConfig = null;
        if (questionConfigurations != null) {
            questionConfig = questionConfigurations.stream()
                .filter(config -> {
                    Object configQuestionId = config.get("questionId");
                    return configQuestionId != null && 
                           (configQuestionId.equals(questionId) || 
                            configQuestionId.equals(questionId.intValue()));
                })
                .findFirst()
                .orElse(null);
        }
        
        // Check if question already exists for this date
        Optional<DailyQuestion> existingOpt = dailyQuestionRepository.findByDateAndQuestionId(date, questionId);
        
        DailyQuestion dailyQuestion;
        if (existingOpt.isPresent()) {
            // Update existing
            dailyQuestion = existingOpt.get();
            System.out.println("Updating existing daily question " + dailyQuestion.getId() + " for questionId " + questionId);
        } else {
            // Create new
            dailyQuestion = new DailyQuestion();
            dailyQuestion.setQuestionId(questionId);
            dailyQuestion.setDate(date);
            System.out.println("Creating new daily question for questionId " + questionId);
        }
        
        // Set all fields
        dailyQuestion.setSubjectId(question.getSubjectId());
        
        // Set difficulty
        if (questionConfig != null && questionConfig.get("difficulty") != null) {
            String difficultyStr = (String) questionConfig.get("difficulty");
            try {
                Difficulty difficulty = Difficulty.valueOf(difficultyStr.toUpperCase());
                dailyQuestion.setDifficulty(difficulty);
            } catch (IllegalArgumentException e) {
                dailyQuestion.setDifficulty(question.getDifficulty());
            }
        } else {
            dailyQuestion.setDifficulty(question.getDifficulty());
        }
        
        // Set points
        Integer points = 10; // default
        if (questionConfig != null && questionConfig.get("points") != null) {
            Object pointsObj = questionConfig.get("points");
            if (pointsObj instanceof Number) {
                points = ((Number) pointsObj).intValue();
            } else if (pointsObj instanceof String) {
                try {
                    points = Integer.parseInt((String) pointsObj);
                } catch (NumberFormatException e) {
                    points = 10;
                }
            }
        }
        dailyQuestion.setPoints(points != null ? points : 10);
        
        // Ensure all required fields are set
        if (dailyQuestion.getPoints() == null) {
            dailyQuestion.setPoints(10);
        }
        if (dailyQuestion.getDifficulty() == null) {
            dailyQuestion.setDifficulty(question.getDifficulty() != null ? question.getDifficulty() : Difficulty.MEDIUM);
        }
        
        // Save with retry logic
        int maxRetries = 3;
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                dailyQuestionRepository.save(dailyQuestion);
                System.out.println("Successfully saved daily question for " + questionId + " (attempt " + attempt + ")");
                return; // Success, exit retry loop
            } catch (Exception e) {
                System.err.println("Save attempt " + attempt + " failed for " + questionId + ": " + e.getMessage());
                
                if (attempt == maxRetries) {
                    // Last attempt failed, throw the exception
                    throw new RuntimeException("Failed to save daily question after " + maxRetries + " attempts: " + e.getMessage(), e);
                }
                
                // Wait before retry
                try {
                    Thread.sleep(100 * attempt); // Increasing delay
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
            }
        }
    }

    public PagedResponse<Map<String, Object>> getAllDailyQuestionsPaginated(
            LocalDate startDate, LocalDate endDate, int page, int size, Long subjectId, Long topicId, Difficulty difficulty,
            String type, LocalDate selectedDate, String search) {
        
        // If selectedDate is provided, use only that date
        if (selectedDate != null) {
            startDate = selectedDate;
            endDate = selectedDate;
        } else {
            // Use the existing approach that works: get a date range and iterate
            if (startDate == null && endDate == null) {
                endDate = getCurrentDateAdjusted();
                startDate = endDate.minusDays(30);
            } else if (startDate == null) {
                startDate = endDate.minusDays(30);
            } else if (endDate == null) {
                endDate = getCurrentDateAdjusted();
            }
        }
        
        List<Map<String, Object>> allQuestions = new ArrayList<>();
        
        // Get questions for each day in the range
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            try {
                Map<String, Object> dayResult = getDailyQuestionsRawWithFilters(currentDate, subjectId, topicId, null, difficulty, type, search);
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> dayQuestions = (List<Map<String, Object>>) dayResult.get("questions");
                if (dayQuestions != null && !dayQuestions.isEmpty()) {
                    allQuestions.addAll(dayQuestions);
                }
            } catch (Exception e) {
                System.out.println("DEBUG: Failed to get questions for " + currentDate + ": " + e.getMessage());
            }
            currentDate = currentDate.plusDays(1);
        }
        
        // Sort by date desc
        allQuestions.sort((a, b) -> {
            LocalDate dateA = LocalDate.parse(a.get("date").toString());
            LocalDate dateB = LocalDate.parse(b.get("date").toString());
            return dateB.compareTo(dateA);
        });
        
        // Apply pagination manually
        int totalElements = allQuestions.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);
        int start = page * size;
        int end = Math.min(start + size, totalElements);
        
        List<Map<String, Object>> pageContent = (start < totalElements) 
            ? allQuestions.subList(start, end) 
            : new ArrayList<>();
        
        return new PagedResponse<>(
                pageContent,
                totalElements,
                totalPages,
                page,
                size
        );
    }
    
    @Transactional(readOnly = true)
    public Map<String, Object> getDailyQuestionsRawWithFilters(LocalDate date, Long subjectId, Long topicId,
                                                   ClassLevel classLevel, Difficulty difficulty, String type, String search) {
        if (date == null) {
            date = getCurrentDateAdjusted();
        }

        System.out.println("DEBUG: getDailyQuestionsRawWithFilters called with date=" + date + 
                          ", subjectId=" + subjectId + ", topicId=" + topicId + ", difficulty=" + difficulty + ", type=" + type + ", search=" + search);

        try {
            // Use raw repository query to avoid entity loading issues
            List<Object[]> rawResults = dailyQuestionRepository.findDailyQuestionsWithQuestionDataNative(date);
            
            List<Map<String, Object>> detailedQuestions = new ArrayList<>();
            
            for (Object[] row : rawResults) {
                // Extract values first
                Long questionSubjectId = row[3] != null ? ((Number) row[3]).longValue() : 0L;
                String questionDifficulty = row[4] != null ? row[4].toString() : "EASY";
                String questionText = row[7] != null ? row[7].toString() : "Question text unavailable";
                String questionType = row[8] != null ? row[8].toString() : "MCQ";
                Long questionTopicId = row[9] != null ? ((Number) row[9]).longValue() : null;
                
                // Apply filtering
                boolean shouldInclude = true;
                
                // Filter by subject
                if (subjectId != null && !subjectId.equals(questionSubjectId)) {
                    shouldInclude = false;
                }
                
                // Filter by topic
                if (topicId != null && !topicId.equals(questionTopicId)) {
                    shouldInclude = false;
                }
                
                // Filter by difficulty
                if (difficulty != null && !difficulty.toString().equals(questionDifficulty)) {
                    shouldInclude = false;
                }
                
                // Filter by type
                if (type != null && !type.equals(questionType)) {
                    shouldInclude = false;
                }
                
                // Filter by search (search in question text)
                if (search != null && !search.trim().isEmpty()) {
                    String searchLower = search.toLowerCase().trim();
                    if (!questionText.toLowerCase().contains(searchLower)) {
                        shouldInclude = false;
                    }
                }
                
                // Skip this question if it doesn't match filters
                if (!shouldInclude) {
                    continue;
                }
                
                Map<String, Object> questionDetail = new HashMap<>();
                
                // Raw data mapping from SQL result
                questionDetail.put("id", row[0] != null ? ((Number) row[0]).longValue() : 0L);
                questionDetail.put("questionId", row[1] != null ? ((Number) row[1]).longValue() : 0L);
                questionDetail.put("date", row[2] != null ? row[2].toString() : date.toString());
                questionDetail.put("subjectId", questionSubjectId);
                questionDetail.put("difficulty", questionDifficulty);
                questionDetail.put("points", row[5] != null ? ((Number) row[5]).intValue() : 10);
                questionDetail.put("bonusPoints", row[6] != null ? ((Number) row[6]).intValue() : 0);
                questionDetail.put("text", questionText);
                questionDetail.put("type", questionType);
                
                // Get options for this question using raw query
                Long questionId = row[1] != null ? ((Number) row[1]).longValue() : 0L;
                List<Map<String, Object>> options = getQuestionOptionsRaw(questionId);
                questionDetail.put("options", options);
                
                detailedQuestions.add(questionDetail);
            }
            
            Map<String, Object> result = new HashMap<>();
            result.put("questions", detailedQuestions);
            result.put("totalQuestions", detailedQuestions.size());
            
            // Simple streak info
            Map<String, Object> streakInfo = new HashMap<>();
            streakInfo.put("currentStreak", 0);
            streakInfo.put("longestStreak", 0);
            streakInfo.put("streakHistory", new ArrayList<>());
            streakInfo.put("subjectStreaks", new ArrayList<>());
            result.put("streakInfo", streakInfo);
            
            return result;
            
        } catch (Exception e) {
            System.out.println("ERROR: getDailyQuestionsRawWithFilters failed: " + e.getMessage());
            e.printStackTrace();
            
            // Fallback response
            Map<String, Object> result = new HashMap<>();
            result.put("questions", new ArrayList<>());
            result.put("totalQuestions", 0);
            result.put("streakInfo", new HashMap<>());
            return result;
        }
    }
}