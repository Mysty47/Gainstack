package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class WorkoutResponseDTO {
    private Long id;
    private String title;
    private LocalDate workoutDate;
}