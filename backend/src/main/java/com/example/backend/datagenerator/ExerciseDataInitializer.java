package com.example.backend.datagenerator;

import com.example.backend.entity.workoutEntities.Exercise;
import com.example.backend.repository.workoutRepositories.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ExerciseDataInitializer implements CommandLineRunner {

    private final ExerciseRepository exerciseRepository;

    @Override
    public void run(String... args) {

        if (exerciseRepository.count() == 0) {

            List<Exercise> exercises = List.of(

                    Exercise.builder()
                            .name("Bench Press")
                            .muscleGroup("Chest")
                            .equipment("Barbell")
                            .build(),

                    Exercise.builder()
                            .name("Incline Dumbbell Press")
                            .muscleGroup("Chest")
                            .equipment("Dumbbell")
                            .build(),

                    Exercise.builder()
                            .name("Push Up")
                            .muscleGroup("Chest")
                            .equipment("Bodyweight")
                            .build(),

                    Exercise.builder()
                            .name("Squat")
                            .muscleGroup("Legs")
                            .equipment("Barbell")
                            .build(),

                    Exercise.builder()
                            .name("Leg Press")
                            .muscleGroup("Legs")
                            .equipment("Machine")
                            .build(),

                    Exercise.builder()
                            .name("Romanian Deadlift")
                            .muscleGroup("Hamstrings")
                            .equipment("Barbell")
                            .build(),

                    Exercise.builder()
                            .name("Pull Up")
                            .muscleGroup("Back")
                            .equipment("Bodyweight")
                            .build(),

                    Exercise.builder()
                            .name("Lat Pulldown")
                            .muscleGroup("Back")
                            .equipment("Cable Machine")
                            .build(),

                    Exercise.builder()
                            .name("Barbell Row")
                            .muscleGroup("Back")
                            .equipment("Barbell")
                            .build(),

                    Exercise.builder()
                            .name("Shoulder Press")
                            .muscleGroup("Shoulders")
                            .equipment("Dumbbell")
                            .build(),

                    Exercise.builder()
                            .name("Lateral Raise")
                            .muscleGroup("Shoulders")
                            .equipment("Dumbbell")
                            .build(),

                    Exercise.builder()
                            .name("Bicep Curl")
                            .muscleGroup("Biceps")
                            .equipment("Dumbbell")
                            .build(),

                    Exercise.builder()
                            .name("Tricep Pushdown")
                            .muscleGroup("Triceps")
                            .equipment("Cable Machine")
                            .build(),

                    Exercise.builder()
                            .name("Plank")
                            .muscleGroup("Core")
                            .equipment("Bodyweight")
                            .build(),

                    Exercise.builder()
                            .name("Crunch")
                            .muscleGroup("Core")
                            .equipment("Bodyweight")
                            .build()
            );

            exerciseRepository.saveAll(exercises);

            System.out.println("Exercise database populated!");
        }
    }
}