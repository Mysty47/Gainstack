package com.example.backend.controller;

import com.example.backend.repository.UserRepository;
import com.example.backend.service.JwtService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Demo {

    @GetMapping("/test")
    public String Test(){
        return "test";
    }
}
