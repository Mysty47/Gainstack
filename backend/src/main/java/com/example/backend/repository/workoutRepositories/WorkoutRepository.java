package com.example.backend.repository.workoutRepositories;

import com.example.backend.entity.User;
import com.example.backend.entity.workoutEntities.Workout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    List<Workout> findAllByOrderByWorkoutDateDesc();
    List<Workout> findByUser(User user);
}
