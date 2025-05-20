package com.testing.controller;

import com.testing.dto.MovieDto;
import com.testing.entity.GenreEntity;
import com.testing.entity.MovieEntity;
import com.testing.service.MovieService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
@Slf4j
public class MovieController {
    private final MovieService movieService;

    @GetMapping
    public ResponseEntity<List<MovieEntity>> getAllMovie(){
        return ResponseEntity.ok(movieService.getAllMovie());
    }

    @PostMapping
    public ResponseEntity<MovieEntity> createMovie(@RequestBody MovieDto movieDto) {
        MovieEntity movie = movieService.addMovie(movieDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(movie);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MovieEntity> editMovieGenre(@PathVariable Long id, @RequestBody List<Long> genreIds){
        return ResponseEntity.ok(movieService.editMovieGenresById(id, genreIds));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<List<MovieEntity>> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovieById(id);
        return ResponseEntity.ok(movieService.getAllMovie());
    }
}
