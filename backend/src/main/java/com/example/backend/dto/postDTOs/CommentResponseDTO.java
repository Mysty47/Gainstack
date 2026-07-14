package com.example.backend.dto.postDTOs;

import com.example.backend.entity.postsEntities.Comment;
import lombok.Getter;

@Getter
public class CommentResponseDTO {

    private final Long id;
    private final String content;

    private final String username;
    private final String profilePictureUrl;


    public CommentResponseDTO(Comment comment) {

        this.id = comment.getId();
        this.content = comment.getContent();

        this.username = comment.getUser().getUsername();
        this.profilePictureUrl = comment.getUser().getProfilePictureUrl();
    }
}