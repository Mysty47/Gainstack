package com.example.backend.controller.userControllers;

import com.example.backend.service.postsServices.MinioService;
import com.example.backend.service.userServices.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/account")
@RequiredArgsConstructor
public class UserSettingsController {

    private final UserService userService;
    private final MinioService minioService;


    @PostMapping("/profile-picture")
    public void uploadProfilePicture(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) throws Exception {


        String imageUrl = minioService.upload(file, "/pfps");


        userService.updateProfilePicture(
                authentication.getName(),
                imageUrl
        );
    }
}