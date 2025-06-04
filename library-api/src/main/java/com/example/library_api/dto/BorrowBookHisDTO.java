package com.example.library_api.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Getter
@Setter
public class BorrowBookHisDTO {

    private Long id;
    private LocalDate borrowStart;
    private LocalDate borrowEnd;
    private int borrowDays;
    private String bookCode;
    private String borrowCode;
    private int borrowStatus;
    private int isDelete;
    private LocalDateTime returnDate;
    private String profileCode;

    private String firstName;
    private String lastName;

    private String bookNameTh;
    private String bookNameEn;

    private String keyword;
    private boolean status;
    String newEndDate;

    public BorrowBookHisDTO(Long id, LocalDate borrowStart, LocalDate borrowEnd, int borrowDays, String bookCode, String borrowCode, int borrowStatus, int isDelete, LocalDateTime returnDate, String profileCode, String firstName, String lastName, String bookNameTh, String bookNameEn) {
        this.id = id;
        this.borrowStart = borrowStart;
        this.borrowEnd = borrowEnd;
        this.borrowDays = borrowDays;
        this.bookCode = bookCode;
        this.borrowCode = borrowCode;
        this.borrowStatus = borrowStatus;
        this.isDelete = isDelete;
        this.returnDate = returnDate;
        this.profileCode = profileCode;
        this.firstName = firstName;
        this.lastName = lastName;
        this.bookNameTh = bookNameTh;
        this.bookNameEn = bookNameEn;
    }





}
