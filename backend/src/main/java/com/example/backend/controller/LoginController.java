package com.example.backend.controller;

import com.example.backend.dto.LoginDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class LoginController {

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO) {
        if(loginDTO.getUsername().equals("admin") && loginDTO.getPassword().equals("admin")){
            return ResponseEntity.ok().body("Login Success");
        }
        else return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
