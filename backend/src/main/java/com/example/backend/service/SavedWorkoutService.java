package com.example.backend.service;

import com.example.backend.entity.User;
import com.example.backend.entity.workoutEntities.SavedWorkouts;
import com.example.backend.entity.workoutEntities.Workout;
import com.example.backend.repository.SavedWorkoutRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavedWorkoutService {


    private final SavedWorkoutRepository savedWorkoutRepository;
    private final UserRepository userRepository;
    private final WorkoutRepository workoutRepository;



    public void saveWorkout(Long workoutId, String email){


        User user = userRepository.findByEmail(email)
                .orElseThrow();


        if(savedWorkoutRepository
                .existsByUserIdAndWorkoutId(
                        user.getId(),
                        workoutId
                )){
            return;
        }


        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow();


        SavedWorkouts saved = SavedWorkouts.builder()
                .user(user)
                .workout(workout)
                .build();


        savedWorkoutRepository.save(saved);
    }



    public List<Workout> getSavedWorkouts(String email){


        User user = userRepository.findByEmail(email)
                .orElseThrow();


        return savedWorkoutRepository
                .findByUserId(user.getId())
                .stream()
                .map(SavedWorkouts::getWorkout)
                .toList();

    }


    public void removeSavedWorkout(Long workoutId, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow();

        SavedWorkouts saved = savedWorkoutRepository
                .findByUserIdAndWorkoutId(
                        user.getId(),
                        workoutId
                )
                .orElseThrow(() ->
                        new RuntimeException("Saved workout not found")
                );

        savedWorkoutRepository.delete(saved);
    }
}