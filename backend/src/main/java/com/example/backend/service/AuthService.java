package com.example.backend.service;

import com.example.backend.dto.authDTOs.AuthResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AuthService {

    private final JwtService jwtService;

    public AuthResponseDTO refresh(String refreshToken) {

        if (!jwtService.isRefreshToken(refreshToken) ||
                !jwtService.validateRefreshToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String email = jwtService.extractUsername(refreshToken);
        String newAccessToken = jwtService.generateAccessToken(email);

        return new AuthResponseDTO(newAccessToken, refreshToken);
    }
}