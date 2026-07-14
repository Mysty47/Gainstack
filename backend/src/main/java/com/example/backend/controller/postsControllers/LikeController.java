package com.example.backend.controller.postsControllers;

import com.example.backend.dto.postDTOs.LikeResponseDTO;
import com.example.backend.service.postsServices.LikeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/posts/{postId}/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    // toggles like on/off for the current user
    @PostMapping
    public LikeResponseDTO toggleLike(
            @PathVariable long postId,
            Authentication authentication
    ) {
        return likeService.toggleLike(postId, authentication.getName());
    }

    // check whether the current user has liked this post + total count
    @GetMapping
    public LikeResponseDTO getLikeStatus(
            @PathVariable long postId,
            Authentication authentication
    ) {
        return likeService.getLikeStatus(postId, authentication.getName());
    }
}