package com.example.library_api.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@Slf4j
@RequestMapping(path = "/api/video")
@RequiredArgsConstructor
public class VideoController {
    private final ResourceLoader resourceLoader;

    @GetMapping("/home")
    public ResponseEntity<Resource> getVideo() {
        Resource video = resourceLoader.getResource("file:" + Paths.get(System.getProperty("user.home"), ".temp", "home.mp4"));
        if (!video.exists()) {
            log.error("Video file not found: home.mp4");
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("video/mp4"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + video.getFilename() + "\"")
                .body(video);
    }
}
