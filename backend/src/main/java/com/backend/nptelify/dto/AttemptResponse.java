package com.backend.nptelify.dto;

import java.time.LocalDateTime;

public class AttemptResponse {

    private Long id;
    private Long quizId;
    private String quizTitle;
    private String subject;
    private int score;
    private int totalQuestions;
    private double percentage;
    private LocalDateTime submittedAt;

    public AttemptResponse(Long id, Long quizId, String quizTitle, String subject,
                           int score, int totalQuestions, LocalDateTime submittedAt) {
        this.id = id;
        this.quizId = quizId;
        this.quizTitle = quizTitle;
        this.subject = subject;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.percentage = totalQuestions > 0 ? Math.round((score * 100.0 / totalQuestions) * 10.0) / 10.0 : 0;
        this.submittedAt = submittedAt;
    }

    public Long getId() { return id; }
    public Long getQuizId() { return quizId; }
    public String getQuizTitle() { return quizTitle; }
    public String getSubject() { return subject; }
    public int getScore() { return score; }
    public int getTotalQuestions() { return totalQuestions; }
    public double getPercentage() { return percentage; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
}
