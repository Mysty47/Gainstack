package com.example.backend.service;

import com.example.backend.dto.postDTOs.MinioPropertiesDTO;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.SetBucketPolicyArgs;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MinioService {

    private final MinioClient minioClient;
    private final MinioPropertiesDTO dto;

    @PostConstruct
    public void makeBucketPublic() throws Exception {

        String policy = """
        {
          "Version": "2012-10-17",
          "Statement": [
            {
              "Effect": "Allow",
              "Principal": "*",
              "Action": "s3:GetObject",
              "Resource": "arn:aws:s3:::%s/*"
            }
          ]
        }
        """.formatted(dto.getBucket());

        minioClient.setBucketPolicy(
                SetBucketPolicyArgs.builder()
                        .bucket(dto.getBucket())
                        .config(policy)
                        .build()
        );
    }


    public String upload(MultipartFile file) throws Exception {

        String filename =
                UUID.randomUUID() + "-" + file.getOriginalFilename();

        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(dto.getBucket())
                        .object(filename)
                        .stream(
                                file.getInputStream(),
                                file.getSize(),
                                -1
                        )
                        .contentType(file.getContentType())
                        .build()
        );

        return dto.getUrl()
                + "/"
                + dto.getBucket()
                + "/"
                + filename;
    }
}