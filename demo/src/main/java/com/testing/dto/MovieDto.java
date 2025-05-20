package com.testing.dto;

import com.testing.entity.MovieEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MovieDto {
    private String title;
    private String description;
    private int releaseYear;
    private List<Long> genreIds;
}
