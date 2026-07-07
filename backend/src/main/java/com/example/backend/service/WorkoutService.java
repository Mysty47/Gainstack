package com.example.backend.service;

import com.example.backend.dto.WorkoutDTO;
import com.example.backend.dto.WorkoutExerciseDTO;
import com.example.backend.dto.WorkoutResponseDTO;
import com.example.backend.dto.WorkoutSetDTO;
import com.example.backend.entity.*;
import com.example.backend.repository.ExerciseRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final ExerciseRepository exerciseRepository;

    public WorkoutResponseDTO createWorkout(WorkoutDTO dto, User user) {

        Workout workout = new Workout();
        workout.setTitle(dto.getTitle());
        workout.setWorkoutDate(dto.getWorkoutDate());
        workout.setUser(user);

        List<WorkoutExercise> exercises = new ArrayList<>();

        for (WorkoutExerciseDTO exDto : dto.getExercises()) {

            WorkoutExercise ex = new WorkoutExercise();

            Exercise exercise = exerciseRepository.findById(exDto.getExerciseId())
                    .orElseThrow(() -> new RuntimeException("Exercise not found"));

            ex.setExercise(exercise);
            ex.setWorkout(workout);

            List<WorkoutSet> sets = new ArrayList<>();

            for (WorkoutSetDTO setDto : exDto.getSets()) {
                WorkoutSet set = new WorkoutSet();
                set.setReps(setDto.getReps());
                set.setWeight(setDto.getWeight());
                set.setWorkoutExercise(ex);
                sets.add(set);
            }

            ex.setSets(sets);
            exercises.add(ex);
        }

        workout.setExercises(exercises);

        Workout saved = workoutRepository.save(workout);

        WorkoutResponseDTO res = new WorkoutResponseDTO();
        res.setId(saved.getId());
        res.setTitle(saved.getTitle());
        res.setWorkoutDate(saved.getWorkoutDate());

        return res;
    }
}