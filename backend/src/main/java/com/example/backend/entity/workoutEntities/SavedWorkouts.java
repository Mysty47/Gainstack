package com.example.backend.entity.workoutEntities;

import com.example.backend.entity.User;
import com.example.backend.entity.workoutEntities.Workout;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "saved_workouts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedWorkouts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_id", nullable = false)
    private Workout workout;
}