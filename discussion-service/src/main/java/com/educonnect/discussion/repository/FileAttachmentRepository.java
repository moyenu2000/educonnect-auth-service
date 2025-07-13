package com.educonnect.discussion.repository;

import com.educonnect.discussion.entity.FileAttachment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FileAttachmentRepository extends JpaRepository<FileAttachment, Long> {
    
    Optional<FileAttachment> findByStoredFileName(String storedFileName);
    
    List<FileAttachment> findByUploadedByOrderByUploadedAtDesc(Long uploadedBy);
    
    Page<FileAttachment> findByUploadedByOrderByUploadedAtDesc(Long uploadedBy, Pageable pageable);
    
    List<FileAttachment> findByIsPublicTrueOrderByUploadedAtDesc();
    
    @Query("SELECT f FROM FileAttachment f WHERE f.uploadedBy = :userId AND f.uploadedAt >= :since")
    List<FileAttachment> findRecentFilesByUser(@Param("userId") Long userId, @Param("since") LocalDateTime since);
    
    @Query("SELECT SUM(f.fileSize) FROM FileAttachment f WHERE f.uploadedBy = :userId")
    Long getTotalFileSizeByUser(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(f) FROM FileAttachment f WHERE f.uploadedAt >= :since")
    Long countFilesUploadedSince(@Param("since") LocalDateTime since);
}