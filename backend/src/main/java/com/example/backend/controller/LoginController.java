package com.example.backend.controller;

import com.example.backend.dto.AuthResponseDTO;
import com.example.backend.dto.LoginDTO;
import com.example.backend.service.JwtService;
import com.example.backend.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/auth")
public class LoginController {

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    public LoginController(JwtService jwtService, AuthenticationManager authenticationManager) {
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody LoginDTO loginDTO) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getEmail(),
                        loginDTO.getPassword()
                )
        );

        String token = jwtService.generateToken(loginDTO.getEmail());

        return new AuthResponseDTO(token);
    }
}
