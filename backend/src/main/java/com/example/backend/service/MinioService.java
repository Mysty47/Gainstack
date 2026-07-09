package com.example.backend.service;

import com.example.backend.properties.MinioProperties;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MinioService {

    private final MinioClient minioClient;
    private final MinioProperties properties;


    public String upload(MultipartFile file) throws Exception {

        String filename =
                UUID.randomUUID() + "-" + file.getOriginalFilename();


        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(properties.getBucket())
                        .object(filename)
                        .stream(
                                file.getInputStream(),
                                file.getSize(),
                                -1
                        )
                        .contentType(file.getContentType())
                        .build()
        );


        return properties.getUrl()
                + "/"
                + properties.getBucket()
                + "/"
                + filename;
    }
}