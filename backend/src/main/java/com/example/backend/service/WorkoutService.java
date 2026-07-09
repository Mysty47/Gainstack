package com.example.backend.service;

import com.example.backend.dto.workoutDTOs.*;
import com.example.backend.entity.*;
import com.example.backend.entity.workoutEntities.Exercise;
import com.example.backend.entity.workoutEntities.Workout;
import com.example.backend.entity.workoutEntities.WorkoutExercise;
import com.example.backend.entity.workoutEntities.WorkoutSet;
import com.example.backend.repository.ExerciseRepository;
import com.example.backend.repository.WorkoutRepository;
import jakarta.persistence.EntityNotFoundException;
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

    public List<WorkoutResponseDTO> getWorkouts(User user) {

        List<Workout> workouts = workoutRepository.findByUser(user);

        return workouts.stream()
                .map(this::toResponseDTO)
                .toList();
    }


    private WorkoutResponseDTO toResponseDTO(Workout workout) {

        WorkoutResponseDTO dto = new WorkoutResponseDTO();

        dto.setId(workout.getId());
        dto.setTitle(workout.getTitle());
        dto.setWorkoutDate(workout.getWorkoutDate());

        return dto;
    }

    public WorkoutDetailsResponseDTO getWorkoutDetails(Long workoutId) {

        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new EntityNotFoundException("Workout not found"));


        List<WorkoutExerciseDTO> exercises = workout.getExercises()
                .stream()
                .map(workoutExercise -> {

                    List<WorkoutSetDTO> sets = workoutExercise.getSets()
                            .stream()
                            .map(set -> new WorkoutSetDTO(
                                    set.getReps(),
                                    set.getWeight()
                            ))
                            .toList();

                    return new WorkoutExerciseDTO(
                            workoutExercise.getExercise().getId(),
                            workoutExercise.getExercise().getName(),
                            sets
                    );

                })
                .toList();


        return new WorkoutDetailsResponseDTO(
                workout.getId(),
                exercises
        );
    }
}