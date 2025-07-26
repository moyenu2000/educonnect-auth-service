package com.educonnect.assessment.entity;

import com.educonnect.assessment.enums.ExamSubmissionStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_submissions")
public class UserSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private Long userId;

    @NotNull
    @Column(nullable = false)
    private Long questionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "questionId", insertable = false, updatable = false)
    @JsonIgnore
    private Question question;

    @NotNull
    @Column(nullable = false)
    private String answer;

    @Column(nullable = false)
    private Boolean isCorrect;

    @Column(nullable = false)
    private Integer timeTaken; // in seconds

    @Column(nullable = false)
    private Integer pointsEarned = 0;

    private String explanation;

    @Column(nullable = false, updatable = false)
    private LocalDateTime submittedAt;

    // Context fields
    private Long examId;
    private Long contestId;
    private Boolean isDailyQuestion = false;
    
    // New fields for submission tracking
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExamSubmissionStatus submissionStatus = ExamSubmissionStatus.DRAFT;
    
    @Column(nullable = false)
    private Boolean isMarksCalculated = false;
    
    private LocalDateTime finalizedAt;

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    public Integer getTimeTaken() {
        return timeTaken;
    }

    public void setTimeTaken(Integer timeTaken) {
        this.timeTaken = timeTaken;
    }

    public Integer getPointsEarned() {
        return pointsEarned;
    }

    public void setPointsEarned(Integer pointsEarned) {
        this.pointsEarned = pointsEarned;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }

    public Long getContestId() {
        return contestId;
    }

    public void setContestId(Long contestId) {
        this.contestId = contestId;
    }

    public Boolean getIsDailyQuestion() {
        return isDailyQuestion;
    }

    public void setIsDailyQuestion(Boolean isDailyQuestion) {
        this.isDailyQuestion = isDailyQuestion;
    }

    public ExamSubmissionStatus getSubmissionStatus() {
        return submissionStatus;
    }

    public void setSubmissionStatus(ExamSubmissionStatus submissionStatus) {
        this.submissionStatus = submissionStatus;
    }

    public Boolean getIsMarksCalculated() {
        return isMarksCalculated;
    }

    public void setIsMarksCalculated(Boolean isMarksCalculated) {
        this.isMarksCalculated = isMarksCalculated;
    }

    public LocalDateTime getFinalizedAt() {
        return finalizedAt;
    }

    public void setFinalizedAt(LocalDateTime finalizedAt) {
        this.finalizedAt = finalizedAt;
    }
}