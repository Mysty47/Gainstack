package com.example.backend.service;

import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class ImageCompressionService {

    public byte[] compress(MultipartFile file) throws IOException {

        System.out.println("ORIGINAL SIZE: " + file.getSize());

        ByteArrayOutputStream output = new ByteArrayOutputStream();

        Thumbnails.of(file.getInputStream())
                .size(1200, 1200)
                .outputQuality(0.75)
                .outputFormat("jpg")
                .toOutputStream(output);

        byte[] result = output.toByteArray();

        System.out.println("COMPRESSED SIZE: " + result.length);

        return result;
    }
}