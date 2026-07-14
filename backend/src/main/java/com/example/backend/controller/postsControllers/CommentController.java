package com.example.backend.controller.postsControllers;

import com.example.backend.dto.postDTOs.CommentDTO;
import com.example.backend.dto.postDTOs.CommentResponseDTO;
import com.example.backend.entity.postsEntities.Comment;
import com.example.backend.entity.postsEntities.Post;
import com.example.backend.repository.postsRepositories.CommentRepository;
import com.example.backend.repository.postsRepositories.PostRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.postsServices.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class CommentController {


    private final CommentService commentService;
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @GetMapping("/{postId}/comments")
    public List<CommentResponseDTO> getComments(
            @PathVariable Long postId
    ){
        return commentService.getComments(postId);
    }

    @PostMapping("/{postId}/comments")
    public CommentResponseDTO addComment(
            @PathVariable Long postId,
            @RequestBody CommentDTO request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        com.example.backend.entity.User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setUser(user);
        comment.setPost(post);

        commentRepository.save(comment);

        return new CommentResponseDTO(comment);
    }
}