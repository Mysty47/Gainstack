package com.example.backend.service;

import com.example.backend.dto.postDTOs.MinioPropertiesDTO;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.SetBucketPolicyArgs;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MinioService {

    private final MinioClient minioClient;
    private final MinioPropertiesDTO dto;
    private final ImageCompressionService imageCompressionService;

    @PostConstruct
    public void makeBucketPublic() throws Exception {

        boolean bucketExists = minioClient.bucketExists(
                BucketExistsArgs.builder()
                        .bucket(dto.getBucket())
                        .build()
        );

        if (!bucketExists) {
            minioClient.makeBucket(
                    MakeBucketArgs.builder()
                            .bucket(dto.getBucket())
                            .build()
            );
        }

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

        byte[] compressedImage = imageCompressionService.compress(file);

        String filename = UUID.randomUUID() + ".jpg";

        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(dto.getBucket())
                        .object(filename)
                        .stream(
                                new ByteArrayInputStream(compressedImage),
                                compressedImage.length,
                                -1
                        )
                        .contentType("image/jpeg")
                        .build()
        );

        return dto.getUrl()
                + "/"
                + dto.getBucket()
                + "/"
                + filename;
    }
}
