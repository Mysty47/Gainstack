package com.example.backend.service;

import com.example.backend.dto.WorkoutDTO;
import com.example.backend.dto.WorkoutResponseDTO;
import com.example.backend.entity.User;
import com.example.backend.entity.Workout;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.WorkoutRepository;
import org.springframework.stereotype.Service;

@Service
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;

    public WorkoutService(WorkoutRepository workoutRepository, UserRepository userRepository) {
        this.workoutRepository = workoutRepository;
        this.userRepository = userRepository;
    }

    public WorkoutResponseDTO createWorkout(WorkoutDTO dto, User user) {

        Workout workout = new Workout();
        workout.setTitle(dto.getTitle());
        workout.setWorkoutDate(dto.getWorkoutDate());
        workout.setUser(user);

        Workout saved = workoutRepository.save(workout);

        WorkoutResponseDTO res = new WorkoutResponseDTO();
        res.setId(saved.getId());
        res.setTitle(saved.getTitle());
        res.setWorkoutDate(saved.getWorkoutDate());

        return res;
    }
}