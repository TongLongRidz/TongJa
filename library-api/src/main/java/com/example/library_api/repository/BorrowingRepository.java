package com.example.library_api.repository;
import com.example.library_api.dto.BorrowingBookDTO;
import com.example.library_api.dto.BorrowBookHisDTO;
import com.example.library_api.dto.TopBooksResponseDTO;
import com.example.library_api.entity.BorrowingEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import java.util.Comparator;
import java.util.List;

public interface BorrowingRepository extends JpaRepository<BorrowingEntity, Long> {

    @Query("SELECT new com.example.library_api.dto.BorrowingBookDTO(b.id, b.borrowStart, b.borrowEnd, b.borrowDays, b.bookCode, b.borrowCode, b.borrowStatus, b.isDelete, b.returnDate, b.profileCode, pr.firstName, pr.lastName, bk.bookNameTh, bk.bookNameEn) " +
            "FROM BorrowingEntity b " +
            "JOIN BookEntity bk ON b.bookCode = bk.bookCode " +
            "JOIN ProfileEntity pr ON b.profileCode = pr.profileCode " +
            "WHERE b.isDelete = :isDelete")
    List<BorrowingBookDTO> findAllByIsDelete(@Param("isDelete") Integer isDelete, Sort sort);



    @Query("SELECT new com.example.library_api.dto.BorrowingBookDTO(b.id, b.borrowStart, b.borrowEnd, b.borrowDays, b.bookCode, b.borrowCode, b.borrowStatus, b.isDelete, b.returnDate, b.profileCode, pr.firstName, pr.lastName, bk.bookNameTh, bk.bookNameEn) " +
            "FROM BorrowingEntity b " +
            "JOIN BookEntity bk ON b.bookCode = bk.bookCode " +
            "JOIN ProfileEntity pr ON b.profileCode = pr.profileCode " +
            "WHERE ( " +
            "   (LOWER(CASE WHEN :lang = 'th' THEN bk.bookNameTh ELSE bk.bookNameEn END) LIKE LOWER(CONCAT('%', :searchKey, '%'))) " +
            "   OR LOWER(pr.firstName) LIKE LOWER(CONCAT('%', :searchKey, '%')) " +
            "   OR LOWER(pr.lastName) LIKE LOWER(CONCAT('%', :searchKey, '%')) " +
            ") " +
            "AND b.isDelete = :isDelete ")
    Page<BorrowingBookDTO> searchBorrowBook(
            @Param("searchKey") String searchKey,
            @Param("isDelete") int isDelete,
            Pageable pageable,
            @Param("lang") String lang
    );


    @Query("SELECT new com.example.library_api.dto.BorrowingBookDTO(b.id, b.borrowStart, b.borrowEnd, b.borrowDays, b.bookCode, b.borrowCode, b.borrowStatus, b.isDelete, b.returnDate, b.profileCode, pr.firstName, pr.lastName, bk.bookNameTh, bk.bookNameEn) " +
            "FROM BorrowingEntity b " +
            "JOIN BookEntity bk ON b.bookCode = bk.bookCode " +
            "JOIN ProfileEntity pr ON b.profileCode = pr.profileCode " +
            "WHERE b.id = :id")
    Optional<BorrowingBookDTO> findByIdBorrowingWithBook(@Param("id") Long id);

    @Query("SELECT b.borrowCode FROM BorrowingEntity b WHERE b.borrowCode LIKE 'BR%' AND LENGTH(b.borrowCode) = 5")
    List<String> findAllBorrowCodes();

    default Integer findMaxBorrowCode() {
        List<String> allBorrowCodes = findAllBorrowCodes();

        Optional<String> maxBorrowCode = allBorrowCodes.stream()
                .filter(code -> code.matches("^BR\\d{3}$"))
                .max(Comparator.naturalOrder());

        return maxBorrowCode.map(code -> Integer.parseInt(code.substring(2))).orElse(0); // Update to get digits correctly
    }

    @Query("SELECT MAX(CAST(SUBSTRING(b.borrowCode, 3) AS int)) FROM BorrowingEntity b WHERE b.borrowCode LIKE 'BR%'")
    Integer findMaxBorrowingCodes();

    @Query("SELECT MAX(CAST(SUBSTRING(n.notiCode, 3) AS int)) FROM NotificationEntity n WHERE n.notiCode LIKE 'NT%'")
    Integer findMaxNotiCodes();

    @Query("SELECT new com.example.library_api.dto.BorrowBookHisDTO(b.id, b.borrowStart, b.borrowEnd, b.borrowDays, b.bookCode, b.borrowCode, b.borrowStatus, b.isDelete, b.returnDate, b.profileCode, pr.firstName, pr.lastName, bk.bookNameTh, bk.bookNameEn) " +
            "FROM BorrowingEntity b " +
            "JOIN BookEntity bk ON b.bookCode = bk.bookCode " +
            "JOIN ProfileEntity pr ON b.profileCode = pr.profileCode " +
            "WHERE (LOWER(b.borrowCode) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
//            "OR LOWER(b.borrowCode) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(bk.bookNameTh) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(bk.bookNameEn) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND b.isDelete = :isDelete " +
            "AND (:status = -1 OR b.borrowStatus = :status) "
            )
    Page<BorrowBookHisDTO> getByBorrowKey(
            @Param("keyword") String keyword,
            @Param("isDelete") int isDelete,
            @Param("status") Integer status,
            Pageable pageable
    );

    @Query("SELECT new com.example.library_api.dto.BorrowBookHisDTO(b.id, b.borrowStart, b.borrowEnd, b.borrowDays, b.bookCode, b.borrowCode, b.borrowStatus, b.isDelete, b.returnDate, b.profileCode, pr.firstName, pr.lastName, bk.bookNameTh, bk.bookNameEn) " +
            "FROM BorrowingEntity b " +
            "JOIN BookEntity bk ON b.bookCode = bk.bookCode " +
            "JOIN ProfileEntity pr ON b.profileCode = pr.profileCode " +
            "WHERE (" +
            "LOWER(b.borrowCode) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(CONCAT(pr.firstName,' ',pr.lastName)) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(CONCAT(pr.firstName,pr.lastName)) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(bk.bookNameEn) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(bk.bookNameTh) LIKE LOWER(CONCAT('%', :keyword, '%'))" +
            ") " +
            "AND b.isDelete = :isDelete " +
            "AND (:status = -1 OR b.borrowStatus = :status) " +
            "AND b.profileCode = :profileCode"
    )
    Page<BorrowBookHisDTO> getByMyHistory(
            @Param("keyword") String keyword,
            @Param("isDelete") int isDelete,
            @Param("status") Integer status,
            @Param("profileCode") String profileCode,
            Pageable pageable
    );


    @Query("SELECT new com.example.library_api.dto.BorrowBookHisDTO(b.id, b.borrowStart, b.borrowEnd, b.borrowDays, b.bookCode, b.borrowCode, b.borrowStatus, b.isDelete, b.returnDate, b.profileCode, pr.firstName, pr.lastName, bk.bookNameTh, bk.bookNameEn) " +
            "FROM BorrowingEntity b " +
            "JOIN BookEntity bk ON b.bookCode = bk.bookCode " +
            "JOIN ProfileEntity pr ON b.profileCode = pr.profileCode " +
            "WHERE (" +
            "LOWER(b.borrowCode) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(CONCAT(pr.firstName,' ',pr.lastName)) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(CONCAT(pr.firstName,pr.lastName)) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(CONCAT(pr.firstName, '', pr.lastName)) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(bk.bookNameEn) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(bk.bookNameTh) LIKE LOWER(CONCAT('%', :keyword, '%'))" +
            ") " +
            "AND b.isDelete = :isDelete " +
            "AND b.borrowStatus = :status " +
            "AND b.profileCode = :profileCode"
    )
    Page<BorrowBookHisDTO> getByMyListBorrow(
            @Param("keyword") String keyword,
            @Param("isDelete") int isDelete,
            @Param("status") Integer status,
            @Param("profileCode") String profileCode,
            Pageable pageable
    );




    @Query("SELECT br FROM BorrowingEntity br WHERE br.bookCode = :bookCode AND br.isDelete = 0")
    List<BorrowingEntity> findBorrowingsByBookCodeAll(@Param("bookCode") String bookCode);

    @Query("SELECT new com.example.library_api.dto.BorrowingBookDTO(br.id, br.borrowStart, br.borrowEnd, br.borrowDays, br.profileCode, pr.image, pr.firstName, pr.lastName) " +
            "FROM BorrowingEntity br " +
            "JOIN ProfileEntity pr ON br.profileCode = pr.profileCode " +
            "WHERE br.bookCode = :bookCode " +
            "AND br.isDelete = 0 " +
            "AND br.borrowStart BETWEEN :sevenDaysAgo AND :today")
    List<BorrowingBookDTO> findBorrowingsByBookCodeWeek(
            @Param("bookCode") String bookCode,
            @Param("sevenDaysAgo") LocalDate sevenDaysAgo,
            @Param("today") LocalDate today);

    Optional<BorrowingEntity> findBorrowImageById(Long id);


    List<BorrowingEntity> findAllByIsDeleteAndBorrowStatus(Integer isDelete, Integer borrowStatus);


    @Query("SELECT COUNT(b) FROM BorrowingEntity b WHERE b.isDelete = 0")
    long countTotalBorrowings();


    @Query("SELECT COUNT(b) FROM BorrowingEntity b WHERE  b.borrowStatus = 0 AND b.isDelete = 0")
    long countActiveBorrowings();

    @Query("SELECT COUNT(b) FROM BorrowingEntity b WHERE b.borrowStatus = 1 AND b.isDelete = 0")
    long countReturnedBooks();

    @Query("SELECT COUNT(DISTINCT b.profileCode) FROM BorrowingEntity b WHERE b.isDelete = 0")
    long countDistinctBorrowers();


    @Query("SELECT COUNT(0) FROM BorrowingEntity b WHERE b.returnDate IS NULL AND b.borrowEnd < CURRENT_DATE AND b.isDelete = 0")
    long countOverdueReturns();


    @Query("SELECT b FROM BorrowingEntity b WHERE "
            + "(:start IS NULL OR b.borrowStart BETWEEN :start AND :end) "
            + "AND b.isDelete = 0")
    Page<BorrowingEntity> findByBorrowStartBetweenAndIsDelete(
            @Param("start") LocalDate start,
            @Param("end") LocalDate end,
            Pageable pageable
    );

    List<BorrowingEntity> findAllByIsDeleteFalse();


    @Query("SELECT b FROM BorrowingEntity b WHERE "
            + "(COALESCE(:start, null) IS NULL OR b.borrowStart >= :start) "
            + "AND (COALESCE(:end, null) IS NULL OR b.borrowStart <= :end) "
            + "AND b.isDelete = 0")
    Page<BorrowingEntity> findByBorrowStartAndIsDelete(
            @Param("start") LocalDate start,
            @Param("end") LocalDate end,
            Pageable pageable
    );

    @Query("SELECT COUNT(b) FROM BorrowingEntity b WHERE b.bookCode = :bookCode AND b.isDelete = 0")
    int findTotalBook(@Param("bookCode") String bookCode);

    //    Page<BorrowingEntity> findByBorrowStartBetweenAndIsDelete(LocalDate startDate, LocalDate endDate, Integer isDelete, Pageable  pageable);

    Optional<BorrowingEntity> findByBookCode(String bookCode);


    List<BorrowingEntity> findAllByIsDeleteFalseAndBorrowStartBetween(LocalDate startDate, LocalDate endDate);


    @Query("SELECT COUNT(b) FROM BorrowingEntity b WHERE b.isDelete = 0 AND b.bookCode = :bookCode AND b.borrowStart BETWEEN :startDate AND :endDate")
    int findTotalBookBetweenDates(@Param("bookCode") String bookCode, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(br) FROM BorrowingEntity br WHERE br.bookCode = :bookCode AND br.isDelete = 0")
    int findBorrowCountByBookCode(@Param("bookCode") String bookCode);


    @Query("SELECT b FROM BorrowingEntity b " +
            "JOIN BookEntity bk ON b.bookCode = bk.bookCode " +
            "WHERE YEAR(b.borrowStart) = :year " +
            "AND b.isDelete = 0 " +
            "AND (:categoryCode IS NULL OR bk.categoryCode = :categoryCode)")
    List<BorrowingEntity> findBorrowingsByYearAndCategory(
            @Param("year") int year,
            @Param("categoryCode") String categoryCode);


    @Query("SELECT b FROM BorrowingEntity b " +
            "WHERE EXTRACT(MONTH FROM b.borrowStart) = :month " +
            "AND EXTRACT(YEAR FROM b.borrowStart) = :year " +
            "AND b.isDelete = 0")
    List<BorrowingEntity> findByBorrowStartMonthAndYear(@Param("month") int month, @Param("year") int year);



    @Query(value = """
        SELECT b.BOOK_CODE, COUNT(b.BOOK_CODE) AS borrow_count
        FROM BORROWING_HISTORY b
        WHERE b.IS_DELETED = 0
        AND (:month IS NULL OR EXTRACT(MONTH FROM b.BORROW_START) = :month)
        AND (:year IS NULL OR EXTRACT(YEAR FROM b.BORROW_START) = :year)
        GROUP BY b.BOOK_CODE
        ORDER BY borrow_count DESC
        LIMIT 5
    """, nativeQuery = true)
    List<Object[]> findTopBorrowedBooks(Integer month, Integer year);


    @Query(value = "SELECT b.book_code, COUNT(b.id) as total_borrowed " +
            "FROM borrowing_entity b " +
            "WHERE MONTH(b.borrow_start) = :month AND YEAR(b.borrow_start) = :year " +
            "GROUP BY b.book_code " +
            "ORDER BY total_borrowed DESC " +
            "FETCH FIRST 10 ROWS ONLY",
            nativeQuery = true)
    List<Object[]> findTopBooksByMonthAndYear(@Param("month") int month, @Param("year") int year);

    @Query(value = "SELECT b.book_code, COUNT(b.id) as total_borrowed " +
            "FROM borrowing_entity b " +
            "GROUP BY b.book_code " +
            "ORDER BY total_borrowed DESC " +
            "FETCH FIRST 10 ROWS ONLY",
            nativeQuery = true)
    List<Object[]> findAllTopBooks();



    @Query("SELECT new com.example.library_api.dto.TopBooksResponseDTO( " +
            "c.categoryName, " +
            "SUM(CASE WHEN b.borrowStatus = 1 THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN b.borrowStatus = 0 THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN b.returnDate IS NULL AND b.borrowEnd < CURRENT_DATE THEN 1 ELSE 0 END)) " +
            "FROM BorrowingEntity b " +
            "JOIN BookEntity bk ON b.bookCode = bk.bookCode " +
            "JOIN CategoryEntity c ON bk.categoryCode = c.categoryCode " +
            "WHERE b.isDelete = 0 " +
            "AND bk.isDelete = 0 " +
            "AND (:category IS NULL OR bk.categoryCode = :category) " +
            "AND (CAST(:startDate AS date) IS NULL OR b.borrowStart >= :startDate) " +
            "AND (CAST(:endDate AS date) IS NULL OR b.borrowStart <= :endDate) " +
            "GROUP BY c.categoryName " +
            "ORDER BY c.categoryName")
    List<TopBooksResponseDTO> getBorrowingSummaryByCategory(
            @Param("category") String category,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );




    @Query("SELECT new com.example.library_api.dto.TopBooksResponseDTO( " +
            "c.categoryName, " +
            "SUM(CASE WHEN b.borrowStatus = 1 THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN b.borrowStatus = 0 THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN b.returnDate IS NULL AND b.borrowEnd < CURRENT_DATE THEN 1 ELSE 0 END)) " +
            "FROM BorrowingEntity b " +
            "JOIN BookEntity bk ON b.bookCode = bk.bookCode " +
            "JOIN CategoryEntity c ON bk.categoryCode = c.categoryCode " +
            "WHERE b.isDelete = 0 " +
            "AND bk.isDelete = 0 " +
            "AND (:category IS NULL OR bk.categoryCode = :category) " +
            "AND (:startDate IS NULL OR b.borrowStart >= :startDate) " +
            "AND (:endDate IS NULL OR b.borrowStart <= :endDate) " +
            "GROUP BY c.categoryName " +
            "ORDER BY c.categoryName")
    List<TopBooksResponseDTO> getBorrowingSummaryByCategory1(
            @Param("category") String category,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );



} // end
