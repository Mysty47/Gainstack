package com.example.backend.controller;

import com.example.backend.entity.workoutEntities.Exercise;
import com.example.backend.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseRepository exerciseRepository;


    @GetMapping
    public List<Exercise> getAllExercises() {
        log.info("Get All Exercises Called");
        return exerciseRepository.findAll();
    }

    @GetMapping("/search")
    public List<Exercise> searchExercises(@RequestParam String name) {
        log.info("Search Called");
        return exerciseRepository.findByNameContainingIgnoreCase(name);
    }
}