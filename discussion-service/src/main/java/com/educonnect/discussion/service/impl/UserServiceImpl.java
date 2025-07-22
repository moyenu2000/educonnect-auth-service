package com.educonnect.discussion.service.impl;

import com.educonnect.discussion.dto.PagedResponse;
import com.educonnect.discussion.dto.UserDto;
import com.educonnect.discussion.entity.User;
import com.educonnect.discussion.exception.ResourceNotFoundException;
import com.educonnect.discussion.repository.UserRepository;
import com.educonnect.discussion.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public PagedResponse<UserDto> searchUsers(String query, Pageable pageable) {
        Page<User> usersPage = userRepository.searchUsers(query, pageable);
        
        List<UserDto> userDtos = usersPage.getContent().stream()
            .map(UserDto::fromEntity)
            .collect(Collectors.toList());
        
        return new PagedResponse<>(
            userDtos,
            (int) usersPage.getTotalElements(),
            usersPage.getTotalPages(),
            usersPage.getNumber(),
            usersPage.getSize(),
            usersPage.isFirst(),
            usersPage.isLast(),
            usersPage.isEmpty()
        );
    }

    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        return UserDto.fromEntity(user);
    }
}