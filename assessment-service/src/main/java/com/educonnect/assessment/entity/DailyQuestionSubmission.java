package com.educonnect.assessment.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_question_submissions",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "daily_question_id"}))
public class DailyQuestionSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @NotNull
    @Column(name = "daily_question_id", nullable = false)
    private Long dailyQuestionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "daily_question_id", insertable = false, updatable = false)
    @JsonIgnore
    private DailyQuestion dailyQuestion;

    @NotNull
    @Column(name = "question_id", nullable = false)
    private Long questionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", insertable = false, updatable = false)
    @JsonIgnore
    private Question question;

    @NotNull
    @Column(nullable = false, columnDefinition = "TEXT")
    private String answer;

    @NotNull
    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect;

    @NotNull
    @Column(name = "points_earned", nullable = false)
    private Integer pointsEarned;

    @NotNull
    @Column(name = "time_taken_seconds", nullable = false)
    private Integer timeTakenSeconds;

    @Column(name = "submitted_at", nullable = false, updatable = false)
    private LocalDateTime submittedAt;

    @Column(name = "ip_address", columnDefinition = "INET")
    private String ipAddress;

    @Column(name = "device_info", columnDefinition = "TEXT")
    private String deviceInfo;

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }

    // Constructors
    public DailyQuestionSubmission() {}

    public DailyQuestionSubmission(Long userId, Long dailyQuestionId, Long questionId, 
                                 String answer, Boolean isCorrect, Integer pointsEarned, 
                                 Integer timeTakenSeconds) {
        this.userId = userId;
        this.dailyQuestionId = dailyQuestionId;
        this.questionId = questionId;
        this.answer = answer;
        this.isCorrect = isCorrect;
        this.pointsEarned = pointsEarned;
        this.timeTakenSeconds = timeTakenSeconds;
    }

    // Getters and Setters
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

    public Long getDailyQuestionId() {
        return dailyQuestionId;
    }

    public void setDailyQuestionId(Long dailyQuestionId) {
        this.dailyQuestionId = dailyQuestionId;
    }

    public DailyQuestion getDailyQuestion() {
        return dailyQuestion;
    }

    public void setDailyQuestion(DailyQuestion dailyQuestion) {
        this.dailyQuestion = dailyQuestion;
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

    public Integer getPointsEarned() {
        return pointsEarned;
    }

    public void setPointsEarned(Integer pointsEarned) {
        this.pointsEarned = pointsEarned;
    }

    public Integer getTimeTakenSeconds() {
        return timeTakenSeconds;
    }

    public void setTimeTakenSeconds(Integer timeTakenSeconds) {
        this.timeTakenSeconds = timeTakenSeconds;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getDeviceInfo() {
        return deviceInfo;
    }

    public void setDeviceInfo(String deviceInfo) {
        this.deviceInfo = deviceInfo;
    }
}