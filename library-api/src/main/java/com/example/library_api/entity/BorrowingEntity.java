package com.example.library_api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Table(name = "BORROWING_HISTORY")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BorrowingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BORROWING_HISTORY_SEQ")
    @SequenceGenerator(name = "BORROWING_HISTORY_SEQ", sequenceName = "BORROWING_HISTORY_SEQ", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @Column(name = "BORROW_START")
    private LocalDate borrowStart;

    @Column(name = "BORROW_END")
    private LocalDate borrowEnd;

    @Column(name = "BORROW_DAYS")
    private int borrowDays;

    @Column(name = "BOOK_CODE")
    private String bookCode;

    @Column(name = "BORROW_CODE")
    private String borrowCode;

    @Column(name = "BORROW_STATUS")
    private int borrowStatus;

    @Column(name = "IS_DELETED")
    private int isDelete;

    @Column(name = "RETURN_DATE")
    private LocalDateTime returnDate;

    @Column(name = "PROFILE_CODE")
    private String profileCode;

    @Column(name = "BORROWBOOK_IMAGE")
    private  String borrowImage;

}
