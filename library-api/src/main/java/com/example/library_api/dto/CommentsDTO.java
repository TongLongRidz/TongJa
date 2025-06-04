package com.example.library_api.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
public class CommentsDTO {
    private Long id;
    private String bookCode;
    private String profileCode;
    private String firstName;
    private String lastName;
    private String commentText;
    private String image;
    private LocalDateTime createAt;

    public CommentsDTO(Long id, String bookCode, String profileCode, String firstName, String lastName, String commentText, String image, LocalDateTime createAt) {
        this.id = id;
        this.bookCode = bookCode;
        this.profileCode = profileCode;
        this.firstName = firstName;
        this.lastName = lastName;
        this.commentText = commentText;
        this.image = image;
        this.createAt = createAt;
    }
}
