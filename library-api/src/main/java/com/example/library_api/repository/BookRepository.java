package com.example.library_api.repository;

import com.example.library_api.dto.BookDto;
import com.example.library_api.dto.BookTableDTO;
import com.example.library_api.dto.ReportTopBookDto;
import com.example.library_api.entity.BookEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<BookEntity, Long> {
    BookEntity findByBookCode(String bookCodString);

    Optional<BookEntity> findByBookCodeAndIsDelete(String bookCode , int IsDelete);

    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM BookEntity b WHERE b.bookBarCode = :bookBarCode")
    boolean existsByBookBarCode(@Param("bookBarCode") String bookBarCode);


    @Query("SELECT MAX(CAST(SUBSTRING(b.bookCode, 2) AS int)) FROM BookEntity b WHERE b.bookCode LIKE 'B%'")
    Integer findMaxBookCode();

    @Query("SELECT new com.example.library_api.dto.BookTableDTO(b.id, b.bookCode, b.bookNameTh, b.bookNameEn, b.bookStatus) " +
            "FROM BookEntity b WHERE b.isDelete = :isDelete " +
            "AND (LOWER(b.bookCode) LIKE :searchKey " +
            "OR (CASE WHEN :lang = 'en' THEN LOWER(b.bookNameEn) ELSE LOWER(b.bookNameTh) END) LIKE :searchKey)")
    List<BookTableDTO> searchBooksByLanguage(
            @Param("searchKey") String searchKey,
            @Param("isDelete") Integer isDelete,
            @Param("lang") String lang,
            Sort sort);

    @Query("SELECT new com.example.library_api.dto.BookTableDTO(b.id, b.bookCode, b.bookNameTh, b.bookNameEn, b.bookStatus) " + "FROM BookEntity b WHERE b.isDelete = :isDelete")
    List<BookTableDTO> findAllByIsDelete(@Param("isDelete") Integer isDelete);

    @Query("SELECT new com.example.library_api.dto.BookTableDTO(b.id, b.bookCode, b.bookNameTh, b.bookNameEn, b.bookStatus) " + "FROM BookEntity b WHERE b.isDelete = :isDelete")
    Page<BookTableDTO> findAllByIsDeletePage(@Param("isDelete") Integer isDelete, Pageable pageable);

    @Query("SELECT b.categoryCode FROM BookEntity b WHERE b.categoryCode IS NOT NULL GROUP BY b.categoryCode")
    List<String> findAllCategoryCodesInUse();


    @Query("SELECT new com.example.library_api.dto.BookDto(b.id, b.bookCode, b.bookBarCode, b.bookNameTh, b.bookNameEn, b.bookImage, b.categoryCode, c.categoryName, b.bookStatus, b.isDelete, b.bookStatus, b.bookCode) " +
            "FROM BookEntity b LEFT JOIN CategoryEntity c ON b.categoryCode = c.categoryCode " +
            "WHERE (:categoryCode IS NULL OR b.categoryCode = :categoryCode) AND " +
            "(:status IS NULL OR (b.bookStatus = :status AND b.bookStatus IN (0, 1))) AND " +
            "b.isDelete = 0 "
            )
    Page<BookDto> findBooks(@Param("categoryCode") String categoryCode,
                            @Param("status") String status,
                            Pageable pageable);

    @Query("SELECT Book FROM BookEntity Book WHERE Book.bookCode = :bookCode AND Book.isDelete = 0")
    Optional<BookEntity> findBookByBookCode(@Param("bookCode") String bookCode);

    @Query("SELECT b FROM BookEntity b WHERE b.categoryCode = :categoryCode AND b.bookCode <> :bookCode AND b.isDelete = 0")
    Page<BookEntity> findRecommendByCategory(
            @Param("categoryCode") String categoryCode,
            @Param("bookCode") String bookCode,
            Pageable pageable);


    @Query("SELECT b.bookCode AS bookCode, COUNT(bh.id) AS borrowCount, b.totalView AS totalView " +
            "FROM BookEntity b " +
            "LEFT JOIN BorrowingEntity bh ON b.bookCode = bh.bookCode AND bh.isDelete = 0 " +
            "WHERE b.isDelete = 0 " +
            "GROUP BY b.bookCode, b.totalView")
    List<Object[]> findBookBorrowCounts();

    List<BookEntity> findAllByIsDeleteFalse();

    List<BookEntity> findAllByBookCodeIn(List<String> bookCodes);

    @Query("SELECT COUNT(b) FROM BookEntity b WHERE b.isDelete = 0")
    long countToTalBooks();

    @Query("SELECT COUNT(b) FROM BookEntity b WHERE b.isDelete = 0 AND b.bookStatus = 0")
    long countAvailableBooks();


    @Query("SELECT COUNT(b) FROM BookEntity b WHERE b.isDelete = 0 AND b.bookStatus = 1")
    long countBorrowedBooks();

    @Modifying
    @Query("UPDATE BookEntity b SET b.totalView = COALESCE(b.totalView, 0) + 1 WHERE b.id = :id")
    void incrementTotalViewById(Long id);

    @Query("SELECT new com.example.library_api.dto.ReportTopBookDto(b.bookCode, b.bookNameTh, b.bookNameEn, b.totalView) " +
            "FROM BookEntity b " +
            "WHERE b.isDelete = 0 " +
            "AND b.totalView IS NOT NULL " +
            "AND b.categoryCode = :categoryCode " +
            "ORDER BY b.totalView DESC")
    List<ReportTopBookDto> findTopViewedBooksByCategory(@Param("categoryCode") String categoryCode, Pageable pageable);

    @Query("SELECT new com.example.library_api.dto.ReportTopBookDto(b.bookCode, b.bookNameTh, b.bookNameEn, b.totalView) FROM BookEntity b WHERE b.isDelete = 0 AND b.totalView IS NOT NULL ORDER BY b.totalView DESC")
    List<ReportTopBookDto> findTopViewedBooks(Pageable pageable);



} //end




