package com.example.backend.dto.userDTOs;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginDTO {
    private String email;
    private String password;
}
