package com.example.library_api.dto;


import com.example.library_api.entity.BookEntity;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL) // ไม่รวมค่า null
public class FavoriteDTO {

    private Long id;
    private String favoriteCode;
    private String bookCode;
    private Integer favoriteStatus;
    private Integer isDelete;
    private String profileCode;
    private String bookImage;
    private String bookNameTh;
    private String bookNameEn;
    private String categoryCode;
    private String categoryName;
    private String keyword;

    public FavoriteDTO(){

    }

    public FavoriteDTO(Long id, String favoriteCode, String bookCode, String categoryCode, String categoryName,
                       Integer favoriteStatus, Integer isDelete, String profileCode, String bookImage,
                       String bookNameTh, String bookNameEn) {
        this.id = id;
        this.favoriteCode = favoriteCode;
        this.bookCode = bookCode;
        this.categoryCode = categoryCode;
        this.categoryName = categoryName;
        this.favoriteStatus = favoriteStatus;
        this.isDelete = isDelete;
        this.profileCode = profileCode;
        this.bookImage = bookImage;
        this.bookNameTh = bookNameTh;
        this.bookNameEn = bookNameEn;
    }

    public FavoriteDTO(String categoryCode, String categoryName) {
        this.categoryCode = categoryCode;
        this.categoryName = categoryName;
    }











}