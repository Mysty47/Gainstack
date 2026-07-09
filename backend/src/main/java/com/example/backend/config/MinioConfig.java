package com.example.backend.config;

import com.example.backend.dto.postDTOs.MinioPropertiesDTO;
import io.minio.MinioClient;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class MinioConfig {

    private final MinioPropertiesDTO dto;


    @Bean
    public MinioClient minioClient() {

        return MinioClient.builder()
                .endpoint(dto.getUrl())
                .credentials(
                        dto.getAccessKey(),
                        dto.getSecretKey()
                )
                .build();
    }
}