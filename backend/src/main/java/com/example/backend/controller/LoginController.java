package com.example.backend.controller;

import com.example.backend.dto.authDTOs.AuthResponseDTO;
import com.example.backend.dto.userDTOs.LoginDTO;
import com.example.backend.dto.authDTOs.RefreshTokenRequest;
import com.example.backend.service.AuthService;
import com.example.backend.service.JwtService;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class LoginController {

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody LoginDTO loginDTO) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getEmail(),
                        loginDTO.getPassword()
                )
        );

        String accessToken = jwtService.generateAccessToken(loginDTO.getEmail());
        String refreshToken = jwtService.generateRefreshToken(loginDTO.getEmail());

        return new AuthResponseDTO(accessToken, refreshToken);
    }

    @PostMapping("/refresh")
    public AuthResponseDTO refresh(@RequestBody RefreshTokenRequest request) {
        return authService.refresh(request.getRefreshToken());
    }
}