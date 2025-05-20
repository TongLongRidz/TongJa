package com.testing.controller;

import com.testing.entity.GenreEntity;
import com.testing.service.GenreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/genres")
@RequiredArgsConstructor
@Slf4j
public class GenreController {
    private final GenreService genreService;

    @PostMapping
    public ResponseEntity<GenreEntity> createGenre(@RequestBody GenreEntity genreEntity) {
        GenreEntity genre = genreService.addGenre(genreEntity);
        return ResponseEntity.status(HttpStatus.CREATED).body(genre);
    }

    @GetMapping("list")
    public ResponseEntity<List<GenreEntity>> getGenres() {
        return ResponseEntity.ok(genreService.getAllGenre());
    }
}
