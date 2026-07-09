package com.example.backend.dto.postDTOs;

import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;

@Getter
@AllArgsConstructor
public class PostsResponseDTO {

    private long id;
    private String caption;
    private String photoUrl;
    private Long userId;
    private String username;
    private Long workoutId;
}