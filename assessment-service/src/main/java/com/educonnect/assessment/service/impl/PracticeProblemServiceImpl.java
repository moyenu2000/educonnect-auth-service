package com.educonnect.assessment.service.impl;

import com.educonnect.assessment.dto.*;
import com.educonnect.assessment.dto.QuestionOption;
import com.educonnect.assessment.entity.*;
import com.educonnect.assessment.enums.Difficulty;
import com.educonnect.assessment.enums.ProblemStatus;
import com.educonnect.assessment.enums.QuestionType;
import com.educonnect.assessment.exception.BadRequestException;
import com.educonnect.assessment.exception.ResourceNotFoundException;
import com.educonnect.assessment.repository.*;
import com.educonnect.assessment.service.PracticeProblemService;
import com.educonnect.assessment.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@Transactional
public class PracticeProblemServiceImpl implements PracticeProblemService {

    @Autowired
    private PracticeProblemRepository practiceProblemRepository;

    @Autowired
    private ProblemSubmissionRepository problemSubmissionRepository;

    @Autowired
    private ProblemBookmarkRepository problemBookmarkRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuestionService questionService;

    @Override
    @Transactional(readOnly = true)
    public Page<PracticeProblemDto> getProblems(Long subjectId, Long topicId, Difficulty difficulty,
                                               QuestionType type, ProblemStatus status, String search,
                                               Long userId, Pageable pageable) {
        Page<PracticeProblem> problemPage;

        // Apply filters
        problemPage = practiceProblemRepository.findFilteredProblems(subjectId, topicId, difficulty, type, pageable);

        // Convert to DTOs with user-specific data
        List<PracticeProblemDto> problemDtos = problemPage.getContent().stream()
                .map(problem -> convertToDto(problem, userId))
                .collect(Collectors.toList());

        // Filter by status if provided
        if (status != null) {
            problemDtos = problemDtos.stream()
                    .filter(dto -> status.equals(dto.getStatus()))
                    .collect(Collectors.toList());
        }

        return new PageImpl<>(problemDtos, pageable, problemPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public PracticeProblemDto getProblemById(Long problemId, Long userId) {
        PracticeProblem problem = practiceProblemRepository.findByIdAndIsActiveTrue(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Practice problem not found with ID: " + problemId));

        return convertToDto(problem, userId);
    }

    @Override
    public ProblemSubmissionResponse submitSolution(Long problemId, ProblemSubmissionRequest request, Long userId) {
        PracticeProblem problem = practiceProblemRepository.findByIdAndIsActiveTrue(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Practice problem not found with ID: " + problemId));

        Question question = questionRepository.findByIdAndIsActiveTrue(problem.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        // Check if answer is correct
        boolean isCorrect = checkAnswer(question, request.getAnswer());

        // Calculate points earned
        int pointsEarned = 0;
        if (isCorrect) {
            pointsEarned = problem.getPoints();
            
            // Deduct points for hints used
            List<ProblemSubmission> previousSubmissions = problemSubmissionRepository
                    .findByUserIdAndProblemId(userId, problemId);
            int totalHintsUsed = previousSubmissions.stream()
                    .mapToInt(ProblemSubmission::getHintsUsed)
                    .sum();
            
            // Deduct 20% of points for each hint used
            pointsEarned = Math.max(1, pointsEarned - (totalHintsUsed * (problem.getPoints() / 5)));
        }

        // Create submission record
        ProblemSubmission submission = new ProblemSubmission();
        submission.setUserId(userId);
        submission.setProblemId(problemId);
        submission.setAnswer(request.getAnswer());
        submission.setIsCorrect(isCorrect);
        submission.setTimeTaken(request.getTimeTaken());
        submission.setWorkingSteps(request.getWorkingSteps());
        submission.setPointsEarned(pointsEarned);
        submission.setStatus(isCorrect ? ProblemStatus.SOLVED : ProblemStatus.ATTEMPTED);

        problemSubmissionRepository.save(submission);

        // Prepare response
        ProblemSubmissionResponse response = new ProblemSubmissionResponse();
        response.setCorrect(isCorrect);
        response.setCorrectAnswer(question.getCorrectAnswer());
        response.setExplanation(question.getExplanation());
        response.setPoints(pointsEarned);
        
        if (!isCorrect && problem.getHints() != null && !problem.getHints().isEmpty()) {
            response.setHints(problem.getHints().subList(0, Math.min(1, problem.getHints().size())));
        }

        // Get similar problems
        if (problem.getSimilarProblems() != null && !problem.getSimilarProblems().isEmpty()) {
            List<PracticeProblem> similarProblems = practiceProblemRepository.findByIdIn(problem.getSimilarProblems());
            response.setSimilarProblems(similarProblems.stream()
                    .map(p -> convertToDto(p, userId))
                    .collect(Collectors.toList()));
        }

        return response;
    }

    @Override
    public HintResponse getHint(Long problemId, Integer hintLevel, Long userId) {
        PracticeProblem problem = practiceProblemRepository.findByIdAndIsActiveTrue(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Practice problem not found with ID: " + problemId));

        if (problem.getHints() == null || problem.getHints().isEmpty()) {
            throw new BadRequestException("No hints available for this problem");
        }

        int level = (hintLevel != null) ? hintLevel - 1 : 0; // Convert to 0-based index
        if (level < 0 || level >= problem.getHints().size()) {
            throw new BadRequestException("Invalid hint level");
        }

        // Calculate points deduction (20% of total points per hint)
        int pointsDeducted = problem.getPoints() / 5;

        HintResponse response = new HintResponse();
        response.setHint(problem.getHints().get(level));
        response.setLevel(level + 1); // Convert back to 1-based
        response.setPointsDeducted(pointsDeducted);

        return response;
    }

    @Override
    public ApiResponse<Boolean> toggleBookmark(Long problemId, Long userId) {
        // Check if problem exists
        practiceProblemRepository.findByIdAndIsActiveTrue(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Practice problem not found with ID: " + problemId));

        Optional<ProblemBookmark> existingBookmark = problemBookmarkRepository.findByUserIdAndProblemId(userId, problemId);

        boolean bookmarked;
        if (existingBookmark.isPresent()) {
            problemBookmarkRepository.delete(existingBookmark.get());
            bookmarked = false;
        } else {
            ProblemBookmark bookmark = new ProblemBookmark();
            bookmark.setUserId(userId);
            bookmark.setProblemId(problemId);
            problemBookmarkRepository.save(bookmark);
            bookmarked = true;
        }

        Map<String, Object> data = new HashMap<>();
        data.put("bookmarked", bookmarked);

        return new ApiResponse<>(true, bookmarked, bookmarked ? "Problem bookmarked successfully" : "Bookmark removed successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PracticeProblemDto> getRecommendations(Integer count, Long subjectId, Difficulty difficulty, Long userId, Pageable pageable) {
        // Get user's solved problems to avoid recommending them
        List<Long> solvedProblemIds = problemSubmissionRepository.findByUserId(userId, PageRequest.of(0, 1000))
                .getContent().stream()
                .filter(submission -> submission.getIsCorrect())
                .map(ProblemSubmission::getProblemId)
                .collect(Collectors.toList());

        Page<PracticeProblem> recommendedProblems;

        if (subjectId != null && difficulty != null) {
            recommendedProblems = practiceProblemRepository.findRandomProblemsBySubjectAndDifficulty(subjectId, difficulty, pageable);
        } else if (subjectId != null) {
            List<PracticeProblem> problems = practiceProblemRepository.findRandomProblemsBySubject(subjectId, count != null ? count : 10);
            recommendedProblems = new PageImpl<>(problems, pageable, problems.size());
        } else {
            recommendedProblems = practiceProblemRepository.findByIsActiveTrue(pageable);
        }

        // Filter out solved problems
        List<PracticeProblemDto> recommendations = recommendedProblems.getContent().stream()
                .filter(problem -> !solvedProblemIds.contains(problem.getId()))
                .map(problem -> convertToDto(problem, userId))
                .collect(Collectors.toList());

        return new PageImpl<>(recommendations, pageable, recommendations.size());
    }

    @Override
    @Transactional(readOnly = true)
    public PracticeProblemDto convertToDto(PracticeProblem problem, Long userId) {
        PracticeProblemDto dto = new PracticeProblemDto();
        dto.setId(problem.getId());
        
        // Convert Question entity to QuestionResponse DTO to avoid serialization issues
        Question question = questionRepository.findByIdAndIsActiveTrue(problem.getQuestionId())
                .orElse(null);
        if (question != null) {
            try {
                QuestionResponse questionResponse = questionService.convertToResponse(question);
                dto.setQuestion(questionResponse);
            } catch (Exception e) {
                // If there's an issue with question conversion, create a minimal response
                QuestionResponse minimalResponse = new QuestionResponse();
                minimalResponse.setId(question.getId());
                minimalResponse.setText(question.getText());
                minimalResponse.setType(question.getType());
                minimalResponse.setDifficulty(question.getDifficulty());
                minimalResponse.setPoints(question.getPoints());
                if (question.getOptions() != null) {
                    List<com.educonnect.assessment.dto.QuestionOption> optionsWithIds = question.getOptions().stream()
                            .map(option -> new com.educonnect.assessment.dto.QuestionOption(option.getId(), option.getText()))
                            .collect(Collectors.toList());
                    minimalResponse.setOptions(optionsWithIds);
                }
                dto.setQuestion(minimalResponse);
            }
        }
        
        dto.setDifficulty(problem.getDifficulty());
        dto.setTopicId(problem.getTopicId());
        dto.setSubjectId(problem.getSubjectId());
        dto.setType(problem.getType());
        dto.setPoints(problem.getPoints());
        dto.setHints(problem.getHints());
        dto.setSimilarProblems(problem.getSimilarProblems());
        dto.setCreatedAt(problem.getCreatedAt());

        if (userId != null) {
            // Check if user has solved this problem
            boolean solved = problemSubmissionRepository.existsByUserIdAndProblemIdAndIsCorrectTrue(userId, problem.getId());
            dto.setSolved(solved);

            // Count attempts
            List<ProblemSubmission> submissions = problemSubmissionRepository.findByUserIdAndProblemId(userId, problem.getId());
            dto.setAttempts(submissions.size());

            // Check if bookmarked
            boolean bookmarked = problemBookmarkRepository.existsByUserIdAndProblemId(userId, problem.getId());
            dto.setBookmarked(bookmarked);

            // Set status based on user interaction
            if (solved) {
                dto.setStatus(ProblemStatus.SOLVED);
            } else if (!submissions.isEmpty()) {
                dto.setStatus(ProblemStatus.ATTEMPTED);
            } else if (bookmarked) {
                dto.setStatus(ProblemStatus.BOOKMARKED);
            } else {
                dto.setStatus(ProblemStatus.UNSOLVED);
            }
        } else {
            dto.setStatus(ProblemStatus.UNSOLVED);
            dto.setSolved(false);
            dto.setAttempts(0);
            dto.setBookmarked(false);
        }

        return dto;
    }

    @Override
    public void createProblemFromQuestion(Long questionId) {
        Question question = questionRepository.findByIdAndIsActiveTrue(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with ID: " + questionId));

        PracticeProblem problem = new PracticeProblem();
        problem.setQuestionId(questionId);
        problem.setDifficulty(question.getDifficulty());
        problem.setTopicId(question.getTopicId());
        problem.setSubjectId(question.getSubjectId());
        problem.setType(question.getType());
        problem.setPoints(question.getPoints());

        practiceProblemRepository.save(problem);
    }

    @Override
    public void createProblemFromQuestionWithDetails(Long questionId, String hintText, Integer hintLevel, String solutionSteps) {
        Question question = questionRepository.findByIdAndIsActiveTrue(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with ID: " + questionId));

        // Check if practice problem already exists for this question
        if (practiceProblemRepository.existsByQuestionId(questionId)) {
            throw new BadRequestException("Practice problem already exists for question ID: " + questionId);
        }

        PracticeProblem problem = new PracticeProblem();
        problem.setQuestionId(questionId);
        problem.setDifficulty(question.getDifficulty());
        problem.setTopicId(question.getTopicId());
        problem.setSubjectId(question.getSubjectId());
        problem.setType(question.getType());
        problem.setPoints(question.getPoints());
        
        // Set custom hint and solution details
        problem.setHintText(hintText);
        problem.setHintLevel(hintLevel != null ? hintLevel : 1);
        problem.setSolutionSteps(solutionSteps);

        practiceProblemRepository.save(problem);
    }

    @Override
    public void updateProblemDifficulty(Long problemId, Difficulty difficulty) {
        PracticeProblem problem = practiceProblemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Practice problem not found with ID: " + problemId));

        problem.setDifficulty(difficulty);
        practiceProblemRepository.save(problem);
    }

    private boolean checkAnswer(Question question, String userAnswer) {
        if (question.getCorrectAnswer() == null || userAnswer == null) {
            return false;
        }

        String correctAnswer = question.getCorrectAnswer().trim().toLowerCase();
        String providedAnswer = userAnswer.trim().toLowerCase();

        return correctAnswer.equals(providedAnswer);
    }

    // Admin management methods implementation
    @Override
    public PracticeProblemDto createPracticeProblem(Long questionId, Integer customPoints, Difficulty customDifficulty, 
                                                  String hintText, List<String> hints, String solutionSteps) {
        Question question = questionRepository.findByIdAndIsActiveTrue(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with ID: " + questionId));

        // Check if practice problem already exists for this question
        if (practiceProblemRepository.existsByQuestionId(questionId)) {
            throw new BadRequestException("Practice problem already exists for question ID: " + questionId);
        }

        PracticeProblem problem = new PracticeProblem();
        problem.setQuestionId(questionId);
        problem.setDifficulty(customDifficulty != null ? customDifficulty : question.getDifficulty());
        problem.setTopicId(question.getTopicId());
        problem.setSubjectId(question.getSubjectId());
        problem.setType(question.getType());
        problem.setPoints(customPoints != null ? customPoints : question.getPoints());
        
        // Set custom practice problem details
        problem.setHintText(hintText);
        problem.setHints(hints);
        problem.setSolutionSteps(solutionSteps);

        problem = practiceProblemRepository.save(problem);
        return convertToDto(problem, null);
    }

    @Override
    public PracticeProblemDto updatePracticeProblem(Long problemId, Integer customPoints, Difficulty customDifficulty, 
                                                  String hintText, List<String> hints, String solutionSteps) {
        PracticeProblem problem = practiceProblemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Practice problem not found with ID: " + problemId));

        // Update fields if provided
        if (customPoints != null) {
            problem.setPoints(customPoints);
        }
        if (customDifficulty != null) {
            problem.setDifficulty(customDifficulty);
        }
        if (hintText != null) {
            problem.setHintText(hintText);
        }
        if (hints != null) {
            problem.setHints(hints);
        }
        if (solutionSteps != null) {
            problem.setSolutionSteps(solutionSteps);
        }

        problem = practiceProblemRepository.save(problem);
        return convertToDto(problem, null);
    }

    @Override
    public void deletePracticeProblem(Long problemId) {
        PracticeProblem problem = practiceProblemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Practice problem not found with ID: " + problemId));
        
        // Soft delete by setting isActive to false
        problem.setIsActive(false);
        practiceProblemRepository.save(problem);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PracticeProblemDto> getAllProblemsForAdmin(Long subjectId, Long topicId, Difficulty difficulty, 
                                                         String search, Pageable pageable) {
        String difficultyStr = difficulty != null ? difficulty.name() : null;
        Page<PracticeProblem> problemPage = practiceProblemRepository.findActiveProblemsWithFilters(
                subjectId, topicId, difficultyStr, search, pageable);

        return problemPage.map(problem -> convertToDto(problem, null));
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isPracticeQuestion(Long questionId) {
        return practiceProblemRepository.existsByQuestionIdAndIsActive(questionId, true);
    }

    @Override
    public List<PracticeProblemDto> bulkCreateFromQuestions(List<Long> questionIds, Integer defaultPoints, 
                                                          Difficulty defaultDifficulty) {
        List<PracticeProblemDto> createdProblems = new ArrayList<>();
        
        for (Long questionId : questionIds) {
            try {
                // Skip if already exists
                if (!practiceProblemRepository.existsByQuestionId(questionId)) {
                    Question question = questionRepository.findByIdAndIsActiveTrue(questionId)
                            .orElse(null);
                    
                    if (question != null) {
                        PracticeProblem problem = new PracticeProblem();
                        problem.setQuestionId(questionId);
                        problem.setDifficulty(defaultDifficulty != null ? defaultDifficulty : question.getDifficulty());
                        problem.setTopicId(question.getTopicId());
                        problem.setSubjectId(question.getSubjectId());
                        problem.setType(question.getType());
                        problem.setPoints(defaultPoints != null ? defaultPoints : question.getPoints());

                        problem = practiceProblemRepository.save(problem);
                        createdProblems.add(convertToDto(problem, null));
                    }
                }
            } catch (Exception e) {
                // Log error but continue with other questions
                System.err.println("Failed to create practice problem for question ID: " + questionId + 
                                 ". Error: " + e.getMessage());
            }
        }
        
        return createdProblems;
    }

    @Override
    public void activateDeactivateProblem(Long problemId, Boolean isActive) {
        PracticeProblem problem = practiceProblemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Practice problem not found with ID: " + problemId));
        
        problem.setIsActive(isActive);
        practiceProblemRepository.save(problem);
    }
}