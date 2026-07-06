package com.example.backend.entity;

import com.example.backend.entity.Workout;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class WorkoutExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long exerciseId; // from your exercise library

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "workout_id")
    private Workout workout;

    @OneToMany(mappedBy = "workoutExercise", cascade = CascadeType.ALL,  orphanRemoval = true)
    private List<WorkoutSet> sets;
}