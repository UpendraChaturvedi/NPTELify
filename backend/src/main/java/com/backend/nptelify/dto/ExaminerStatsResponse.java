package com.backend.nptelify.dto;

import java.util.List;

public class ExaminerStatsResponse {

    private double classAverage;
    private double passRate;
    private double submissionRate;
    private double engagementScore;
    private List<QuizStatsDto> quizzes;
    private List<SubjectStatsDto> subjects;
    private List<StudentPerformanceDto> studentPerformance;

    // Constructor
    public ExaminerStatsResponse(double classAverage, double passRate, double submissionRate,
                                 double engagementScore, List<QuizStatsDto> quizzes,
                                 List<SubjectStatsDto> subjects, List<StudentPerformanceDto> studentPerformance) {
        this.classAverage = classAverage;
        this.passRate = passRate;
        this.submissionRate = submissionRate;
        this.engagementScore = engagementScore;
        this.quizzes = quizzes;
        this.subjects = subjects;
        this.studentPerformance = studentPerformance;
    }

    // Getters and Setters
    public double getClassAverage() { return classAverage; }
    public void setClassAverage(double classAverage) { this.classAverage = classAverage; }

    public double getPassRate() { return passRate; }
    public void setPassRate(double passRate) { this.passRate = passRate; }

    public double getSubmissionRate() { return submissionRate; }
    public void setSubmissionRate(double submissionRate) { this.submissionRate = submissionRate; }

    public double getEngagementScore() { return engagementScore; }
    public void setEngagementScore(double engagementScore) { this.engagementScore = engagementScore; }

    public List<QuizStatsDto> getQuizzes() { return quizzes; }
    public void setQuizzes(List<QuizStatsDto> quizzes) { this.quizzes = quizzes; }

    public List<SubjectStatsDto> getSubjects() { return subjects; }
    public void setSubjects(List<SubjectStatsDto> subjects) { this.subjects = subjects; }

    public List<StudentPerformanceDto> getStudentPerformance() { return studentPerformance; }
    public void setStudentPerformance(List<StudentPerformanceDto> studentPerformance) { this.studentPerformance = studentPerformance; }

    // Inner DTO classes
    public static class QuizStatsDto {
        private Long quizId;
        private String title;
        private double averageScore;
        private int attemptCount;

        public QuizStatsDto(Long quizId, String title, double averageScore, int attemptCount) {
            this.quizId = quizId;
            this.title = title;
            this.averageScore = averageScore;
            this.attemptCount = attemptCount;
        }

        public Long getQuizId() { return quizId; }
        public String getTitle() { return title; }
        public double getAverageScore() { return averageScore; }
        public int getAttemptCount() { return attemptCount; }
    }

    public static class SubjectStatsDto {
        private String subject;
        private double averageScore;
        private String trend;
        private String color;

        public SubjectStatsDto(String subject, double averageScore, String trend, String color) {
            this.subject = subject;
            this.averageScore = averageScore;
            this.trend = trend;
            this.color = color;
        }

        public String getSubject() { return subject; }
        public double getAverageScore() { return averageScore; }
        public String getTrend() { return trend; }
        public String getColor() { return color; }
    }

    public static class StudentPerformanceDto {
        private Long candidateId;
        private String candidateName;
        private String email;
        private double averageScore;
        private List<Integer> scoresTrend;
        private String trend;

        public StudentPerformanceDto(Long candidateId, String candidateName, String email,
                                     double averageScore, List<Integer> scoresTrend, String trend) {
            this.candidateId = candidateId;
            this.candidateName = candidateName;
            this.email = email;
            this.averageScore = averageScore;
            this.scoresTrend = scoresTrend;
            this.trend = trend;
        }

        public Long getCandidateId() { return candidateId; }
        public String getCandidateName() { return candidateName; }
        public String getEmail() { return email; }
        public double getAverageScore() { return averageScore; }
        public List<Integer> getScoresTrend() { return scoresTrend; }
        public String getTrend() { return trend; }
    }
}
