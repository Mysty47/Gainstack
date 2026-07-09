package com.example.backend.controller;

import com.example.backend.dto.postDTOs.CreatePostRequestsDTO;
import com.example.backend.entity.Post;
import com.example.backend.entity.User;
import com.example.backend.entity.workoutEntities.Workout;
import com.example.backend.repository.PostRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final WorkoutRepository workoutRepository;


    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestBody CreatePostRequestsDTO request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));


        Workout workout = workoutRepository.findById(request.getWorkoutId())
                .orElseThrow(() -> new RuntimeException("Workout not found"));


        Post post = new Post();

        post.setCaption(request.getCaption());
        post.setUser(user);
        post.setWorkout(workout);

        postRepository.save(post);

        return ResponseEntity.ok("Post created successfully");
    }
}