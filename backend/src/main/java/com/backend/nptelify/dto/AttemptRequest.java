package com.backend.nptelify.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public class AttemptRequest {

    @NotNull
    @Size(min = 1)
    private List<Integer> answers;

    public List<Integer> getAnswers() { return answers; }
    public void setAnswers(List<Integer> answers) { this.answers = answers; }
}
