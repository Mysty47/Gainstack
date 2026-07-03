package com.example.backend.controller;

import com.example.backend.dto.SignUpDTO;
import com.example.backend.dto.UserResponseDTO;
import com.example.backend.entity.User;
import com.example.backend.mapper.UserMapper;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/auth")
public class SignUpController {

    private final UserService userService;
    private final UserMapper userMapper;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/signup")
    public UserResponseDTO signUp(@RequestBody SignUpDTO signUpDTO) {
        return userMapper.toDto(userService.createUser(signUpDTO));
    }
}
