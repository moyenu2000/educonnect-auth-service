package com.educonnect.discussion.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateGroupRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Description is required")  
    private String description;
    
    private String avatarUrl;
    private String rules;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getRules() {
        return rules;
    }

    public void setRules(String rules) {
        this.rules = rules;
    }
}