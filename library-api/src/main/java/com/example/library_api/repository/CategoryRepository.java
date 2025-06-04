package com.example.library_api.repository;

import com.example.library_api.entity.BorrowingEntity;
import com.example.library_api.entity.CategoryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    List<CategoryEntity> findByIsDelete(int isDelete);

    CategoryEntity findByCategoryCode(String categoryCode);

    Optional<CategoryEntity> findByCategoryCodeAndIsDelete(String categoryCode ,int isDelete);


    @Query("SELECT c.categoryCode FROM CategoryEntity c WHERE c.categoryCode LIKE 'C%' AND LENGTH(c.categoryCode) = 4")
    List<String> findAllCategoryCodes();

    default Integer findMaxCategoryCode() {
        List<String> allCategoryCodes = findAllCategoryCodes();

        Optional<String> maxCategoryCode = allCategoryCodes.stream()
                .filter(code -> code.matches("^C\\d{3}$"))
                .max(Comparator.naturalOrder());

        return maxCategoryCode.map(code -> Integer.parseInt(code.substring(1))).orElse(0); // Return 0 if no valid maxBookCode
    }


    @Query("SELECT MAX(CAST(SUBSTRING(c.categoryCode, 2) AS int)) FROM CategoryEntity c WHERE c.categoryCode LIKE 'C%'")
    Integer findMaxCategoryCodes();

    @Query("SELECT c FROM CategoryEntity c " +
            "WHERE (:searchKey IS NULL OR :searchKey = '' OR TRIM(:searchKey) = '' OR " +
            "LOWER(c.categoryCode) LIKE LOWER(CONCAT('%', :searchKey, '%')) " +
            "OR LOWER(c.categoryName) LIKE LOWER(CONCAT('%', :searchKey, '%'))) " +
            "AND c.isDelete <> 1")
    Page<CategoryEntity> getByCategoryKey(@Param("searchKey") String searchKey, Pageable pageable);

    @Query("SELECT c FROM CategoryEntity c WHERE c.categoryCode = :categoryCode AND c.isDelete <> 1")
    Optional<CategoryEntity> findNameCategoryByCode(@Param("categoryCode") String categoryCode);

    List<CategoryEntity> findAllByIsDeleteFalse();
}



