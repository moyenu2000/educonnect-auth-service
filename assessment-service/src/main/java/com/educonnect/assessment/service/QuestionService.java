
package com.educonnect.assessment.service;

import com.educonnect.assessment.dto.PagedResponse;
import com.educonnect.assessment.dto.QuestionRequest;
import com.educonnect.assessment.dto.QuestionResponse;
import com.educonnect.assessment.dto.QuestionOption;
import com.educonnect.assessment.entity.Question;
import com.educonnect.assessment.enums.Difficulty;
import com.educonnect.assessment.enums.QuestionType;
import com.educonnect.assessment.exception.ResourceNotFoundException;
import com.educonnect.assessment.repository.QuestionRepository;
import com.educonnect.assessment.repository.QuestionOptionRepository;
import com.educonnect.assessment.repository.SubjectRepository;
import com.educonnect.assessment.repository.TopicRepository;
import com.educonnect.assessment.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@Transactional
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuestionOptionRepository questionOptionRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private PracticeProblemService practiceProblemService;

    public PagedResponse<Question> getAllQuestions(int page, int size, Long subjectId, Long topicId, 
                                                 Difficulty difficulty, QuestionType type, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        Page<Question> questions = questionRepository.findFilteredQuestions(
                subjectId, topicId, difficulty, type, search, pageable);

        return new PagedResponse<>(
                questions.getContent(),
                (int) questions.getTotalElements(),
                questions.getTotalPages(),
                questions.getNumber(),
                questions.getSize()
        );
    }

    public Map<String, Object> getQuestionsWithFilters(int page, int size, Long subjectId, Long topicId, 
                                                      Difficulty difficulty, QuestionType type, String search) {
        PagedResponse<Question> pagedQuestions = getAllQuestions(page, size, subjectId, topicId, difficulty, type, search);
        
        Map<String, Object> filters = new HashMap<>();
        filters.put("difficulties", Difficulty.values());
        filters.put("types", QuestionType.values());
        
        Map<String, Object> result = new HashMap<>();
        result.put("questions", pagedQuestions.getContent());
        result.put("totalElements", pagedQuestions.getTotalElements());
        result.put("totalPages", pagedQuestions.getTotalPages());
        result.put("filters", filters);
        
        return result;
    }

    @Transactional(readOnly = true)
    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Question getActiveQuestionById(Long id) {
        return questionRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Active question not found with id: " + id));
    }

    public Question createQuestion(QuestionRequest request) {
        // Verify subject exists
        if (!subjectRepository.existsById(request.getSubjectId())) {
            throw new ResourceNotFoundException("Subject not found with id: " + request.getSubjectId());
        }

        // Verify topic exists if provided
        if (request.getTopicId() != null && !topicRepository.existsById(request.getTopicId())) {
            throw new ResourceNotFoundException("Topic not found with id: " + request.getTopicId());
        }

        Long currentUserId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("User must be authenticated to create questions"));

        Question question = new Question();
        question.setText(request.getText());
        question.setType(request.getType());
        question.setSubjectId(request.getSubjectId());
        question.setTopicId(request.getTopicId());
        question.setDifficulty(request.getDifficulty());
        
        // Remove previous options and add new ones
        question.setOptions(null);
        
        // Set correct answer based on question type
        question.setCorrectAnswerOptionId(request.getCorrectAnswerOptionId());
        question.setCorrectAnswerText(request.getCorrectAnswerText());
        question.setExplanation(request.getExplanation());
        question.setPoints(request.getPoints());
        question.setTags(request.getTags());
        question.setAttachments(request.getAttachments());
        question.setCreatedBy(currentUserId);

        Question savedQuestion = questionRepository.save(question);
        
        // Handle options for MCQ after saving the question to get the ID
        if (request.getOptions() != null && !request.getOptions().isEmpty()) {
            final Long questionId = savedQuestion.getId();
            List<com.educonnect.assessment.entity.QuestionOption> questionOptions = request.getOptions().stream()
                .map(optionRequest -> new com.educonnect.assessment.entity.QuestionOption(
                    questionId,
                    optionRequest.getText(),
                    optionRequest.getOptionOrder()
                ))
                .collect(Collectors.toList());
            savedQuestion.setOptions(questionOptions);
            savedQuestion = questionRepository.save(savedQuestion);
            
            // Set correct answer option ID based on correctAnswerText
            if (request.getCorrectAnswerText() != null && !request.getCorrectAnswerText().isEmpty()) {
                for (com.educonnect.assessment.entity.QuestionOption option : savedQuestion.getOptions()) {
                    if (option.getText().equals(request.getCorrectAnswerText())) {
                        savedQuestion.setCorrectAnswerOptionId(option.getId());
                        savedQuestion.setCorrectAnswerText(null); // Clear text since we have ID now
                        savedQuestion = questionRepository.save(savedQuestion);
                        break;
                    }
                }
            }
        }

        // Create practice problem if requested
        if (request.getCreatePracticeProblem() != null && request.getCreatePracticeProblem()) {
            try {
                practiceProblemService.createProblemFromQuestionWithDetails(
                    savedQuestion.getId(), 
                    request.getHintText(),
                    request.getHintLevel(),
                    request.getSolutionSteps()
                );
            } catch (Exception e) {
                // Log the error but don't fail the question creation
                System.err.println("Failed to create practice problem for question " + savedQuestion.getId() + ": " + e.getMessage());
            }
        }

        return savedQuestion;
    }

    @Transactional
    public Question updateQuestion(Long id, QuestionRequest request) {
        // Verify question exists
        if (!questionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Question not found with id: " + id);
        }

        // Verify subject exists
        if (!subjectRepository.existsById(request.getSubjectId())) {
            throw new ResourceNotFoundException("Subject not found with id: " + request.getSubjectId());
        }

        // Verify topic exists if provided
        if (request.getTopicId() != null && !topicRepository.existsById(request.getTopicId())) {
            throw new ResourceNotFoundException("Topic not found with id: " + request.getTopicId());
        }

        // Delete all existing options manually first
        questionOptionRepository.deleteByQuestionId(id);

        // Update question using native query to avoid Hibernate collection management issues
        questionRepository.updateQuestionDetails(
            id,
            request.getText(),
            request.getType().name(),
            request.getSubjectId(),
            request.getTopicId(),
            request.getDifficulty().name(),
            request.getExplanation(),
            request.getPoints(),
            request.getCorrectAnswerOptionId(),
            request.getCorrectAnswerText()
        );

        // Create new options if provided
        if (request.getOptions() != null && !request.getOptions().isEmpty()) {
            // Create and save options directly to repository
            List<com.educonnect.assessment.entity.QuestionOption> savedOptions = new ArrayList<>();
            for (com.educonnect.assessment.dto.QuestionOptionRequest optionRequest : request.getOptions()) {
                com.educonnect.assessment.entity.QuestionOption option = 
                    new com.educonnect.assessment.entity.QuestionOption(
                        id,
                        optionRequest.getText(),
                        optionRequest.getOptionOrder()
                    );
                com.educonnect.assessment.entity.QuestionOption savedOption = questionOptionRepository.save(option);
                savedOptions.add(savedOption);
            }
            
            // Set correct answer option ID based on correctAnswerText
            if (request.getCorrectAnswerText() != null && !request.getCorrectAnswerText().isEmpty()) {
                for (com.educonnect.assessment.entity.QuestionOption option : savedOptions) {
                    if (option.getText().equals(request.getCorrectAnswerText())) {
                        // Update the correct answer option ID using native query
                        questionRepository.updateQuestionDetails(
                            id,
                            request.getText(),
                            request.getType().name(),
                            request.getSubjectId(),
                            request.getTopicId(),
                            request.getDifficulty().name(),
                            request.getExplanation(),
                            request.getPoints(),
                            option.getId(),
                            null // Clear text since we have ID now
                        );
                        break;
                    }
                }
            }
        }
        
        // Return a minimal question object to avoid Hibernate collection loading issues
        Question result = new Question();
        result.setId(id);
        result.setText(request.getText());
        result.setType(request.getType());
        result.setSubjectId(request.getSubjectId());
        result.setTopicId(request.getTopicId());
        result.setDifficulty(request.getDifficulty());
        result.setExplanation(request.getExplanation());
        result.setPoints(request.getPoints());
        result.setCorrectAnswerText(request.getCorrectAnswerText());
        result.setCorrectAnswerOptionId(request.getCorrectAnswerOptionId());
        
        return result;
    }

    public void deleteQuestion(Long id) {
        Question question = getQuestionById(id);
        questionRepository.delete(question);
    }

    public void deactivateQuestion(Long id) {
        Question question = getQuestionById(id);
        question.setIsActive(false);
        questionRepository.save(question);
    }

    public Map<String, Object> bulkImportQuestions(List<QuestionRequest> questions, Long subjectId, Long topicId) {
        int imported = 0;
        int failed = 0;
        List<String> errors = new java.util.ArrayList<>();

        for (int i = 0; i < questions.size(); i++) {
            try {
                QuestionRequest request = questions.get(i);
                if (request.getSubjectId() == null) {
                    request.setSubjectId(subjectId);
                }
                if (request.getTopicId() == null) {
                    request.setTopicId(topicId);
                }
                createQuestion(request);
                imported++;
            } catch (Exception e) {
                failed++;
                errors.add("Question " + (i + 1) + ": " + e.getMessage());
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("imported", imported);
        result.put("failed", failed);
        result.put("errors", errors);

        return result;
    }

    public List<Question> getRandomQuestions(Long subjectId, Difficulty difficulty, int count) {
        if (difficulty != null) {
            return questionRepository.findRandomQuestionsBySubjectAndDifficulty(subjectId, difficulty, count);
        }
        return questionRepository.findRandomQuestionsBySubject(subjectId, count);
    }

    @Transactional(readOnly = true)
    public List<Question> getPublicDailyQuestions() {
        // Get a few random questions for public viewing
        Pageable pageable = PageRequest.of(0, 5);
        Page<Question> questions = questionRepository.findByIsActiveTrue(pageable);
        return questions.getContent();
    }

    // Conversion methods for DTOs
    public QuestionResponse convertToResponse(Question question) {
        QuestionResponse response = new QuestionResponse();
        response.setId(question.getId());
        response.setText(question.getText());
        response.setType(question.getType());
        response.setSubjectId(question.getSubjectId());
        response.setTopicId(question.getTopicId());
        response.setDifficulty(question.getDifficulty());
        response.setPoints(question.getPoints());
        response.setTags(question.getTags());
        response.setAttachments(question.getAttachments());
        response.setIsActive(question.getIsActive());
        response.setCreatedBy(question.getCreatedBy());
        response.setCreatedAt(question.getCreatedAt());
        response.setUpdatedAt(question.getUpdatedAt());

        // Set correct answer fields
        response.setCorrectAnswerOptionId(question.getCorrectAnswerOptionId());
        response.setCorrectAnswerText(question.getCorrectAnswerText());
        response.setExplanation(question.getExplanation());

        // Convert QuestionOption entities to DTOs
        if (question.getOptions() != null && !question.getOptions().isEmpty()) {
            List<QuestionOption> optionDtos = question.getOptions().stream()
                    .map(option -> new QuestionOption(option.getId(), option.getText()))
                    .collect(Collectors.toList());
            response.setOptions(optionDtos);
        }

        // Add subject and topic names by querying repositories directly to avoid lazy loading issues
        if (question.getSubjectId() != null) {
            subjectRepository.findById(question.getSubjectId())
                    .ifPresent(subject -> response.setSubjectName(subject.getName()));
        }
        if (question.getTopicId() != null) {
            topicRepository.findById(question.getTopicId())
                    .ifPresent(topic -> response.setTopicName(topic.getName()));
        }

        return response;
    }

    public List<QuestionResponse> convertToResponseList(List<Question> questions) {
        return questions.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public PagedResponse<QuestionResponse> convertToPagedResponse(Page<Question> questionPage) {
        List<QuestionResponse> responses = convertToResponseList(questionPage.getContent());
        return new PagedResponse<>(
                responses,
                (int) questionPage.getTotalElements(),
                questionPage.getTotalPages(),
                questionPage.getNumber(),
                questionPage.getSize()
        );
    }

    // Enhanced methods returning DTOs
    @Transactional(readOnly = true)
    public QuestionResponse getQuestionResponseById(Long id) {
        Question question = getActiveQuestionById(id);
        return convertToResponse(question);
    }

    @Transactional(readOnly = true)
    public List<QuestionResponse> getRandomQuestionResponses(Long subjectId, Difficulty difficulty, int count) {
        List<Question> questions = getRandomQuestions(subjectId, difficulty, count);
        return convertToResponseList(questions);
    }

    @Transactional(readOnly = true)
    public List<QuestionResponse> getPublicDailyQuestionResponses() {
        List<Question> questions = getPublicDailyQuestions();
        return convertToResponseList(questions);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getQuestionsWithFiltersEnhanced(int page, int size, Long subjectId, Long topicId, 
                                                             Difficulty difficulty, QuestionType type, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        Page<Question> questions = questionRepository.findFilteredQuestions(
                subjectId, topicId, difficulty, type, search, pageable);

        PagedResponse<QuestionResponse> pagedQuestions = convertToPagedResponse(questions);
        
        Map<String, Object> filters = new HashMap<>();
        filters.put("difficulties", Difficulty.values());
        filters.put("types", QuestionType.values());
        
        Map<String, Object> result = new HashMap<>();
        result.put("questions", pagedQuestions.getContent());
        result.put("totalElements", pagedQuestions.getTotalElements());
        result.put("totalPages", pagedQuestions.getTotalPages());
        result.put("currentPage", pagedQuestions.getCurrentPage());
        result.put("size", pagedQuestions.getSize());
        result.put("filters", filters);
        
        return result;
    }

    public Map<String, Object> getQuestionStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total questions count
        long totalQuestions = questionRepository.count();
        stats.put("totalQuestions", totalQuestions);
        
        // Questions by difficulty
        Map<String, Long> questionsByDifficulty = new HashMap<>();
        for (Difficulty difficulty : Difficulty.values()) {
            long count = questionRepository.countByDifficulty(difficulty);
            questionsByDifficulty.put(difficulty.name(), count);
        }
        stats.put("questionsByDifficulty", questionsByDifficulty);
        
        // Questions by subject
        List<Object[]> subjectStats = questionRepository.getQuestionCountBySubject();
        List<Map<String, Object>> questionsBySubject = subjectStats.stream()
                .map(row -> {
                    Map<String, Object> subjectMap = new HashMap<>();
                    subjectMap.put("subjectName", row[0]);
                    subjectMap.put("count", row[1]);
                    return subjectMap;
                })
                .collect(Collectors.toList());
        stats.put("questionsBySubject", questionsBySubject);
        
        // Questions by type
        Map<String, Long> questionsByType = new HashMap<>();
        for (QuestionType type : QuestionType.values()) {
            long count = questionRepository.countByType(type);
            questionsByType.put(type.name(), count);
        }
        stats.put("questionsByType", questionsByType);
        
        return stats;
    }
}