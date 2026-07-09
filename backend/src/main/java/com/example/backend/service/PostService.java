package com.example.backend.service;

import com.example.backend.dto.postDTOs.CreatePostRequestsDTO;
import com.example.backend.dto.postDTOs.PostsResponseDTO;
import com.example.backend.entity.Post;
import com.example.backend.entity.User;
import com.example.backend.entity.workoutEntities.Workout;
import com.example.backend.repository.PostRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.WorkoutRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final WorkoutRepository workoutRepository;

    public void createPost(CreatePostRequestsDTO request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Workout workout = workoutRepository.findById(request.getWorkoutId())
                .orElseThrow(() -> new RuntimeException("Workout not found"));

        Post post = new Post();
        post.setCaption(request.getCaption());
        post.setUser(user);
        post.setWorkout(workout);
        post.setPhotoUrl(request.getPhotoUrl());

        postRepository.save(post);
    }

    public List<PostsResponseDTO> getAllPosts() {

        return postRepository.findAll()
                .stream()
                .map(post -> new PostsResponseDTO(
                        post.getId(),
                        post.getCaption(),
                        post.getPhotoUrl(),
                        post.getUser().getId(),
                        post.getUser().getUsername(),
                        post.getWorkout().getId()
                ))
                .toList();
    }
}