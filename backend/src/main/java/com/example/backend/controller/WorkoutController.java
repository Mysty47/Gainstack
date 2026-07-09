package com.example.backend.controller;

import com.example.backend.dto.workoutDTOs.WorkoutDTO;
import com.example.backend.dto.workoutDTOs.WorkoutResponseDTO;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/workouts")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class WorkoutController {

    private final WorkoutService workoutService;
    private final UserRepository userRepository;

    @PostMapping
    public WorkoutResponseDTO createWorkout(@RequestBody WorkoutDTO dto, Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        log.info("Workout Creation Called");
        return workoutService.createWorkout(dto, user);
    }

    @GetMapping
    public List<WorkoutResponseDTO> getWorkouts(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        log.info("Workouts Fetch Called");
        return workoutService.getWorkouts(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getWorkout(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                workoutService.getWorkoutDetails(id)
        );
    }
}