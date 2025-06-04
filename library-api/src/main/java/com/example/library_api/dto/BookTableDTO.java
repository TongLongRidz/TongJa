package com.example.library_api.dto;

import lombok.Data;

@Data
public class BookTableDTO {
    private Long id;
    private String bookCode;
    private String bookNameTh;
    private String bookNameEn;
    private Integer bookStatus;

    public BookTableDTO(Long id, String bookCode, String bookNameTh, String bookNameEn, Integer bookStatus) {
        this.id = id;
        this.bookCode = bookCode;
        this.bookNameTh = bookNameTh;
        this.bookNameEn = bookNameEn;
        this.bookStatus = bookStatus;
    }
}
