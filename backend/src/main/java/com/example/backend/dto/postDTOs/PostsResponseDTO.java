package com.example.backend.dto.postDTOs;

import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PostsResponseDTO {

    private long id;
    private Long likes;
    private String caption;
    private String photoUrl;
    private Long userId;
    private String username;
    private String workoutTitle;
    private Long workoutId;
}