package com.educonnect.discussion.service;

import com.educonnect.discussion.config.FileStorageConfig;
import com.educonnect.discussion.entity.FileAttachment;
import com.educonnect.discussion.repository.FileAttachmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FileUploadService {
    
    @Autowired
    private FileStorageConfig fileStorageConfig;
    
    @Autowired
    private FileAttachmentRepository fileAttachmentRepository;
    
    public FileAttachment uploadFile(MultipartFile file, Long userId, String description) {
        validateFile(file);
        
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = getFileExtension(originalFileName);
        String storedFileName = generateUniqueFileName(originalFileName);
        
        try {
            // Copy file to the target location
            Path targetLocation = fileStorageConfig.getUploadPath().resolve(storedFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            // Create file attachment record
            String fileUrl = fileStorageConfig.getBaseUrl() + "/" + storedFileName;
            FileAttachment fileAttachment = new FileAttachment(
                originalFileName,
                storedFileName,
                targetLocation.toString(),
                fileUrl,
                file.getContentType(),
                file.getSize(),
                userId
            );
            
            if (description != null && !description.trim().isEmpty()) {
                fileAttachment.setDescription(description);
            }
            
            return fileAttachmentRepository.save(fileAttachment);
            
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }
    
    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = fileStorageConfig.getUploadPath().resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + fileName, ex);
        }
    }
    
    public Optional<FileAttachment> getFileDetails(String fileName) {
        return fileAttachmentRepository.findByStoredFileName(fileName);
    }
    
    public Optional<FileAttachment> getFileById(Long fileId) {
        return fileAttachmentRepository.findById(fileId);
    }
    
    public List<FileAttachment> getUserFiles(Long userId) {
        return fileAttachmentRepository.findByUploadedByOrderByUploadedAtDesc(userId);
    }
    
    public Page<FileAttachment> getUserFiles(Long userId, Pageable pageable) {
        return fileAttachmentRepository.findByUploadedByOrderByUploadedAtDesc(userId, pageable);
    }
    
    public List<FileAttachment> getPublicFiles() {
        return fileAttachmentRepository.findByIsPublicTrueOrderByUploadedAtDesc();
    }
    
    public boolean deleteFile(Long fileId, Long userId) {
        Optional<FileAttachment> fileAttachment = fileAttachmentRepository.findById(fileId);
        
        if (fileAttachment.isPresent() && fileAttachment.get().getUploadedBy().equals(userId)) {
            try {
                // Delete physical file
                Path filePath = Paths.get(fileAttachment.get().getFilePath());
                Files.deleteIfExists(filePath);
                
                // Delete database record
                fileAttachmentRepository.delete(fileAttachment.get());
                return true;
            } catch (IOException ex) {
                throw new RuntimeException("Could not delete file", ex);
            }
        }
        return false;
    }
    
    public Long getUserTotalFileSize(Long userId) {
        Long totalSize = fileAttachmentRepository.getTotalFileSizeByUser(userId);
        return totalSize != null ? totalSize : 0L;
    }
    
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file");
        }
        
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        if (fileName.contains("..")) {
            throw new RuntimeException("Sorry! Filename contains invalid path sequence " + fileName);
        }
        
        String fileExtension = getFileExtension(fileName).toLowerCase();
        if (!fileStorageConfig.getAllowedExtensions().contains(fileExtension)) {
            throw new RuntimeException("File type not allowed: " + fileExtension + 
                ". Allowed types: " + String.join(", ", fileStorageConfig.getAllowedExtensions()));
        }
        
        // Additional file size validation (Spring Boot handles this too, but double-check)
        if (file.getSize() > 10 * 1024 * 1024) { // 10MB
            throw new RuntimeException("File size exceeds maximum allowed size of 10MB");
        }
    }
    
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf(".") == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }
    
    private String generateUniqueFileName(String originalFileName) {
        String fileExtension = getFileExtension(originalFileName);
        String baseName = originalFileName.substring(0, originalFileName.lastIndexOf("."));
        String cleanBaseName = baseName.replaceAll("[^a-zA-Z0-9]", "_");
        
        return cleanBaseName + "_" + UUID.randomUUID().toString() + 
               (fileExtension.isEmpty() ? "" : "." + fileExtension);
    }
}