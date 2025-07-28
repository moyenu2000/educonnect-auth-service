package com.educonnect.discussion.service;

import com.educonnect.discussion.dto.AIQueryRequest;
import com.educonnect.discussion.dto.AIQueryResponse;
import com.educonnect.discussion.dto.PagedResponse;
import com.educonnect.discussion.entity.AIQuery;
import org.springframework.data.domain.Pageable;

public interface AIService {
    
    AIQueryResponse askAI(AIQueryRequest request, Long userId);
    
    PagedResponse<AIQuery> getAIHistory(Long userId, Long subjectId, Pageable pageable);
}