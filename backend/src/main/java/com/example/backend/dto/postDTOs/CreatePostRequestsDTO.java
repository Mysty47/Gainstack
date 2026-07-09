package com.example.backend.dto.postDTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreatePostRequestsDTO {

    private String caption;

    private Long workoutId;
}