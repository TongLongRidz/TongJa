package com.example.library_api.repository;

import com.example.library_api.dto.FavoriteDTO;
import com.example.library_api.entity.FavoriteEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<FavoriteEntity, Long> {

    Page<FavoriteEntity> findByProfileCodeAndFavoriteStatusAndIsDelete(String profileCode, int favoriteStatus, int isDelete , Pageable pageable );



    Page<FavoriteDTO> findByProfileCode(String profileCode, Pageable pageable);

    @Query("SELECT MAX(CAST(SUBSTRING(p.favoriteCode, 3) AS int)) FROM FavoriteEntity p WHERE p.favoriteCode LIKE 'FV%'")
    Integer findMaxFavorite();


    @Query("SELECT f FROM FavoriteEntity f " +
            "JOIN BookEntity b ON f.bookCode = b.bookCode " +
            "JOIN ProfileEntity p ON f.profileCode = p.profileCode " +
            "WHERE (COALESCE(:keyword, '') = '' OR " +
            "LOWER(f.favoriteCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(f.bookCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(f.profileCode) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND f.isDelete = 0 " +
            "AND f.favoriteStatus = 1 " +
            "AND p.profileCode = :profileCode"
    )
    Page<FavoriteEntity> getByFavoriteKey1(
            @Param("keyword") String keyword,
            @Param("profileCode") String profileCode,
            Pageable pageable
    );



    @Query("SELECT new com.example.library_api.dto.FavoriteDTO(f.id, f.favoriteCode, f.bookCode, b.categoryCode, c.categoryName, f.favoriteStatus, f.isDelete, f.profileCode, b.bookImage, b.bookNameTh, b.bookNameEn) " +
            "FROM FavoriteEntity f " +
            "JOIN BookEntity b ON f.bookCode = b.bookCode " +
            "JOIN ProfileEntity p ON f.profileCode = p.profileCode " +
            "JOIN CategoryEntity c ON b.categoryCode = c.categoryCode " +
            "WHERE (COALESCE(:keyword, '') = '' OR " +
            "LOWER(f.favoriteCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(f.bookCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(f.profileCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.categoryCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.categoryName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(b.bookNameTh) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(b.bookNameEn) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND f.isDelete = 0 " +
            "AND f.favoriteStatus = 1 " +
            "AND p.profileCode = :profileCode")
    Page<FavoriteDTO> getByFavoriteKey2(
            @Param("keyword") String keyword,
            @Param("profileCode") String profileCode,
            Pageable pageable);


    @Query("SELECT new com.example.library_api.dto.FavoriteDTO(f.id, f.favoriteCode, f.bookCode, b.categoryCode, c.categoryName, f.favoriteStatus, f.isDelete, f.profileCode, b.bookImage, b.bookNameTh, b.bookNameEn) " +
            "FROM FavoriteEntity f " +
            "JOIN BookEntity b ON f.bookCode = b.bookCode " +
            "JOIN ProfileEntity p ON f.profileCode = p.profileCode " +
            "JOIN CategoryEntity c ON b.categoryCode = c.categoryCode " +
            "WHERE (COALESCE(:keyword, '') = '' OR " +
            "LOWER(f.favoriteCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(f.bookCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(f.profileCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.categoryCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.categoryName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(b.bookNameTh) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(b.bookNameEn) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (COALESCE(:category, '') = '' OR LOWER(b.categoryCode) LIKE LOWER(CONCAT('%', :category, '%'))) " +  // แก้ไขวงเล็บให้ถูกต้อง
            "AND f.isDelete = 0 " +
            "AND f.favoriteStatus = 1 " +
            "AND p.profileCode = :profileCode ")
    Page<FavoriteDTO> getByFavoriteKey(
            @Param("keyword") String keyword,
            @Param("profileCode") String profileCode,
            @Param("category") String category,
            Pageable pageable);



    @Query("SELECT DISTINCT new com.example.library_api.dto.FavoriteDTO(c.categoryCode, c.categoryName) " +
            "FROM FavoriteEntity f " +
            "JOIN BookEntity b ON f.bookCode = b.bookCode " +
            "JOIN CategoryEntity c ON b.categoryCode = c.categoryCode " +
            "WHERE f.favoriteStatus = 1 " +
            "AND f.isDelete = 0 " +
            "AND f.profileCode = :profileCode")
    List<FavoriteDTO> getFavoriteCategoriesByProfile(@Param("profileCode") String profileCode);


    long countByProfileCodeAndFavoriteStatusAndIsDelete(String profileCode, int favoriteStatus, int isDelete);

    boolean existsByProfileCodeAndBookCodeAndFavoriteStatusAndIsDelete(String profileCode , String bookCode,int favoriteStatus, int isDelete);

    List<FavoriteEntity> findFavoriteByProfileCodeAndFavoriteStatusAndIsDelete(String profileCode ,  int favoriteStatus, int isDelete);

    Optional<FavoriteEntity> findByBookCodeAndProfileCodeAndFavoriteStatusAndIsDelete(String bookCode,String profileCoe,int favoriteStatus, int isDelete);



}
