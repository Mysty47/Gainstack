package com.example.backend.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class TokenValidatorController {

    @GetMapping("/validate")
    public ResponseEntity<?> validate(Authentication authentication) {

        log.info("Validate Called");

        return ResponseEntity.ok(
                authentication.getName()
        );
    }
}