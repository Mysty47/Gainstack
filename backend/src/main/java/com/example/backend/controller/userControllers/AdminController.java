package com.example.backend.controller.userControllers;

import com.example.backend.dto.userDTOs.UserDTO;
import com.example.backend.service.userServices.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AdminController {

    private final UserService userService;

    @GetMapping("/currentUser")
    public UserDTO currentUser(Authentication authentication) {
        return userService.getCurrentUser(authentication.getName());
    }
}
