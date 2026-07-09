package com.example.backend.controller;

import com.example.backend.dto.postDTOs.CreatePostRequestsDTO;
import com.example.backend.service.MinioService;
import com.example.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final MinioService minioService;

    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestBody CreatePostRequestsDTO request,
            Authentication authentication
    ) {

        postService.createPost(request, authentication.getName());

        return ResponseEntity.ok("Post created successfully");
    }

    @PostMapping("/upload")
    public ResponseEntity<?> upload(
            @RequestParam("file") MultipartFile file
    ) throws Exception {

        String url = minioService.upload(file);

        return ResponseEntity.ok(
                Map.of("url", url)
        );
    }
}