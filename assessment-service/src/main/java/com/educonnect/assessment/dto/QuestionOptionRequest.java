package com.educonnect.assessment.dto;

import jakarta.validation.constraints.NotBlank;

public class QuestionOptionRequest {
    private Long id;
    
    @NotBlank(message = "Option text is required")
    private String text;
    
    private Integer optionOrder = 0;

    public QuestionOptionRequest() {}

    public QuestionOptionRequest(String text, Integer optionOrder) {
        this.text = text;
        this.optionOrder = optionOrder;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Integer getOptionOrder() {
        return optionOrder;
    }

    public void setOptionOrder(Integer optionOrder) {
        this.optionOrder = optionOrder;
    }
}