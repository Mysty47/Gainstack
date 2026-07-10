package com.example.backend.dto.workoutDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SavedWorkoutResponseDTO {

    private Long id;
    private Long workoutId;
    private String workoutTitle;

}