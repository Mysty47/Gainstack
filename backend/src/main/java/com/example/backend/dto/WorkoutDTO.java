package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class WorkoutDTO {
    private String title;
    private LocalDate workoutDate;
}
