package com.backend.nptelify.service;

import com.backend.nptelify.dto.QuizRequest;
import com.backend.nptelify.dto.QuizResponse;
import com.backend.nptelify.entity.Question;
import com.backend.nptelify.entity.Quiz;
import com.backend.nptelify.entity.User;
import com.backend.nptelify.repository.QuizRepository;
import com.backend.nptelify.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final UserRepository userRepository;

    public QuizService(QuizRepository quizRepository, UserRepository userRepository) {
        this.quizRepository = quizRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public QuizResponse createQuiz(QuizRequest request, String examinerEmail) {
        User examiner = userRepository.findByEmail(examinerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Examiner not found"));

        Quiz quiz = new Quiz();
        quiz.setTitle(request.getTitle());
        quiz.setSubject(request.getSubject());
        quiz.setDurationMinutes(request.getDurationMinutes());
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

    private QuizResponse toResponse(Quiz quiz) {
        List<QuizResponse.QuestionDto> questions = quiz.getQuestions().stream()
            .map(q -> new QuizResponse.QuestionDto(q.getId(), q.getText(), new ArrayList<>(q.getOptions())))
                .collect(Collectors.toList());
        return new QuizResponse(
                quiz.getId(), quiz.getTitle(), quiz.getSubject(),
                quiz.getDurationMinutes(), quiz.getCreatedAt(),
                quiz.getExaminer().getName(), questions
        );
    }
}
