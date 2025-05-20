package com.testing.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name="Movie")
public class MovieEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "movie_sequence")
    @SequenceGenerator(name = "movie_sequence", sequenceName = "movie_sequence",
            initialValue = 1, allocationSize = 1)
    private Long id;

    @ManyToMany
    @JoinTable(
            name="movie_genre",
            joinColumns=@JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private List<GenreEntity> genre;

    private String title;

    private String description;

    private int releaseYear;
}