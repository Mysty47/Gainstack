package com.example.backend.controller;

import com.example.backend.entity.User;
import com.example.backend.entity.workoutEntities.Exercise;
import com.example.backend.repository.ExerciseRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;


    @GetMapping
    public List<Exercise> getAllExercises(Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return exerciseRepository.findByUserIsNullOrUserId(user.getId());
    }


    @PostMapping
    public Exercise createExercise(
            @RequestBody Exercise exercise,
            Authentication authentication
    ) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        exercise.setUser(user);

        return exerciseRepository.save(exercise);
    }
}