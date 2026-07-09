package com.example.backend.controller;

import com.example.backend.dto.postDTOs.CreatePostRequestsDTO;
import com.example.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestBody CreatePostRequestsDTO request,
            Authentication authentication
    ) {

        postService.createPost(request, authentication.getName());

        return ResponseEntity.ok("Post created successfully");
    }
}