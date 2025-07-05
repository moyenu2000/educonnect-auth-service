package com.educonnect.assessment.service;

import com.educonnect.assessment.dto.PagedResponse;
import com.educonnect.assessment.dto.QuestionRequest;
import com.educonnect.assessment.entity.Question;
import com.educonnect.assessment.enums.Difficulty;
import com.educonnect.assessment.enums.QuestionType;
import com.educonnect.assessment.exception.ResourceNotFoundException;
import com.educonnect.assessment.repository.QuestionRepository;
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

@Service
@Transactional
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private TopicRepository topicRepository;

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

        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new IllegalStateException("User must be authenticated to create questions");
        }

        Question question = new Question();
        question.setText(request.getText());
        question.setType(request.getType());
        question.setSubjectId(request.getSubjectId());
        question.setTopicId(request.getTopicId());
        question.setDifficulty(request.getDifficulty());
        question.setOptions(request.getOptions());
        question.setCorrectAnswer(request.getCorrectAnswer());
        question.setExplanation(request.getExplanation());
        question.setPoints(request.getPoints());
        question.setTags(request.getTags());
        question.setAttachments(request.getAttachments());
        question.setCreatedBy(currentUserId);

        return questionRepository.save(question);
    }

    public Question updateQuestion(Long id, QuestionRequest request) {
        Question question = getQuestionById(id);

        // Verify subject exists
        if (!subjectRepository.existsById(request.getSubjectId())) {
            throw new ResourceNotFoundException("Subject not found with id: " + request.getSubjectId());
        }

        // Verify topic exists if provided
        if (request.getTopicId() != null && !topicRepository.existsById(request.getTopicId())) {
            throw new ResourceNotFoundException("Topic not found with id: " + request.getTopicId());
        }

        question.setText(request.getText());
        question.setType(request.getType());
        question.setSubjectId(request.getSubjectId());
        question.setTopicId(request.getTopicId());
        question.setDifficulty(request.getDifficulty());
        question.setOptions(request.getOptions());
        question.setCorrectAnswer(request.getCorrectAnswer());
        question.setExplanation(request.getExplanation());
        question.setPoints(request.getPoints());
        question.setTags(request.getTags());
        question.setAttachments(request.getAttachments());

        return questionRepository.save(question);
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
}