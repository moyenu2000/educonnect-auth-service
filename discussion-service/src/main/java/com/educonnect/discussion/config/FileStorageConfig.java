package com.educonnect.discussion.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

@Configuration
public class FileStorageConfig {
    
    @Value("${app.file.upload-dir:./uploads}")
    private String uploadDir;
    
    @Value("${app.file.base-url:http://34.136.116.244:8082/api/v1/files}")
    private String baseUrl;
    
    @Value("${app.file.allowed-extensions:jpg,jpeg,png,gif,pdf,doc,docx,txt,zip,rar}")
    private String allowedExtensions;
    
    @Value("${app.file.max-file-size:10MB}")
    private String maxFileSize;
    
    private List<String> allowedExtensionsList;
    
    @PostConstruct
    public void init() {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Parse allowed extensions
            this.allowedExtensionsList = Arrays.asList(allowedExtensions.toLowerCase().split(","));
            
        } catch (IOException ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }
    
    public String getUploadDir() {
        return uploadDir;
    }
    
    public String getBaseUrl() {
        return baseUrl;
    }
    
    public List<String> getAllowedExtensions() {
        return allowedExtensionsList;
    }
    
    public String getMaxFileSize() {
        return maxFileSize;
    }
    
    public Path getUploadPath() {
        return Paths.get(uploadDir).toAbsolutePath().normalize();
    }
}