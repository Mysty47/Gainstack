package com.example.backend.entity.workoutEntities;

import com.example.backend.entity.Post;
import com.example.backend.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Setter
@Getter
@Table(name = "workouts")
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private LocalDate workoutDate;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "workout", cascade = CascadeType.ALL,  orphanRemoval = true)
    private List<WorkoutExercise> exercises;

    @OneToMany(
            mappedBy = "workout"
    )
    private List<Post> posts = new ArrayList<>();
}