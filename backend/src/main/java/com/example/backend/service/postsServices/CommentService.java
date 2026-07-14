package com.example.backend.service.postsServices;

import com.example.backend.dto.postDTOs.CommentDTO;
import com.example.backend.dto.postDTOs.CommentResponseDTO;
import com.example.backend.entity.postsEntities.Comment;
import com.example.backend.entity.postsEntities.Post;
import com.example.backend.entity.User;
import com.example.backend.repository.postsRepositories.CommentRepository;
import com.example.backend.repository.postsRepositories.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;


    public List<CommentResponseDTO> getComments(Long postId){

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        return commentRepository.findByPost(post)
                .stream()
                .map(CommentResponseDTO::new)
                .toList();
    }



    public CommentDTO addComment(
            Long postId,
            String content,
            User user
    ){

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));


        Comment comment = new Comment();

        comment.setContent(content);
        comment.setPost(post);
        comment.setUser(user);


        Comment saved = commentRepository.save(comment);


        CommentDTO dto = new CommentDTO();

        dto.setId(saved.getId());
        dto.setContent(saved.getContent());
        dto.setUsername(user.getUsername());


        return dto;
    }
}