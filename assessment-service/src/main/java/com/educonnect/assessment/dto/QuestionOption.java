package com.educonnect.assessment.dto;

public class QuestionOption {
    private Long id;
    private String text;

    public QuestionOption() {}

    public QuestionOption(Long id, String text) {
        this.id = id;
        this.text = text;
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
}