package com.example.backend.controller;

import com.example.backend.dto.SignUpDTO;
import com.example.backend.dto.UserResponseDTO;
import com.example.backend.entity.User;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class SignUpController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<UserResponseDTO> signUp(@RequestBody SignUpDTO signUpDTO) {

        User user = userService.createUser(signUpDTO);

        UserResponseDTO response = new UserResponseDTO();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
