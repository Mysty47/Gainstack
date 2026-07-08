package com.example.backend.dto.workoutDTOs;

import lombok.*;

import java.util.List;

@Getter
@Setter
public class WorkoutExerciseDTO {

    private Long exerciseId;
    private List<WorkoutSetDTO> sets;
}