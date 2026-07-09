package com.example.backend.dto.postDTOs;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;


@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "minio")
public class MinioPropertiesDTO {

    private String url;
    private String accessKey;
    private String secretKey;
    private String bucket;
}