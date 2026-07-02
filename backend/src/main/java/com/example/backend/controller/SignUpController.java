package com.example.backend.controller;

import com.example.backend.dto.SignUpDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class SignUpController {

    @PostMapping("/signup")
    public ResponseEntity<String> SignUp(@RequestBody SignUpDTO signUpDTO) {
        if(signUpDTO.getUsername().equals("admin") && signUpDTO.getPassword().equals("admin") && signUpDTO.getEmail().equals("admin")){
            return ResponseEntity.ok().body("Login Success");
        }
        else return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
