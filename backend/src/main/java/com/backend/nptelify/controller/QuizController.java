package com.backend.nptelify.controller;

import com.backend.nptelify.dto.QuizRequest;
import com.backend.nptelify.dto.QuizResponse;
import com.backend.nptelify.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping
    @PreAuthorize("hasRole('EXAMINER')")
    public ResponseEntity<QuizResponse> createQuiz(@Valid @RequestBody QuizRequest request,
                                                    Principal principal) {
        return ResponseEntity.ok(quizService.createQuiz(request, principal.getName()));
    }

    @GetMapping
    public ResponseEntity<List<QuizResponse>> getAllQuizzes() {
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('EXAMINER')")
    public ResponseEntity<List<QuizResponse>> getMyQuizzes(Principal principal) {
        return ResponseEntity.ok(quizService.getMyQuizzes(principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizResponse> getQuizById(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizById(id));
    }
}
