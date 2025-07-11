package com.educonnect.assessment.controller;

import com.educonnect.assessment.dto.ApiResponse;
import com.educonnect.assessment.dto.PagedResponse;
import com.educonnect.assessment.dto.TopicRequest;
import com.educonnect.assessment.dto.TopicUpdateRequest;
import com.educonnect.assessment.entity.Topic;
import com.educonnect.assessment.service.TopicService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/topics")
public class TopicController {

    @Autowired
    private TopicService topicService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<PagedResponse<Topic>>> getAllTopics(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long subjectId) {
        
        PagedResponse<Topic> topics = topicService.getAllTopics(page, size, subjectId, false);
        return ResponseEntity.ok(ApiResponse.success(topics));
    }

    @GetMapping("/public/by-subject/{subjectId}")
    public ResponseEntity<ApiResponse<List<Topic>>> getPublicTopicsBySubject(@PathVariable Long subjectId) {
        List<Topic> topics = topicService.getPublicTopicsBySubject(subjectId);
        return ResponseEntity.ok(ApiResponse.success(topics));
    }

    @GetMapping("/{topicId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Topic>> getTopicById(@PathVariable Long topicId) {
        Topic topic = topicService.getActiveTopicById(topicId);
        return ResponseEntity.ok(ApiResponse.success(topic));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER')")
    public ResponseEntity<ApiResponse<Topic>> createTopic(@Valid @RequestBody TopicRequest request) {
        Topic topic = topicService.createTopic(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(topic, "Topic created successfully"));
    }

    @PutMapping("/{topicId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER')")
    public ResponseEntity<ApiResponse<Topic>> updateTopic(
            @PathVariable Long topicId,
            @Valid @RequestBody TopicUpdateRequest request) {
        
        Topic topic = topicService.updateTopic(topicId, request);
        return ResponseEntity.ok(ApiResponse.success(topic, "Topic updated successfully"));
    }

    @DeleteMapping("/{topicId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QUESTION_SETTER')")
    public ResponseEntity<ApiResponse<String>> deleteTopic(@PathVariable Long topicId) {
        topicService.deleteTopic(topicId);
        return ResponseEntity.ok(ApiResponse.success("Topic deleted successfully"));
    }
}