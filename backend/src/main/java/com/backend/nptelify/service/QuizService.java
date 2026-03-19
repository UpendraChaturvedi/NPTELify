package com.backend.nptelify.service;

import com.backend.nptelify.dto.ExaminerStatsResponse;
import com.backend.nptelify.dto.QuizRequest;
import com.backend.nptelify.dto.QuizResponse;
import com.backend.nptelify.entity.Attempt;
import com.backend.nptelify.entity.Question;
import com.backend.nptelify.entity.Quiz;
import com.backend.nptelify.entity.User;
import com.backend.nptelify.repository.AttemptRepository;
import com.backend.nptelify.repository.QuizRepository;
import com.backend.nptelify.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final UserRepository userRepository;
    private final AttemptRepository attemptRepository;

    public QuizService(QuizRepository quizRepository, UserRepository userRepository, AttemptRepository attemptRepository) {
        this.quizRepository = quizRepository;
        this.userRepository = userRepository;
        this.attemptRepository = attemptRepository;
    }

    @Transactional
    public QuizResponse createQuiz(QuizRequest request, String examinerEmail) {
        User examiner = userRepository.findByEmail(examinerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Examiner not found"));

        Quiz quiz = new Quiz();
        quiz.setTitle(request.getTitle());
        quiz.setSubject(request.getSubject());
        quiz.setDurationMinutes(request.getDurationMinutes());
        quiz.setScheduledDateTime(request.getScheduledDateTime());
        quiz.setAllowMultipleAttempts(request.isAllowMultipleAttempts());
        quiz.setExaminer(examiner);

        for (QuizRequest.QuestionDto qDto : request.getQuestions()) {
            Question q = new Question();
            q.setText(qDto.getText());
            q.setOptions(qDto.getOptions());
            q.setCorrectOption(qDto.getCorrectOption());
            q.setQuiz(quiz);
            quiz.getQuestions().add(q);
        }

        Quiz saved = quizRepository.save(quiz);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<QuizResponse> getAllQuizzes() {
        return quizRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<QuizResponse> getMyQuizzes(String examinerEmail) {
        User examiner = userRepository.findByEmail(examinerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Examiner not found"));
        return quizRepository.findByExaminer(examiner).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public QuizResponse getQuizById(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found"));
        return toResponse(quiz);
    }

    @Transactional(readOnly = true)
    public List<QuizResponse> getUpcomingQuizzes() {
        LocalDateTime now = LocalDateTime.now();
        return quizRepository.findAll().stream()
                .filter(q -> q.getScheduledDateTime() != null && q.getScheduledDateTime().isAfter(now))
                .sorted((a, b) -> a.getScheduledDateTime().compareTo(b.getScheduledDateTime()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<QuizResponse> getMyUpcomingQuizzes(String examinerEmail) {
        User examiner = userRepository.findByEmail(examinerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Examiner not found"));
        LocalDateTime now = LocalDateTime.now();
        return quizRepository.findByExaminer(examiner).stream()
                .filter(q -> q.getScheduledDateTime() != null && q.getScheduledDateTime().isAfter(now))
                .sorted((a, b) -> a.getScheduledDateTime().compareTo(b.getScheduledDateTime()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<QuizResponse> getPastQuizzes() {
        LocalDateTime now = LocalDateTime.now();
        return quizRepository.findAll().stream()
                .filter(q -> q.getScheduledDateTime() != null && q.getScheduledDateTime().isBefore(now))
                .sorted((a, b) -> b.getScheduledDateTime().compareTo(a.getScheduledDateTime()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<QuizResponse> getMyPastQuizzes(String examinerEmail) {
        User examiner = userRepository.findByEmail(examinerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Examiner not found"));
        LocalDateTime now = LocalDateTime.now();
        return quizRepository.findByExaminer(examiner).stream()
                .filter(q -> q.getScheduledDateTime() != null && q.getScheduledDateTime().isBefore(now))
                .sorted((a, b) -> b.getScheduledDateTime().compareTo(a.getScheduledDateTime()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private QuizResponse toResponse(Quiz quiz) {
        List<QuizResponse.QuestionDto> questions = quiz.getQuestions().stream()
            .map(q -> new QuizResponse.QuestionDto(q.getId(), q.getText(), new ArrayList<>(q.getOptions())))
                .collect(Collectors.toList());
        
        // Calculate attempt count
        List<Attempt> attempts = attemptRepository.findByQuiz(quiz);
        int attemptCount = attempts.size();
        
        return new QuizResponse(
                quiz.getId(), quiz.getTitle(), quiz.getSubject(),
                quiz.getDurationMinutes(), quiz.getCreatedAt(), quiz.getScheduledDateTime(),
                quiz.getExaminer().getName(), questions, attemptCount, quiz.isAllowMultipleAttempts()
        );
    }

    @Transactional
    public QuizResponse updateQuiz(Long id, QuizRequest request, String examinerEmail) {
        User examiner = userRepository.findByEmail(examinerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Examiner not found"));

        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found"));

        // Verify owner
        if (!quiz.getExaminer().getId().equals(examiner.getId())) {
            throw new IllegalArgumentException("You can only edit your own quizzes");
        }

        // Update basic fields
        quiz.setTitle(request.getTitle());
        quiz.setSubject(request.getSubject());
        quiz.setDurationMinutes(request.getDurationMinutes());
        quiz.setScheduledDateTime(request.getScheduledDateTime());
        quiz.setAllowMultipleAttempts(request.isAllowMultipleAttempts());

        // Clear old questions and add new ones
        quiz.getQuestions().clear();
        for (QuizRequest.QuestionDto qDto : request.getQuestions()) {
            Question q = new Question();
            q.setText(qDto.getText());
            q.setOptions(qDto.getOptions());
            q.setCorrectOption(qDto.getCorrectOption());
            q.setQuiz(quiz);
            quiz.getQuestions().add(q);
        }

        Quiz updated = quizRepository.save(quiz);
        return toResponse(updated);
    }

    @Transactional
    public void deleteQuiz(Long id, String examinerEmail) {
        User examiner = userRepository.findByEmail(examinerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Examiner not found"));

        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found"));

        // Verify owner
        if (!quiz.getExaminer().getId().equals(examiner.getId())) {
            throw new IllegalArgumentException("You can only delete your own quizzes");
        }

        // Check if quiz has attempts
        List<Attempt> attempts = attemptRepository.findByQuiz(quiz);
        if (!attempts.isEmpty()) {
            throw new IllegalArgumentException("Cannot delete a quiz that has attempts");
        }

        quizRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public ExaminerStatsResponse getExaminerStats(String examinerEmail) {
        User examiner = userRepository.findByEmail(examinerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Examiner not found"));

        List<Quiz> quizzes = quizRepository.findByExaminer(examiner);
        if (quizzes.isEmpty()) {
            return new ExaminerStatsResponse(0, 0, 0, 0, new ArrayList<>(), new ArrayList<>(), new ArrayList<>());
        }

        // Collect all attempts for all quizzes
        List<Attempt> allAttempts = new ArrayList<>();
        for (Quiz quiz : quizzes) {
            allAttempts.addAll(attemptRepository.findByQuiz(quiz));
        }

        // Calculate class average
        double classAverage = allAttempts.isEmpty() ? 0 :
                allAttempts.stream().mapToDouble(a -> (double) a.getScore() / a.getTotalQuestions() * 100)
                        .average().orElse(0);

        // Calculate pass rate (60% = pass)
        long passCount = allAttempts.stream()
                .filter(a -> ((double) a.getScore() / a.getTotalQuestions()) >= 0.6)
                .count();
        double passRate = allAttempts.isEmpty() ? 0 : (double) passCount / allAttempts.size() * 100;

        // Submission rate = number of unique students who attempted / total candidates (estimated from attempts)
        long uniqueStudents = allAttempts.stream().map(a -> a.getCandidate().getId()).distinct().count();
        double submissionRate = allAttempts.isEmpty() ? 0 : (uniqueStudents > 0 ? 100 : 0);

        // Engagement score (average of all metrics)
        double engagementScore = (classAverage + passRate + submissionRate) / 3;

        // Quiz-wise stats
        List<ExaminerStatsResponse.QuizStatsDto> quizStats = quizzes.stream()
                .map(quiz -> {
                    List<Attempt> attempts = attemptRepository.findByQuiz(quiz);
                    double avgScore = attempts.isEmpty() ? 0 :
                            attempts.stream().mapToDouble(a -> (double) a.getScore() / a.getTotalQuestions() * 100)
                                    .average().orElse(0);
                    return new ExaminerStatsResponse.QuizStatsDto(quiz.getId(), quiz.getTitle(), avgScore, attempts.size());
                })
                .collect(Collectors.toList());

        // Subject-wise stats
        Map<String, List<Attempt>> attemptsBySubject = new HashMap<>();
        for (Quiz quiz : quizzes) {
            String subject = quiz.getSubject();
            List<Attempt> subjectAttempts = attemptRepository.findByQuiz(quiz);
            attemptsBySubject.computeIfAbsent(subject, k -> new ArrayList<>()).addAll(subjectAttempts);
        }

        String[] colors = {"#2563eb", "#f97316", "#16a34a", "#9333ea", "#ea580c"};
        List<ExaminerStatsResponse.SubjectStatsDto> subjectStats = attemptsBySubject.entrySet().stream()
                .map(entry -> {
                    String subject = entry.getKey();
                    List<Attempt> attempts = entry.getValue();
                    double avgScore = attempts.isEmpty() ? 0 :
                            attempts.stream().mapToDouble(a -> (double) a.getScore() / a.getTotalQuestions() * 100)
                                    .average().orElse(0);
                    String color = colors[attemptsBySubject.keySet().stream().toList().indexOf(subject) % colors.length];
                    return new ExaminerStatsResponse.SubjectStatsDto(subject, avgScore, "+2%", color);
                })
                .collect(Collectors.toList());

        // Student performance stats
        Map<User, List<Attempt>> attemptsByCandidate = new HashMap<>();
        for (Attempt attempt : allAttempts) {
            attemptsByCandidate.computeIfAbsent(attempt.getCandidate(), k -> new ArrayList<>()).add(attempt);
        }

        List<ExaminerStatsResponse.StudentPerformanceDto> studentStats = attemptsByCandidate.entrySet().stream()
                .map(entry -> {
                    User candidate = entry.getKey();
                    List<Attempt> attempts = entry.getValue();
                    double avgScore = attempts.stream()
                            .mapToDouble(a -> (double) a.getScore() / a.getTotalQuestions() * 100)
                            .average().orElse(0);
                    List<Integer> scores = attempts.stream()
                            .sorted(Comparator.comparing(Attempt::getId))
                            .map(a -> (int) ((double) a.getScore() / a.getTotalQuestions() * 100))
                            .collect(Collectors.toList());
                    String trend = "+2%";
                    return new ExaminerStatsResponse.StudentPerformanceDto(
                            candidate.getId(), candidate.getName(), candidate.getEmail(), avgScore, scores, trend
                    );
                })
                .sorted((a, b) -> Double.compare(b.getAverageScore(), a.getAverageScore()))
                .collect(Collectors.toList());

        return new ExaminerStatsResponse(
                Math.round(classAverage * 100.0) / 100.0,
                Math.round(passRate * 100.0) / 100.0,
                Math.round(submissionRate * 100.0) / 100.0,
                Math.round(engagementScore * 100.0) / 100.0,
                quizStats,
                subjectStats,
                studentStats
        );
    }
}
