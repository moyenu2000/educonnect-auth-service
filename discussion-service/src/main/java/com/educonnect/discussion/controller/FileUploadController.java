package com.educonnect.discussion.controller;

import com.educonnect.discussion.dto.ApiResponse;
import com.educonnect.discussion.dto.PagedResponse;
import com.educonnect.discussion.entity.FileAttachment;
import com.educonnect.discussion.service.FileUploadService;
import com.educonnect.discussion.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/files")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FileUploadController {
    
    @Autowired
    private FileUploadService fileUploadService;
    
    @PostMapping("/upload")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "description", required = false) String description) {
        
        try {
            Long userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new RuntimeException("User not authenticated"));
            
            FileAttachment fileAttachment = fileUploadService.uploadFile(file, userId, description);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", fileAttachment.getId());
            response.put("fileName", fileAttachment.getOriginalFileName());
            response.put("url", fileAttachment.getFileUrl());
            response.put("size", fileAttachment.getFileSize());
            response.put("contentType", fileAttachment.getContentType());
            response.put("uploadedAt", fileAttachment.getUploadedAt());
            
            return ResponseEntity.ok(ApiResponse.success(response, "File uploaded successfully"));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("File upload failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/upload/multiple")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> uploadMultipleFiles(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(value = "description", required = false) String description) {
        
        try {
            Long userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new RuntimeException("User not authenticated"));
            
            List<Map<String, Object>> uploadedFiles = new java.util.ArrayList<>();
            
            for (MultipartFile file : files) {
                FileAttachment fileAttachment = fileUploadService.uploadFile(file, userId, description);
                
                Map<String, Object> fileInfo = new HashMap<>();
                fileInfo.put("id", fileAttachment.getId());
                fileInfo.put("fileName", fileAttachment.getOriginalFileName());
                fileInfo.put("url", fileAttachment.getFileUrl());
                fileInfo.put("size", fileAttachment.getFileSize());
                fileInfo.put("contentType", fileAttachment.getContentType());
                fileInfo.put("uploadedAt", fileAttachment.getUploadedAt());
                
                uploadedFiles.add(fileInfo);
            }
            
            return ResponseEntity.ok(ApiResponse.success(uploadedFiles, "Files uploaded successfully"));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("File upload failed: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        try {
            Resource resource = fileUploadService.loadFileAsResource(fileName);
            Optional<FileAttachment> fileAttachment = fileUploadService.getFileDetails(fileName);
            
            if (fileAttachment.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Check if file is public or user has access
            Long currentUserId = SecurityUtils.getCurrentUserId().orElse(null);
            if (!fileAttachment.get().getIsPublic() && 
                !fileAttachment.get().getUploadedBy().equals(currentUserId)) {
                return ResponseEntity.status(403).build();
            }
            
            String contentType = fileAttachment.get().getContentType();
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                    "inline; filename=\"" + fileAttachment.get().getOriginalFileName() + "\"")
                .body(resource);
                
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<PagedResponse<FileAttachment>>> getMyFiles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Long userId = SecurityUtils.getCurrentUserId()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));
        
        Pageable pageable = PageRequest.of(page, size);
        Page<FileAttachment> filesPage = fileUploadService.getUserFiles(userId, pageable);
        
        PagedResponse<FileAttachment> response = PagedResponse.of(filesPage);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @GetMapping("/details/{fileId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<FileAttachment>> getFileDetails(@PathVariable Long fileId) {
        Optional<FileAttachment> fileAttachment = fileUploadService.getFileById(fileId);
        
        if (fileAttachment.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        // Check access permissions
        Long currentUserId = SecurityUtils.getCurrentUserId().orElse(null);
        if (!fileAttachment.get().getIsPublic() && 
            !fileAttachment.get().getUploadedBy().equals(currentUserId)) {
            return ResponseEntity.status(403)
                .body(ApiResponse.error("Access denied"));
        }
        
        return ResponseEntity.ok(ApiResponse.success(fileAttachment.get()));
    }
    
    @DeleteMapping("/{fileId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<String>> deleteFile(@PathVariable Long fileId) {
        Long userId = SecurityUtils.getCurrentUserId()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));
        
        boolean deleted = fileUploadService.deleteFile(fileId, userId);
        
        if (deleted) {
            return ResponseEntity.ok(ApiResponse.success("File deleted successfully"));
        } else {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Unable to delete file or file not found"));
        }
    }
    
    @GetMapping("/storage-info")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStorageInfo() {
        Long userId = SecurityUtils.getCurrentUserId()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));
        
        Long totalSize = fileUploadService.getUserTotalFileSize(userId);
        List<FileAttachment> userFiles = fileUploadService.getUserFiles(userId);
        
        Map<String, Object> storageInfo = new HashMap<>();
        storageInfo.put("totalFiles", userFiles.size());
        storageInfo.put("totalSizeBytes", totalSize);
        storageInfo.put("totalSizeMB", totalSize / (1024.0 * 1024.0));
        storageInfo.put("maxSizeMB", 100); // 100MB limit per user
        storageInfo.put("usagePercentage", (totalSize / (100.0 * 1024 * 1024)) * 100);
        
        return ResponseEntity.ok(ApiResponse.success(storageInfo));
    }
}