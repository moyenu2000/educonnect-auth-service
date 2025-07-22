package com.educonnect.discussion.service;

import com.educonnect.discussion.dto.AnswerDto;
import com.educonnect.discussion.dto.AnswerRequest;
import com.educonnect.discussion.dto.PagedResponse;
import org.springframework.data.domain.Pageable;

public interface AnswerService {
    
    PagedResponse<AnswerDto> getAnswersByDiscussionId(Long discussionId, String sortBy, Pageable pageable, Long currentUserId);
    
    AnswerDto createAnswer(Long discussionId, AnswerRequest request, Long authorId);
    
    AnswerDto updateAnswer(Long answerId, AnswerRequest request, Long currentUserId);
    
    void deleteAnswer(Long answerId, Long currentUserId);
    
    void upvoteAnswer(Long answerId, Long userId);
    
    void downvoteAnswer(Long answerId, Long userId);
    
    void acceptAnswer(Long answerId, Long currentUserId);
}