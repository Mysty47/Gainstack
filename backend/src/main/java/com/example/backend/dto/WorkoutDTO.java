package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class WorkoutDTO {
    private final long id;
    private final String title;
    private final LocalDate workoutDate;

    public WorkoutDTO(long id, String title, LocalDate workoutDate) {
        this.id = id;
        this.title = title;
        this.workoutDate = workoutDate;
    }
}
