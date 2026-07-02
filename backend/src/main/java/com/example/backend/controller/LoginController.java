package com.example.backend.controller;

import com.example.backend.dto.LoginDTO;
import com.example.backend.entity.User;
import com.example.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class LoginController {

    private final UserService userService;

    public LoginController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public User login(@RequestBody LoginDTO loginDTO) {
        return userService.login(loginDTO.getEmail(), loginDTO.getPassword());
    }
}
