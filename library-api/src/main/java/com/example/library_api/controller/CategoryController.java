package com.example.library_api.controller;

import com.example.library_api.dto.CategoryDto;
import com.example.library_api.dto.ResponseDto;
import com.example.library_api.entity.CategoryEntity;
import com.example.library_api.repository.CategoryRepository;
import com.example.library_api.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequestMapping(path = "/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    private final CategoryRepository categoryRepository;


//    @GetMapping("/{categoryId}/in-use")
//    public boolean isCategoryInUse(@PathVariable Long categoryId) {
//        return bookRepository.isCategoryInUse(categoryId);
//    }

    @GetMapping("getAllCategory")
    public ResponseEntity<List<CategoryEntity>> findAllDeletedCategories() {
        List<CategoryEntity> deletedCategories  = categoryService.gitAllDeleteCategory();
        return ResponseEntity.ok(deletedCategories );
    }

    @GetMapping("/all")
    public List<CategoryEntity> findCategory() {
        return categoryRepository.findAll();
    }

    @PostMapping("/postCategory")
    public ResponseEntity<?> postCategory(@RequestBody CategoryDto categoryDto) {
        ResponseDto responseDto = new ResponseDto();

        try {
            categoryService.newSaveCategory(categoryDto);

            responseDto.setStatus(200);
            responseDto.setDescription("บันทึกข้อมูลมวดหมู่สำเร็จ สำเร็จ");
            return  ResponseEntity.ok(responseDto);
        } catch (Exception e) {

            responseDto.setStatus(500);
            responseDto.setDescription("บันทึกหมวดหมู่ ไม่สำเร็จ");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
        }
    }

    @PutMapping("/putcategory/{id}")
    public ResponseEntity<?> updateCategory(@RequestBody CategoryDto categoryDto) {
        ResponseDto responseDto = new ResponseDto();
        try {
            categoryService.updateCategory(categoryDto);

            responseDto.setStatus(200);
            responseDto.setDescription("แก้ไขหมวดหมู่ สำเร็จ");
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            responseDto.setStatus(500);
            responseDto.setDescription("แก้ไขหมวดหมู่ ไม่สำเร็จ");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
        }
    }

    @DeleteMapping("/deleteCategory/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        ResponseDto responseDto = new ResponseDto();
        try {
            categoryService.softDeleteCategory(id);

            responseDto.setStatus(200);
            responseDto.setDescription("ลบหมวดหมู่ ลำเร็จ");
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {

            responseDto.setStatus(500);
            responseDto.setDescription("ไม่สามารถลบหมวดหมู่ ID : "+ id);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
        }
    }


    @PostMapping("/search")
    @ResponseStatus(HttpStatus.OK)
    public Page<CategoryEntity> searchCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "true") boolean sort,
            @RequestBody CategoryDto keyDTO ) {

        Pageable pageable = sort
                ? PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "id"))
                : PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        return categoryService.getKeyword(keyDTO.getKeyword(), pageable);
    }

    @GetMapping("/checkAllCategoryCodes")
    public List<String> checkAllCategoryCodes() {
        return categoryService.getAllCategoryCodesInUse();
    }

} // end
