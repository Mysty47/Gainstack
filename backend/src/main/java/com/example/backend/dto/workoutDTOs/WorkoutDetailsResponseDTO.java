package com.example.backend.dto.workoutDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@AllArgsConstructor
public class WorkoutDetailsResponseDTO {

    private Long workoutId;
    private String title;
    private LocalDate workoutDate;
    private List<WorkoutExerciseDTO> exercises;
}