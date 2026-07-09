package com.example.backend.dto.workoutDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class WorkoutDetailsResponseDTO {

    private Long workoutId;
    private List<WorkoutExerciseDTO> exercises;
}