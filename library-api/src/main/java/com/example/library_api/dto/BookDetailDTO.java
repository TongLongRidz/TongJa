package com.example.library_api.dto;

import com.example.library_api.entity.BookEntity;
import com.example.library_api.entity.CategoryEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookDetailDTO {
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
    private Integer totalBorrow;
    private List<BorrowingBookDTO> borrowings;

    public void setAll(BookEntity book, CategoryEntity category, List<BorrowingBookDTO> borrowings) {
        this.id = book.getId();
        this.bookCode = book.getBookCode();
        this.bookBarCode = book.getBookBarCode();
        this.bookNameTh = book.getBookNameTh();
        this.bookNameEn = book.getBookNameEn();
        this.bookImage = book.getBookImage();
        this.categoryCode = book.getCategoryCode();
        this.categoryName = category.getCategoryName();
        this.bookStatus = book.getBookStatus();
        this.isDelete = book.getIsDelete();
        this.borrowings = borrowings;
    }
}
