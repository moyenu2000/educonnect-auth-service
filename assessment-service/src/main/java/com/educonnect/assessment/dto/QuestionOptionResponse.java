package com.educonnect.assessment.dto;

public class QuestionOptionResponse {
    
    private Long id;
    private String text;
    private Integer optionOrder;
    
    // Constructors
    public QuestionOptionResponse() {}
    
    public QuestionOptionResponse(Long id, String text, Integer optionOrder) {
        this.id = id;
        this.text = text;
        this.optionOrder = optionOrder;
    }
    
    // Getters and Setters
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