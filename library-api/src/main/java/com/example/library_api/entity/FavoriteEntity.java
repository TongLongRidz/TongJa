package com.example.library_api.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "FAVORITE_BOOKS")
public class FavoriteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "FAVORITE_BOOK_SEQ")
    @SequenceGenerator(name = "FAVORITE_BOOK_SEQ", sequenceName = "FAVORITE_BOOK_SEQ", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @Column(name= "FAVORITE_CODE")
    private String favoriteCode;

    @Column(name= "BOOK_CODE")
    private String bookCode;


    @Column(name= "PROFILE_CODE")
    private String profileCode;


    @Column(name= "IS_DELETE")
    private Integer isDelete;

    @Column(name= "FAVORITE_STATUS")
    private Integer favoriteStatus;
}
