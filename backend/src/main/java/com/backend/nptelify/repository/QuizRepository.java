package com.backend.nptelify.repository;

import com.backend.nptelify.entity.Quiz;
import com.backend.nptelify.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByExaminer(User examiner);
}
