package com.example.library_api.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "BOOK")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "book_seq")
    @SequenceGenerator(name = "book_seq", sequenceName = "book_seq", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @Column(name = "BOOK_CODE")
    private String bookCode;

    @Column(name = "BOOK_BARCODE")
    private String bookBarCode;

    @Column(name = "BOOK_NAME_TH")
    private String bookNameTh;

    @Column(name = "BOOK_NAME_EN")
    private String bookNameEn;

    @Column(name = "BOOK_IMAGE")
    private String bookImage;

    @Column(name = "BOOK_IMAGE_DIR")
    private String BookImageDir;

    @Column(name = "CATEGORY_CODE")
    private String categoryCode;

    @Column(name = "BOOK_STATUS")
    private Integer bookStatus;

    @Column(name = "IS_DELETED")
    private Integer isDelete;

    @Column(name = "TOTAL_VIEW")
    private Integer totalView = 0;
}
