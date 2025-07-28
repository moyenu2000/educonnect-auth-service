package com.educonnect.discussion.dto;

import java.util.List;

public class AIQueryResponse {
    private String answer;
    private List<String> sources;
    private Double confidence;
    private List<String> followUpQuestions;

    public AIQueryResponse() {}

    public AIQueryResponse(String answer, List<String> sources, Double confidence, List<String> followUpQuestions) {
        this.answer = answer;
        this.sources = sources;
        this.confidence = confidence;
        this.followUpQuestions = followUpQuestions;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public List<String> getSources() {
        return sources;
    }

    public void setSources(List<String> sources) {
        this.sources = sources;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public List<String> getFollowUpQuestions() {
        return followUpQuestions;
    }

    public void setFollowUpQuestions(List<String> followUpQuestions) {
        this.followUpQuestions = followUpQuestions;
    }
}