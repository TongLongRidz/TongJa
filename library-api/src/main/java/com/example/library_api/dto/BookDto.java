package com.example.library_api.dto;

import lombok.Data;

@Data
public class BookDto {
    private Long id;
    private String bookCode;
    private String bookBarCode;
    private String bookNameTh;
    private String bookNameEn;
    private String bookImage;
    private String categoryCode;
    private String categoryName;
    private Integer bookStatus;
    private Integer isDelete;
    private Integer status;
    private String keyword;
    private String profileCode;
    private Integer countBook;

    public BookDto() {

    }

    public BookDto(Long id, String bookCode, String bookBarCode, String bookNameTh,
                   String bookNameEn, String bookImage, String categoryCode,
                   String categoryName, Integer bookStatus, Integer isDelete,
                   Integer status, String keyword) {
        this.id = id;
        this.bookCode = bookCode;
        this.bookBarCode = bookBarCode;
        this.bookNameTh = bookNameTh;
        this.bookNameEn = bookNameEn;
        this.bookImage = bookImage;
        this.categoryCode = categoryCode;
        this.categoryName = categoryName;
        this.bookStatus = bookStatus;
        this.isDelete = isDelete;
        this.status = status;
        this.keyword = keyword;
    }


    public BookDto(Long id, String bookNameTh, String bookNameEn, String categoryCode, Integer countBook) {
        this.id = id;
        this.bookNameTh = bookNameTh;
        this.bookNameEn = bookNameEn;
        this.categoryCode = categoryCode;
        this.countBook = countBook;
    }

    public BookDto(Long id, String bookCode, String bookBarCode, String bookNameTh, String bookNameEn,
                   String bookImage, String categoryName, int bookStatus, int isDelete) {
        this.id = id;
        this.bookCode = bookCode;
        this.bookBarCode = bookBarCode;
        this.bookNameTh = bookNameTh;
        this.bookNameEn = bookNameEn;
        this.bookImage = bookImage;
        this.categoryName = categoryName;
        this.bookStatus = bookStatus;
        this.isDelete = isDelete;
    }


}


