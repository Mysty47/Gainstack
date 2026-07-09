package com.example.backend.dto.workoutDTOs;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutExerciseDTO {

    private Long exerciseId;
    private String exerciseName;
    private List<WorkoutSetDTO> sets;
}