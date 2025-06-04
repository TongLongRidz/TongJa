package com.example.library_api.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class ReportTopBookDto {

    private String bookCode;
    private String bookNameTh;
    private String bookNameEn;
    private Integer totalView;


    public ReportTopBookDto(){}

    public ReportTopBookDto(String bookCode, String bookNameTh, String bookNameEn, Integer totalView) {
        this.bookCode = bookCode;
        this.bookNameTh = bookNameTh;
        this.bookNameEn = bookNameEn;
        this.totalView = totalView;
    }
}
