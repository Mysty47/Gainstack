package com.example.backend.dto.postDTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentDTO {

    private Long id;

    private String content;

    private String username;

}