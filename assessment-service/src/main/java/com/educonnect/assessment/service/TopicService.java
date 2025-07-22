package com.educonnect.assessment.service;

import com.educonnect.assessment.dto.PagedResponse;
import com.educonnect.assessment.dto.TopicRequest;
import com.educonnect.assessment.dto.TopicUpdateRequest;
import com.educonnect.assessment.entity.Topic;
import com.educonnect.assessment.exception.ResourceNotFoundException;
import com.educonnect.assessment.repository.SubjectRepository;
import com.educonnect.assessment.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TopicService {

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    public PagedResponse<Topic> getAllTopics(int page, int size, Long subjectId, boolean includeInactive) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("displayOrder", "name"));
        Page<Topic> topics;

        if (includeInactive) {
            if (subjectId != null) {
                topics = topicRepository.findBySubjectId(subjectId, pageable);
            } else {
                topics = topicRepository.findAll(pageable);
            }
        } else {
            topics = topicRepository.findFilteredTopics(subjectId, pageable);
        }

        return new PagedResponse<>(
                topics.getContent(),
                (int) topics.getTotalElements(),
                topics.getTotalPages(),
                topics.getNumber(),
                topics.getSize()
        );
    }

    public List<Topic> getPublicTopicsBySubject(Long subjectId) {
        return topicRepository.findBySubjectIdAndIsActiveTrueOrderByDisplayOrder(subjectId);
    }

    @Transactional(readOnly = true)
    public Topic getTopicById(Long id) {
        return topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Topic getActiveTopicById(Long id) {
        return topicRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Active topic not found with id: " + id));
    }

    public Topic createTopic(TopicRequest request) {
        // Verify subject exists
        if (!subjectRepository.existsById(request.getSubjectId())) {
            throw new ResourceNotFoundException("Subject not found with id: " + request.getSubjectId());
        }

        if (topicRepository.existsByNameAndSubjectId(request.getName(), request.getSubjectId())) {
            throw new IllegalArgumentException("Topic with this name already exists in this subject");
        }

        Topic topic = new Topic();
        topic.setName(request.getName());
        topic.setDescription(request.getDescription());
        topic.setSubjectId(request.getSubjectId());
        topic.setDisplayOrder(request.getDisplayOrder());
        topic.setIsActive(request.getIsActive());

        return topicRepository.save(topic);
    }

    public Topic updateTopic(Long id, TopicRequest request) {
        Topic topic = getTopicById(id);

        if (!topic.getName().equals(request.getName()) &&
            topicRepository.existsByNameAndSubjectIdAndIdNot(request.getName(), topic.getSubjectId(), id)) {
            throw new IllegalArgumentException("Topic with this name already exists in this subject");
        }

        topic.setName(request.getName());
        topic.setDescription(request.getDescription());
        topic.setDisplayOrder(request.getDisplayOrder());
        topic.setIsActive(request.getIsActive());

        return topicRepository.save(topic);
    }

    public Topic updateTopic(Long id, TopicUpdateRequest request) {
        Topic topic = getTopicById(id);

        if (!topic.getName().equals(request.getName()) &&
            topicRepository.existsByNameAndSubjectIdAndIdNot(request.getName(), topic.getSubjectId(), id)) {
            throw new IllegalArgumentException("Topic with this name already exists in this subject");
        }

        topic.setName(request.getName());
        topic.setDescription(request.getDescription());
        topic.setDisplayOrder(request.getDisplayOrder());
        topic.setIsActive(request.getIsActive());

        return topicRepository.save(topic);
    }

    public void deleteTopic(Long id) {
        Topic topic = getTopicById(id);
        topicRepository.delete(topic);
    }

    public void deactivateTopic(Long id) {
        Topic topic = getTopicById(id);
        topic.setIsActive(false);
        topicRepository.save(topic);
    }
}