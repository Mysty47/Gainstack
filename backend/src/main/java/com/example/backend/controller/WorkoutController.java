package com.example.backend.controller;

import com.example.backend.dto.WorkoutDTO;
import com.example.backend.dto.WorkoutResponseDTO;
import com.example.backend.entity.User;
import com.example.backend.entity.Workout;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.WorkoutRepository;
import com.example.backend.service.WorkoutService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workouts")
public class WorkoutController {

    private final WorkoutService workoutService;
    private final UserRepository userRepository;

    public WorkoutController(WorkoutService workoutService, UserRepository userRepository, WorkoutRepository workoutRepository) {
        this.workoutService = workoutService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public WorkoutResponseDTO createWorkout(@RequestBody WorkoutDTO dto, Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return workoutService.createWorkout(dto, user);
    }

    @GetMapping
    public List<WorkoutDTO> getWorkouts() {
        // TAKES ALL WORKOUTS NOT ONLY THE USERS WORKOUTS
        return workoutService.getAllWorkouts();
    }
}