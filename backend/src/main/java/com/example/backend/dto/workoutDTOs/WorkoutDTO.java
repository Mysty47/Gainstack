package com.example.backend.dto.workoutDTOs;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class WorkoutDTO {

    private String title;
    private LocalDate workoutDate;

    private List<WorkoutExerciseDTO> exercises;
}
