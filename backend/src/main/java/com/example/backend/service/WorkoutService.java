package com.example.backend.service;

import com.example.backend.dto.WorkoutDTO;
import com.example.backend.dto.WorkoutExerciseDTO;
import com.example.backend.dto.WorkoutResponseDTO;
import com.example.backend.dto.WorkoutSetDTO;
import com.example.backend.entity.User;
import com.example.backend.entity.Workout;
import com.example.backend.entity.WorkoutExercise;
import com.example.backend.entity.WorkoutSet;
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

    public WorkoutResponseDTO createWorkout(WorkoutDTO dto, User user) {

        Workout workout = new Workout();
        workout.setTitle(dto.getTitle());
        workout.setWorkoutDate(dto.getWorkoutDate());
        workout.setUser(user);

        List<WorkoutExercise> exercises = new ArrayList<>();

        for (WorkoutExerciseDTO exDto : dto.getExercises()) {

            WorkoutExercise ex = new WorkoutExercise();
            ex.setExerciseId(exDto.getExerciseId());
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

    //TAKES ALL WORKOUTS NOT JUST FOR ONE USER
    public List<WorkoutDTO> getAllWorkouts() {
        return workoutRepository.findAllByOrderByWorkoutDateDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private WorkoutDTO toResponse(Workout workout) {
        return new WorkoutDTO(
                workout.getId(),
                workout.getTitle(),
                workout.getWorkoutDate()
        );
    }
}