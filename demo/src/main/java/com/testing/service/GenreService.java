package com.testing.service;

import com.testing.entity.GenreEntity;
import com.testing.entity.MovieEntity;
import com.testing.repository.GenreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GenreService {
    private final GenreRepository genreRepository;

    public GenreEntity addGenre(GenreEntity genreEntity) {
        GenreEntity genre = new GenreEntity();
//        genre.setId(genreEntity.getId());
        genre.setName(genreEntity.getName());

        return genreRepository.save(genre);
    }

    public List<GenreEntity> getAllGenre() {
        return genreRepository.findAll();
    }
}
