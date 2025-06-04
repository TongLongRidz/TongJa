package com.example.library_api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BorrowingBookDTO {
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
    private String profileImage;

    private String firstName;
    private String lastName;

    private String bookNameTh;
    private String bookNameEn;

    private String keyword;
    String newEndDate;

    private String borrowImage;
    private String active;

    private int borrowCount;

    private List<BorrowingBookDTO> borrowList;


    public BorrowingBookDTO() {
    }

    public BorrowingBookDTO(Long id, LocalDate borrowStart, LocalDate borrowEnd, int borrowDays, String profileCode, String profileImage, String firstName, String lastName) {
        this.id = id;
        this.borrowStart = borrowStart;
        this.borrowEnd = borrowEnd;
        this.borrowDays = borrowDays;

        this.profileCode = profileCode;
        this.profileImage = profileImage;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public BorrowingBookDTO(Long id, LocalDate borrowStart, LocalDate borrowEnd, int borrowDays, String bookCode, String borrowCode, int borrowStatus, int isDelete, LocalDateTime returnDate, String profileCode, String firstName, String lastName, String bookNameTh, String bookNameEn) {
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

    public BorrowingBookDTO (String bookCode, String bookNameTh, String bookNameEn, int borrowCount) {
        this.bookCode = bookCode;
        this.bookNameTh = bookNameTh;
        this.bookNameEn = bookNameEn;
        this.borrowCount = borrowCount;
    }


    public BorrowingBookDTO (String profileCode, String profileImage, String firstName, String lastName, int borrowCount, List<BorrowingBookDTO> borrowList) {
        this.profileCode = profileCode;
        this.profileImage = profileImage;
        this.firstName = firstName;
        this.lastName = lastName;
        this.borrowCount = borrowCount;
        this.borrowList = borrowList;

    }

    public BorrowingBookDTO(String bookCode, String profileCode, String bookNameTh, String bookNameEn , LocalDate borrowStart, LocalDate borrowEnd, int borrowStatus) {
        this.bookCode = bookCode;
        this.profileCode = profileCode;
        this.bookNameTh = bookNameTh;
        this.bookNameEn = bookNameEn;
        this.borrowStart = borrowStart;
        this.borrowEnd = borrowEnd;
        this.borrowStatus = borrowStatus;
    }

    public BorrowingBookDTO ( String bookNameTh,  int borrowCount) {
        this.bookNameTh = bookNameTh;
        this.borrowCount = borrowCount;
    }

}


