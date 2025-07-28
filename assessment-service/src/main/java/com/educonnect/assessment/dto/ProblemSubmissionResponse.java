package com.educonnect.assessment.dto;

import java.util.List;

public class ProblemSubmissionResponse {
    private Boolean correct;
    private String correctAnswer;
    private String explanation;
    private Integer points;
    private List<String> hints;
    private List<PracticeProblemDto> similarProblems;

    public Boolean getCorrect() {
        return correct;
    }

    public void setCorrect(Boolean correct) {
        this.correct = correct;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public List<String> getHints() {
        return hints;
    }

    public void setHints(List<String> hints) {
        this.hints = hints;
    }

    public List<PracticeProblemDto> getSimilarProblems() {
        return similarProblems;
    }

    public void setSimilarProblems(List<PracticeProblemDto> similarProblems) {
        this.similarProblems = similarProblems;
    }
}