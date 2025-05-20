package com.testing.service;

import com.testing.dto.MovieDto;
import com.testing.entity.GenreEntity;
import com.testing.entity.MovieEntity;
import com.testing.entity.RoleEntity;
import com.testing.repository.GenreRepository;
import com.testing.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieService {
    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;

    public List<MovieEntity> getAllMovie(){
        return movieRepository.findAll();
    }

    public MovieEntity addMovie(MovieDto movieDto) {
        MovieEntity movie = new MovieEntity();
//        movie.setId(movieEntity.getId());
        List<GenreEntity> genres = genreRepository.findAllById(movieDto.getGenreIds());
        movie.setGenre(genres);
        movie.setTitle(movieDto.getTitle());
        movie.setDescription(movieDto.getDescription());
        movie.setReleaseYear(movieDto.getReleaseYear());

        return movieRepository.save(movie);
    }

    public MovieEntity editMovieGenresById(Long id, List<Long> genreIds) {
        MovieEntity movie = movieRepository.findById(id).get();
        List<GenreEntity> genres = genreRepository.findAllById(genreIds);
        movie.setGenre(genres);

        return movieRepository.save(movie);
    }

    public void deleteMovieById(Long id) {
        MovieEntity movie = movieRepository.findById(id).get();
        movieRepository.delete(movie);
    }
}
