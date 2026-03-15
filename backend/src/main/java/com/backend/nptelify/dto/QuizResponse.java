package com.backend.nptelify.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class QuizResponse {

    private Long id;
    private String title;
    private String subject;
    private int durationMinutes;
    private LocalDateTime createdAt;
    private LocalDateTime scheduledDateTime;
    private String examinerName;
    private List<QuestionDto> questions;
    private int attemptCount;

    public QuizResponse(Long id, String title, String subject, int durationMinutes,
                        LocalDateTime createdAt, LocalDateTime scheduledDateTime, String examinerName, List<QuestionDto> questions,
                        int attemptCount) {
        this.id = id;
        this.title = title;
        this.subject = subject;
        this.durationMinutes = durationMinutes;
        this.createdAt = createdAt;
        this.scheduledDateTime = scheduledDateTime;
        this.examinerName = examinerName;
        this.questions = questions;
        this.attemptCount = attemptCount;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getSubject() { return subject; }
    public int getDurationMinutes() { return durationMinutes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getScheduledDateTime() { return scheduledDateTime; }
    public String getExaminerName() { return examinerName; }
    public List<QuestionDto> getQuestions() { return questions; }
    public int getAttemptCount() { return attemptCount; }

    public static class QuestionDto {
        private Long id;
        private String text;
        private List<String> options;

        public QuestionDto(Long id, String text, List<String> options) {
            this.id = id;
            this.text = text;
            this.options = options == null ? List.of() : new ArrayList<>(options);
        }

        public Long getId() { return id; }
        public String getText() { return text; }
        public List<String> getOptions() { return options; }
    }
}
