package com.example.backend.service;

import com.example.backend.dto.userDTOs.SignUpDTO;
import com.example.backend.dto.userDTOs.UserDTO;
import com.example.backend.entity.User;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public User createUser(SignUpDTO signUpDTO) {

        if (userRepository.findByEmail(signUpDTO.getEmail()).isPresent()) {
            throw new RuntimeException("EMAIL_ALREADY_EXISTS");
        }

        User user = userMapper.toEntity(signUpDTO);

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public UserDTO getCurrentUser(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDTO dto = new UserDTO();

        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setProfilePictureUrl(user.getProfilePictureUrl());

        return dto;
    }

    public void updateProfilePicture(String email, String url) {

        User user = userRepository.findByEmail(email)
                .orElseThrow();

        user.setProfilePictureUrl(url);

        userRepository.save(user);
    }
}