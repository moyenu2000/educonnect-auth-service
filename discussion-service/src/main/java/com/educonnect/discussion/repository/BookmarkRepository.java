package com.educonnect.discussion.repository;

import com.educonnect.discussion.entity.Bookmark;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    
    Optional<Bookmark> findByUserIdAndDiscussionId(Long userId, Long discussionId);
    
    Page<Bookmark> findByUserId(Long userId, Pageable pageable);
    
    boolean existsByUserIdAndDiscussionId(Long userId, Long discussionId);
    
    void deleteByUserIdAndDiscussionId(Long userId, Long discussionId);
}