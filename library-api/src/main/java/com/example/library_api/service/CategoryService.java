package com.example.library_api.service;

import com.example.library_api.dto.CategoryDto;
import com.example.library_api.entity.CategoryEntity;
import com.example.library_api.repository.BookRepository;
import com.example.library_api.repository.CategoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class CategoryService {

    @Autowired
    private final CategoryRepository categoryRepository;

    @Autowired
    private BookRepository bookRepository;

    // private final Map<String, Integer> categoryCodeMap = new HashMap<>();

    public List<CategoryEntity> getAllCategory() {
        return categoryRepository.findAll();
    }

    public  List<CategoryEntity> gitAllDeleteCategory() {
        return categoryRepository.findByIsDelete(0);
    }

    public CategoryEntity saveCategory(CategoryEntity categoryEntity) {
        return categoryRepository.save(categoryEntity);
    }

    public void newSaveCategory(CategoryDto categoryDto) {
//        Integer maxCategoryID = categoryRepository.findMaxCategoryCode();
//        HashMap<String, String> genHash = new HashMap<>();
//        genHash.put("codeName", "C");
//        genHash.put("genID", String.format("%03d", maxCategoryID + 1));
//        String genCategoryCode = genHash.get("codeName") + genHash.get("genID");

        Integer maxCategoryID = categoryRepository.findMaxCategoryCodes();
        if (maxCategoryID == null) {
            maxCategoryID = 0;
        }
        String genCategoryCode = "C" + String.format("%03d", maxCategoryID + 1);
        CategoryEntity categoryEntity = new CategoryEntity();
        categoryEntity.setCategoryCode(genCategoryCode);
        categoryEntity.setCategoryName(categoryDto.getCategoryName());
        categoryEntity.setIsDelete(0);
         CategoryEntity savedCategory = saveCategory(categoryEntity);
    }

    public void updateCategory(CategoryDto categoryDto) {
        CategoryEntity existingCategory = categoryRepository.findByCategoryCode(categoryDto.getCategoryCode());
        if (existingCategory != null) {
            existingCategory.setCategoryName(categoryDto.getCategoryName());
            existingCategory.setIsDelete(0);
            saveCategory(existingCategory);
        } else {
            throw new RuntimeException("Category not found");
        }
    }

    @Transactional
    public  void softDeleteCategory(Long id) {
        CategoryEntity category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found "));
        category.setIsDelete(1);
        categoryRepository.save(category);
    }


    public Page<CategoryEntity> getKeyword(String keyword, Pageable pageable) {
        return categoryRepository.getByCategoryKey(keyword, pageable);
    }



    public List<String> getAllCategoryCodesInUse() {
        return bookRepository.findAllCategoryCodesInUse();
    }










}
