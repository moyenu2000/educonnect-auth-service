package com.educonnect.assessment.service.impl;

import com.educonnect.assessment.controller.ContestController;
import com.educonnect.assessment.dto.PagedResponse;
import com.educonnect.assessment.entity.Contest;
import com.educonnect.assessment.entity.Question;
import com.educonnect.assessment.entity.UserSubmission;
import com.educonnect.assessment.enums.ContestStatus;
import com.educonnect.assessment.enums.ContestType;
import com.educonnect.assessment.exception.ResourceNotFoundException;
import com.educonnect.assessment.exception.BadRequestException;
import com.educonnect.assessment.repository.ContestRepository;
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

@Service
@Transactional
public class ContestServiceImpl implements ContestService {

    @Autowired
    private ContestRepository contestRepository;

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

        return questionRepository.findAllById(contest.getProblemIds());
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
        boolean alreadySubmitted = userSubmissionRepository.existsByUserIdAndQuestionIdAndContestId(userId, questionId, contestId);
        if (alreadySubmitted) {
            throw new BadRequestException("You have already submitted an answer for this question");
        }

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));

        // Create submission
        UserSubmission submission = new UserSubmission();
        submission.setUserId(userId);
        submission.setQuestionId(questionId);
        submission.setContestId(contestId);
        submission.setAnswer(answer);
        submission.setTimeTaken(timeTaken);
        submission.setExplanation(explanation);
        submission.setIsDailyQuestion(false);

        // Check if answer is correct
        boolean isCorrect = question.getCorrectAnswer().equals(answer);
        submission.setIsCorrect(isCorrect);
        submission.setPointsEarned(isCorrect ? question.getPoints() : 0);

        userSubmissionRepository.save(submission);

        Map<String, Object> result = new HashMap<>();
        result.put("isCorrect", isCorrect);
        result.put("pointsEarned", submission.getPointsEarned());
        result.put("correctAnswer", question.getCorrectAnswer());
        result.put("explanation", question.getExplanation());

        return result;
    }

    @Override
    public void joinContest(Long contestId, Long userId) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new ResourceNotFoundException("Contest not found with id: " + contestId));

        if (contest.getStatus() != ContestStatus.UPCOMING && contest.getStatus() != ContestStatus.ACTIVE) {
            throw new BadRequestException("Cannot join contest that has ended");
        }

        // For now, we just increment participant count
        // In a real implementation, you might want a separate ContestParticipant entity
        contest.setParticipants(contest.getParticipants() + 1);
        contestRepository.save(contest);
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
        return contest.getStatus() == ContestStatus.ACTIVE && 
               now.isAfter(contest.getStartTime()) && 
               now.isBefore(contest.getEndTime());
    }

    private boolean canSubmitToContest(Contest contest) {
        return canParticipateInContest(contest);
    }
}