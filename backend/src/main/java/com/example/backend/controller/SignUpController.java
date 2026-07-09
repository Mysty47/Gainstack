package com.example.backend.controller;

import com.example.backend.dto.userDTOs.SignUpDTO;
import com.example.backend.dto.userDTOs.UserResponseDTO;
import com.example.backend.mapper.UserMapper;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/auth")
public class SignUpController {

    private final UserService userService;
    private final UserMapper userMapper;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/signup")
    public UserResponseDTO signUp(@RequestBody SignUpDTO signUpDTO) {
        log.info("SignUp Called");
        return userMapper.toDto(userService.createUser(signUpDTO));
    }
}
