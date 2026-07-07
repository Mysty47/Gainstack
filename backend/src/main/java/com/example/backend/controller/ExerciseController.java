package com.example.backend.controller;

import com.example.backend.entity.Exercise;
import com.example.backend.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseRepository exerciseRepository;


    @GetMapping
    public List<Exercise> getAllExercises() {
        return exerciseRepository.findAll();
    }

    @GetMapping("/search")
    public List<Exercise> searchExercises(@RequestParam String name) {
        return exerciseRepository.findByNameContainingIgnoreCase(name);
    }
}