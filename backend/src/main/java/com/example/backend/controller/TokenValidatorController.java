package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TokenValidatorController {

    @GetMapping("/validate")
    public ResponseEntity<?> validate(Authentication authentication) {

        return ResponseEntity.ok(
                authentication.getName()
        );
    }
}