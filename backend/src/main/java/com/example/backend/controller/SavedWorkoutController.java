package com.example.backend.controller;

import com.example.backend.dto.workoutDTOs.SavedWorkoutResponseDTO;
import com.example.backend.entity.workoutEntities.Workout;
import com.example.backend.repository.SavedWorkoutRepository;
import com.example.backend.service.SavedWorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/saved-workouts")
@RequiredArgsConstructor
public class SavedWorkoutController {

    private final SavedWorkoutService service;
    private final SavedWorkoutRepository savedWorkoutRepository;

    @PostMapping("/{workoutId}")
    public void saveWorkout(@PathVariable Long workoutId, Authentication authentication){
        service.saveWorkout(workoutId, authentication.getName());
    }

    @GetMapping
    public List<SavedWorkoutResponseDTO> getSavedWorkouts(Authentication authentication) {

        String email = authentication.getName();

        return savedWorkoutRepository.findByUserEmail(email)
                .stream()
                .map(saved -> new SavedWorkoutResponseDTO(
                        saved.getId(),
                        saved.getWorkout().getId(),
                        saved.getWorkout().getTitle()
                ))
                .toList();
    }

    @DeleteMapping("/{workoutId}")
    public void removeWorkout(@PathVariable Long workoutId, Authentication authentication) {
        service.removeSavedWorkout(workoutId, authentication.getName());
    }
}