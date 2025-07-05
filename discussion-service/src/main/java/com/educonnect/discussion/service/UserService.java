package com.educonnect.discussion.service;

import com.educonnect.discussion.dto.PagedResponse;
import com.educonnect.discussion.dto.UserDto;
import org.springframework.data.domain.Pageable;

public interface UserService {
    
    PagedResponse<UserDto> searchUsers(String query, Pageable pageable);
    
    UserDto getUserById(Long id);
}