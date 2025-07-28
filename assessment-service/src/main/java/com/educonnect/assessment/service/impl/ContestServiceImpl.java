package com.educonnect.assessment.service.impl;

import com.educonnect.assessment.controller.ContestController;
import com.educonnect.assessment.dto.PagedResponse;
import com.educonnect.assessment.entity.Contest;
import com.educonnect.assessment.entity.ContestParticipation;
import com.educonnect.assessment.entity.Question;
import com.educonnect.assessment.entity.UserSubmission;
import com.educonnect.assessment.enums.ContestStatus;
import com.educonnect.assessment.enums.ContestType;
import com.educonnect.assessment.enums.ExamSubmissionStatus;
import com.educonnect.assessment.exception.ResourceNotFoundException;
import com.educonnect.assessment.exception.BadRequestException;
import com.educonnect.assessment.repository.ContestRepository;
import com.educonnect.assessment.repository.ContestParticipationRepository;
import com.educonnect.assessment.repository.QuestionRepository;
import com.educonnect.assessment.repository.UserSubmissionRepository;
import com.educonnect.assessment.service.ContestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
@Transactional
public class ContestServiceImpl implements ContestService {

    @Autowired
    private ContestRepository contestRepository;

    @Autowired
    private ContestParticipationRepository contestParticipationRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserSubmissionRepository userSubmissionRepository;

    @Override
    public PagedResponse<Contest> getAllContests(int page, int size, ContestStatus status, ContestType type) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("startTime").descending());
        Page<Contest> contestPage;

        if (status != null && type != null) {
            contestPage = contestRepository.findByStatusAndType(status, type, pageable);
        } else if (status != null) {
            contestPage = contestRepository.findByStatus(status, pageable);
        } else if (type != null) {
            contestPage = contestRepository.findByType(type, pageable);
        } else {
            contestPage = contestRepository.findAll(pageable);
        }

        return new PagedResponse<>(
                contestPage.getContent(),
                (int) contestPage.getTotalElements(),
                contestPage.getTotalPages(),
                contestPage.getNumber(),
                contestPage.getSize()
        );
    }

    @Override
    public List<Contest> getPublicContests() {
        return contestRepository.findPublicContests();
    }

    @Override
    public Map<String, Object> getContestDetails(Long contestId) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new ResourceNotFoundException("Contest not found with id: " + contestId));

        Map<String, Object> details = new HashMap<>();
        details.put("contest", contest);
        details.put("questionsCount", contest.getProblemIds() != null ? contest.getProblemIds().size() : 0);
        details.put("timeRemaining", calculateTimeRemaining(contest));
        details.put("canParticipate", canParticipateInContest(contest));

        return details;
    }

    @Override
    public List<Question> getContestQuestions(Long contestId) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new ResourceNotFoundException("Contest not found with id: " + contestId));

        // Check if contest is active and user can participate
        if (!canParticipateInContest(contest)) {
            throw new BadRequestException("Contest is not active or you cannot participate");
        }

        if (contest.getProblemIds() == null || contest.getProblemIds().isEmpty()) {
            return new ArrayList<>();
        }

        try {
            List<Question> questions = questionRepository.findAllById(contest.getProblemIds());
            // Filter out any null questions and log missing ones
            if (questions.size() != contest.getProblemIds().size()) {
                System.out.println("Warning: Some contest questions were not found. Expected: " + 
                    contest.getProblemIds().size() + ", Found: " + questions.size());
            }
            return questions;
        } catch (Exception e) {
            System.err.println("Error loading contest questions: " + e.getMessage());
            throw new BadRequestException("Failed to load contest questions");
        }
    }

    @Override
    public Map<String, Object> submitContestAnswer(Long contestId, Long questionId, Long userId, 
                                                 String answer, Integer timeTaken, String explanation) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new ResourceNotFoundException("Contest not found with id: " + contestId));

        // Validate contest state and timing
        if (!canSubmitToContest(contest)) {
            throw new BadRequestException("Contest is not active or time has expired");
        }

        // Check if question belongs to contest
        if (contest.getProblemIds() == null || !contest.getProblemIds().contains(questionId)) {
            throw new BadRequestException("Question does not belong to this contest");
        }

        // Check if user already submitted for this question in this contest
        UserSubmission existingSubmission = userSubmissionRepository.findByUserIdAndQuestionIdAndContestId(userId, questionId, contestId);
        
        UserSubmission submission;
        if (existingSubmission != null) {
            // Update existing submission (allow multiple updates during contest)
            submission = existingSubmission;
            submission.setAnswer(answer);
            submission.setTimeTaken(timeTaken);
            submission.setExplanation(explanation);
            submission.setSubmittedAt(LocalDateTime.now()); // Update submission time
        } else {
            // Create new submission
            submission = new UserSubmission();
            submission.setUserId(userId);
            submission.setQuestionId(questionId);
            submission.setContestId(contestId);
            submission.setAnswer(answer);
            submission.setTimeTaken(timeTaken);
            submission.setExplanation(explanation);
            submission.setIsDailyQuestion(false);
        }

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));

        // Set common submission properties for silent processing (no immediate feedback)
        submission.setSubmissionStatus(ExamSubmissionStatus.DRAFT); // Store as draft during contest
        submission.setIsMarksCalculated(false); // Don't calculate marks until contest ends

        // Don't calculate correct answer or points during active contest
        submission.setIsCorrect(false); // Will be calculated when contest ends
        submission.setPointsEarned(0); // Will be calculated when contest ends

        userSubmissionRepository.save(submission);

        // Mark user as having completed the contest (participated by submitting at least one answer)
        Optional<ContestParticipation> participationOpt = 
            contestParticipationRepository.findByUserIdAndContestId(userId, contestId);
        
        if (participationOpt.isPresent() && !participationOpt.get().getHasCompleted()) {
            ContestParticipation participation = participationOpt.get();
            participation.setHasCompleted(true);
            // Don't set completion time yet - only when user clicks "End Contest" or contest auto-ends
            contestParticipationRepository.save(participation);
        }

        // Return minimal response without revealing answers
        Map<String, Object> result = new HashMap<>();
        result.put("status", "submitted");
        result.put("submissionId", submission.getId());
        result.put("message", existingSubmission != null ? "Answer updated successfully" : "Answer submitted successfully");
        result.put("contestActive", true);
        result.put("isUpdate", existingSubmission != null);
        
        return result;
    }

    @Override
    public Map<String, Object> joinContest(Long contestId, Long userId) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new ResourceNotFoundException("Contest not found with id: " + contestId));

        if (contest.getStatus() != ContestStatus.UPCOMING && contest.getStatus() != ContestStatus.ACTIVE) {
            throw new BadRequestException("Cannot join contest that has ended");
        }

        // Check if user already joined
        Optional<ContestParticipation> existingParticipation = 
            contestParticipationRepository.findByUserIdAndContestId(userId, contestId);
        
        Map<String, Object> result = new HashMap<>();
        
        if (existingParticipation.isEmpty()) {
            // Create new participation record
            ContestParticipation participation = new ContestParticipation();
            participation.setUserId(userId);
            participation.setContestId(contestId);
            contestParticipationRepository.save(participation);
            
            // Increment participant count
            contest.setParticipants(contest.getParticipants() + 1);
            contestRepository.save(contest);
            
            result.put("alreadyJoined", false);
            result.put("message", "Successfully joined the contest");
        } else {
            ContestParticipation participation = existingParticipation.get();
            result.put("alreadyJoined", true);
            result.put("hasCompleted", participation.getHasCompleted());
            result.put("joinedAt", participation.getJoinedAt());
            result.put("completedAt", participation.getCompletedAt());
            
            if (participation.getHasCompleted()) {
                result.put("message", "You have already completed this contest");
            } else {
                result.put("message", "You are already registered for this contest");
            }
        }
        
        result.put("contestStatus", contest.getStatus());
        return result;
    }

    @Override
    public Map<String, Object> endContestParticipation(Long contestId, Long userId) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new ResourceNotFoundException("Contest not found with id: " + contestId));

        // Check if contest is active and user can participate
        if (!canParticipateInContest(contest)) {
            throw new BadRequestException("Contest is not active");
        }

        // Find user's participation record
        ContestParticipation participation = contestParticipationRepository
                .findByUserIdAndContestId(userId, contestId)
                .orElseThrow(() -> new BadRequestException("User has not joined this contest"));

        if (participation.getHasCompleted()) {
            throw new BadRequestException("Contest already completed by user");
        }

        // Mark as completed
        participation.setCompletedAt(LocalDateTime.now());
        participation.setHasCompleted(true);
        contestParticipationRepository.save(participation);

        Map<String, Object> result = new HashMap<>();
        result.put("message", "Contest completed successfully");
        result.put("completedAt", participation.getCompletedAt());
        result.put("contestId", contestId);
        result.put("userId", userId);
        
        return result;
    }

    @Override
    public Map<String, Object> getContestLeaderboard(Long contestId, int page, int size) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new ResourceNotFoundException("Contest not found with id: " + contestId));

        // Get leaderboard data
        List<Map<String, Object>> leaderboard = userSubmissionRepository.getContestLeaderboard(contestId, PageRequest.of(page, size));

        Map<String, Object> result = new HashMap<>();
        result.put("contest", contest);
        result.put("leaderboard", leaderboard);
        result.put("totalParticipants", contest.getParticipants());

        return result;
    }

    @Override
    public Map<String, Object> getContestResults(Long contestId) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new ResourceNotFoundException("Contest not found with id: " + contestId));

        if (contest.getStatus() != ContestStatus.COMPLETED) {
            throw new BadRequestException("Contest results are only available after completion");
        }

        // Get full leaderboard
        List<Map<String, Object>> leaderboard = userSubmissionRepository.getContestLeaderboard(contestId, Pageable.unpaged());

        Map<String, Object> result = new HashMap<>();
        result.put("contest", contest);
        result.put("finalLeaderboard", leaderboard);
        result.put("totalParticipants", contest.getParticipants());
        result.put("totalQuestions", contest.getProblemIds() != null ? contest.getProblemIds().size() : 0);

        return result;
    }

    @Override
    public List<UserSubmission> getUserContestSubmissions(Long contestId, Long userId) {
        return userSubmissionRepository.findByUserIdAndContestIdOrderBySubmittedAtDesc(userId, contestId);
    }

    @Override
    public PagedResponse<UserSubmission> getUserContestSubmissions(Long userId, int page, int size, ContestStatus contestStatus) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("submittedAt").descending());
        Page<UserSubmission> submissionPage;

        if (contestStatus != null) {
            submissionPage = userSubmissionRepository.findByUserIdAndContestIdIsNotNullAndContestStatus(userId, contestStatus, pageable);
        } else {
            submissionPage = userSubmissionRepository.findByUserIdAndContestIdIsNotNull(userId, pageable);
        }

        return new PagedResponse<>(
                submissionPage.getContent(),
                (int) submissionPage.getTotalElements(),
                submissionPage.getTotalPages(),
                submissionPage.getNumber(),
                submissionPage.getSize()
        );
    }

    @Override
    public Contest createContest(ContestController.ContestRequest request) {
        Contest contest = new Contest();
        contest.setTitle(request.getTitle());
        contest.setDescription(request.getDescription());
        contest.setType(request.getType());
        contest.setStartTime(request.getStartTime());
        contest.setEndTime(request.getEndTime());
        contest.setDuration(request.getDuration());
        contest.setProblemIds(request.getProblemIds());
        contest.setPrizes(request.getPrizes());
        contest.setRules(request.getRules());
        contest.setStatus(ContestStatus.UPCOMING);

        return contestRepository.save(contest);
    }

    @Override
    public Contest updateContest(Long contestId, ContestController.ContestRequest request) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new ResourceNotFoundException("Contest not found with id: " + contestId));

        if (contest.getStatus() == ContestStatus.ACTIVE) {
            throw new BadRequestException("Cannot update active contest");
        }

        contest.setTitle(request.getTitle());
        contest.setDescription(request.getDescription());
        contest.setType(request.getType());
        contest.setStartTime(request.getStartTime());
        contest.setEndTime(request.getEndTime());
        contest.setDuration(request.getDuration());
        contest.setProblemIds(request.getProblemIds());
        contest.setPrizes(request.getPrizes());
        contest.setRules(request.getRules());

        return contestRepository.save(contest);
    }

    @Override
    public void deleteContest(Long contestId) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new ResourceNotFoundException("Contest not found with id: " + contestId));

        if (contest.getStatus() == ContestStatus.ACTIVE) {
            throw new BadRequestException("Cannot delete active contest");
        }

        contestRepository.delete(contest);
    }

    @Override
    public void startContest(Long contestId) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new ResourceNotFoundException("Contest not found with id: " + contestId));

        if (contest.getStatus() != ContestStatus.UPCOMING) {
            throw new BadRequestException("Only upcoming contests can be started");
        }

        contest.setStatus(ContestStatus.ACTIVE);
        contestRepository.save(contest);
    }

    @Override
    public void endContest(Long contestId) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new ResourceNotFoundException("Contest not found with id: " + contestId));

        if (contest.getStatus() != ContestStatus.ACTIVE) {
            throw new BadRequestException("Only active contests can be ended");
        }

        contest.setStatus(ContestStatus.COMPLETED);
        contestRepository.save(contest);
    }

    // Helper methods
    private long calculateTimeRemaining(Contest contest) {
        if (contest.getStatus() != ContestStatus.ACTIVE) {
            return 0;
        }
        return Math.max(0, java.time.Duration.between(LocalDateTime.now(), contest.getEndTime()).toSeconds());
    }

    private boolean canParticipateInContest(Contest contest) {
        LocalDateTime now = LocalDateTime.now();
        // Allow participation if time is within contest window, regardless of status
        // This handles cases where status hasn't been automatically updated
        boolean timeIsValid = now.isAfter(contest.getStartTime()) && now.isBefore(contest.getEndTime());
        boolean statusAllowsParticipation = contest.getStatus() == ContestStatus.ACTIVE || 
                                          (contest.getStatus() == ContestStatus.UPCOMING && timeIsValid);
        
        // Debug logging
        System.out.println("Contest participation check - Now: " + now + 
                          ", Start: " + contest.getStartTime() + 
                          ", End: " + contest.getEndTime() + 
                          ", Status: " + contest.getStatus() + 
                          ", TimeValid: " + timeIsValid + 
                          ", StatusAllows: " + statusAllowsParticipation);
        
        return statusAllowsParticipation && timeIsValid;
    }

    private boolean canSubmitToContest(Contest contest) {
        return canParticipateInContest(contest);
    }

    @Override
    public void finalizeContestSubmissions(Long contestId) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new ResourceNotFoundException("Contest not found with id: " + contestId));

        // Find all draft submissions for this contest
        List<UserSubmission> draftSubmissions = userSubmissionRepository.findByContestIdAndSubmissionStatus(
                contestId, ExamSubmissionStatus.DRAFT);

        for (UserSubmission submission : draftSubmissions) {
            Question question = questionRepository.findById(submission.getQuestionId())
                    .orElse(null);

            if (question != null) {
                // Calculate if answer is correct
                boolean isCorrect = checkAnswer(question, submission.getAnswer());
                int pointsEarned = isCorrect ? question.getPoints() : 0;

                // Update submission with calculated results
                submission.setIsCorrect(isCorrect);
                submission.setPointsEarned(pointsEarned);
                submission.setSubmissionStatus(ExamSubmissionStatus.FINALIZED);
                submission.setIsMarksCalculated(true);
                submission.setFinalizedAt(LocalDateTime.now());

                userSubmissionRepository.save(submission);
            }
        }

        // Update contest participations for users who submitted at least one question
        // Set hasCompleted = true and completedAt = contest end time (if not already set)
        List<Long> userIdsWithSubmissions = draftSubmissions.stream()
                .map(UserSubmission::getUserId)
                .distinct()
                .collect(Collectors.toList());

        for (Long userId : userIdsWithSubmissions) {
            Optional<ContestParticipation> participationOpt = 
                contestParticipationRepository.findByUserIdAndContestId(userId, contestId);
            
            if (participationOpt.isPresent()) {
                ContestParticipation participation = participationOpt.get();
                participation.setHasCompleted(true);
                
                // Set completion time to contest end time if not already set (user didn't click "End Contest")
                if (participation.getCompletedAt() == null) {
                    participation.setCompletedAt(contest.getEndTime());
                }
                
                contestParticipationRepository.save(participation);
            }
        }
    }

    private boolean checkAnswer(Question question, String userAnswer) {
        if (question.getCorrectAnswer() == null || userAnswer == null) {
            return false;
        }

        String correctAnswer = question.getCorrectAnswer().trim().toLowerCase();
        String providedAnswer = userAnswer.trim().toLowerCase();

        return correctAnswer.equals(providedAnswer);
    }
}