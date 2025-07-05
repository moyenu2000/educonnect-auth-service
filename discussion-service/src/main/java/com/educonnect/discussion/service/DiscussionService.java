package com.educonnect.discussion.service;

import com.educonnect.discussion.dto.DiscussionDto;
import com.educonnect.discussion.dto.DiscussionRequest;
import com.educonnect.discussion.dto.PagedResponse;
import com.educonnect.discussion.enums.ClassLevel;
import com.educonnect.discussion.enums.DiscussionType;
import org.springframework.data.domain.Pageable;

public interface DiscussionService {
    
    PagedResponse<DiscussionDto> getDiscussions(
        DiscussionType type,
        Long subjectId,
        Long topicId,
        ClassLevel classLevel,
        String sortBy,
        Pageable pageable,
        Long currentUserId
    );
    
    DiscussionDto getDiscussionById(Long id, Long currentUserId);
    
    DiscussionDto createDiscussion(DiscussionRequest request, Long authorId);
    
    DiscussionDto updateDiscussion(Long id, DiscussionRequest request, Long currentUserId);
    
    void deleteDiscussion(Long id, Long currentUserId);
    
    PagedResponse<DiscussionDto> searchDiscussions(
        String query,
        Long subjectId,
        DiscussionType type,
        String sortBy,
        Pageable pageable,
        Long currentUserId
    );
    
    void upvoteDiscussion(Long id, Long userId);
    
    void downvoteDiscussion(Long id, Long userId);
    
    void bookmarkDiscussion(Long id, Long userId);
    
    PagedResponse<DiscussionDto> getGroupDiscussions(Long groupId, String sortBy, Pageable pageable, Long currentUserId);
    
    DiscussionDto createGroupDiscussion(Long groupId, DiscussionRequest request, Long authorId);
}