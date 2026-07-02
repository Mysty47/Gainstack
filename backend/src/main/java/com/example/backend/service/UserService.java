package com.example.backend.service;

import com.example.backend.dto.SignUpDTO;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class UserService {

    private final UserRepository userRepository;

    public User createUser(SignUpDTO signUpDTO) {
        User user = new User();
        user.setUsername(signUpDTO.getUsername());
        user.setPassword(signUpDTO.getPassword());
        user.setEmail(signUpDTO.getEmail());
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
