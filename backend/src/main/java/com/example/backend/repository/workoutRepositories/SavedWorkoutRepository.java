package com.example.backend.repository.workoutRepositories;

import com.example.backend.entity.workoutEntities.SavedWorkouts;
import com.example.backend.entity.workoutEntities.Workout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedWorkoutRepository extends JpaRepository<SavedWorkouts, Long> {

    Optional<SavedWorkouts> findByUserIdAndWorkoutId(
            Long userId,
            Long workoutId
    );

    List<SavedWorkouts> findByUserEmail(String email);

    List<SavedWorkouts> findByUserId(Long userId);

    boolean existsByUserIdAndWorkoutId(Long userId, Long workoutId);

    void deleteByUserIdAndWorkoutId(Long userId, Long workoutId);

    void deleteAllByWorkout(Workout workout);
}