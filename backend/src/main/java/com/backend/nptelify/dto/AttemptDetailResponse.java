package com.backend.nptelify.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AttemptDetailResponse {

    private Long attemptId;
    private Long quizId;
    private String quizTitle;
    private String subject;
    private int score;
    private int totalQuestions;
    private double percentage;
    private LocalDateTime submittedAt;
    private List<QuestionResult> questions;

    public AttemptDetailResponse() {}

    public AttemptDetailResponse(Long attemptId, Long quizId, String quizTitle, String subject,
                                  int score, int totalQuestions, double percentage,
                                  LocalDateTime submittedAt, List<QuestionResult> questions) {
        this.attemptId = attemptId;
        this.quizId = quizId;
        this.quizTitle = quizTitle;
        this.subject = subject;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.percentage = percentage;
        this.submittedAt = submittedAt;
        this.questions = questions;
    }

    // ── getters / setters ──────────────────────────────────

    public Long getAttemptId() { return attemptId; }
    public void setAttemptId(Long attemptId) { this.attemptId = attemptId; }

    public Long getQuizId() { return quizId; }
    public void setQuizId(Long quizId) { this.quizId = quizId; }

    public String getQuizTitle() { return quizTitle; }
    public void setQuizTitle(String quizTitle) { this.quizTitle = quizTitle; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }

    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public List<QuestionResult> getQuestions() { return questions; }
    public void setQuestions(List<QuestionResult> questions) { this.questions = questions; }

    // ── inner class ────────────────────────────────────────

    public static class QuestionResult {
        private int questionNumber;
        private String text;
        private List<String> options;
        private int correctOption;
        private int candidateAnswer;
        private boolean correct;

        public QuestionResult() {}

        public QuestionResult(int questionNumber, String text, List<String> options,
                               int correctOption, int candidateAnswer) {
            this.questionNumber = questionNumber;
            this.text = text;
            this.options = options == null ? List.of() : new ArrayList<>(options);
            this.correctOption = correctOption;
            this.candidateAnswer = candidateAnswer;
            this.correct = (candidateAnswer == correctOption);
        }

        public int getQuestionNumber() { return questionNumber; }
        public void setQuestionNumber(int questionNumber) { this.questionNumber = questionNumber; }

        public String getText() { return text; }
        public void setText(String text) { this.text = text; }

        public List<String> getOptions() { return options; }
        public void setOptions(List<String> options) { this.options = options; }

        public int getCorrectOption() { return correctOption; }
        public void setCorrectOption(int correctOption) { this.correctOption = correctOption; }

        public int getCandidateAnswer() { return candidateAnswer; }
        public void setCandidateAnswer(int candidateAnswer) { this.candidateAnswer = candidateAnswer; }

        public boolean isCorrect() { return correct; }
        public void setCorrect(boolean correct) { this.correct = correct; }
    }
}
