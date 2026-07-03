package com.example.backend.controller;

import com.example.backend.dto.WorkoutDTO;
import com.example.backend.entity.User;
import com.example.backend.entity.Workout;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.WorkoutService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/workouts")
public class WorkoutController {

    private final WorkoutService workoutService;
    private final UserRepository userRepository;

    public WorkoutController(WorkoutService workoutService, UserRepository userRepository) {
        this.workoutService = workoutService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public Workout createWorkout(@RequestBody WorkoutDTO dto, Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return workoutService.createWorkout(dt  o, user);
    }
}