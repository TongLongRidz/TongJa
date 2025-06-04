package com.example.library_api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "BOOK_COMMENTS")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BOOK_COMMENTS_SEQ")
    @SequenceGenerator(name = "BOOK_COMMENTS_SEQ", sequenceName = "BOOK_COMMENTS_SEQ", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @Column(name = "BOOK_CODE")
    private String bookCode;

    @Column(name = "PROFILE_CODE")
    private String profileCode;

    @Column(name = "COMMENT_TEXT")
    private String commentText;

    @Column(name = "CREATE_AT")
    private LocalDateTime createAt;

    @Column(name = "IS_DELETE")
    private Integer isDelete;

}
