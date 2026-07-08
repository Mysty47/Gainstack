package com.example.backend.mapper;

import com.example.backend.dto.userDTOs.SignUpDTO;
import com.example.backend.dto.userDTOs.UserResponseDTO;
import com.example.backend.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toEntity(SignUpDTO dto);

    UserResponseDTO toDto(User user);
}
