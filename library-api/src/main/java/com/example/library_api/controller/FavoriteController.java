package com.example.library_api.controller;

import com.example.library_api.dto.*;
import com.example.library_api.entity.BookEntity;
import com.example.library_api.entity.CategoryEntity;
import com.example.library_api.entity.FavoriteEntity;
import com.example.library_api.entity.ProfileEntity;
import com.example.library_api.repository.BookRepository;
import com.example.library_api.repository.FavoriteRepository;
import com.example.library_api.repository.ProfileRepository;
import com.example.library_api.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@Slf4j
@RequestMapping(path = "/api/favorite")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteRepository favoriteRepository;
    private final FavoriteService favoriteService;
    private final BookRepository bookRepository;
    private final ProfileRepository profileRepository;

    @PostMapping("addFavorite")
    public ResponseEntity<?> addFavorite(@RequestBody FavoriteEntity favorite) {
        ResponseDto responseDto = new ResponseDto();
        System.out.println("favorite : "+ favorite.getProfileCode() +favorite.getBookCode() );

        try {
            boolean exists = favoriteService.isFavoriteExists(favorite.getProfileCode(), favorite.getBookCode());
            if(exists){
                responseDto.setStatus(400);
                responseDto.setDescription("รายการนี้มีอยู่แล้ว");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseDto);
            }
            favoriteService.addFavoriteBook(favorite);
            responseDto.setStatus(200);
            responseDto.setDescription("เพิ่มรายการโปรดเรียบร้อย");
            return ResponseEntity.status(HttpStatus.OK).body(responseDto);
        } catch (Exception e) {
            e.printStackTrace();
            responseDto.setStatus(500);
            responseDto.setDescription("เพิ่มรายการโปรด ไม่สำเร็จ");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
        }
    }

//    @GetMapping("getFavorite/{profileCode}")
//    public ResponseEntity<List<FavoriteEntity>> getFavorite1(@PathVariable String profileCode) {
//        return ResponseEntity.status(HttpStatus.OK).body(favoriteRepository.findByProfileCodeAndFavoriteStatusAndIsDelete(profileCode , 1 ,0));
//    }

    @GetMapping("/checkListFavorite/{profileCode}")
    public List<FavoriteEntity> checkListFavorite(@PathVariable String profileCode) {
        return favoriteService.findFavoriteByProfileCodeAndFavoriteStatusAndIsDelete(profileCode, 1, 0);
    }

    @GetMapping("getFavoriteProfile/{profileCode}")
    public ResponseEntity<Page<BookDto>> getFavorite(
            @PathVariable String profileCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {

        Page<BookDto> bookEntityPage = favoriteService.getFavoritedData(profileCode, page - 1, size);

        if (bookEntityPage.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(bookEntityPage);
    }

    @DeleteMapping("delete/{bookCode}/{profileCode}")
    public ResponseEntity<?> removeFavorite(@PathVariable String bookCode ,@PathVariable String profileCode) {
        Optional<FavoriteEntity> favoriteOptional = favoriteRepository.findByBookCodeAndProfileCodeAndFavoriteStatusAndIsDelete(bookCode,profileCode,1,0);

        ResponseDto responseDto = new ResponseDto();
        if (favoriteOptional.isPresent()) {
            FavoriteEntity favorite = favoriteOptional.get();
            favorite.setIsDelete(1);
            favoriteRepository.save(favorite);
            responseDto.setStatus(200);
            responseDto.setDescription("ลบรายการโปรดสำเร็จ");
            return ResponseEntity.ok().body(responseDto);
        } else {
            responseDto.setStatus(404);
            responseDto.setDescription("ลบรายการโปรด ไม่สำเร็จ");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Favorite not found.");
        }
    }

    @PostMapping("/search")
    @ResponseStatus(HttpStatus.OK)
    public Page<FavoriteDTO> searchCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam String profileCode,
            @RequestBody SearchRequestDTO SearchRequestDTO ) {


        Pageable pageable = PageRequest.of(page,size);


        // Debug log หลังการกำหนด pageable
//        System.out.println("Keyword: " + SearchRequestDTO.getKeyword());
//        System.out.println("Category: " + SearchRequestDTO.getCategory());
//        System.out.println("ProfileCode: " + profileCode);

        System.out.println("Page: " + pageable.getPageNumber() + ", Size: " + pageable.getPageSize());

        Page<FavoriteDTO> result = favoriteRepository.getByFavoriteKey(
                SearchRequestDTO.getKeyword(),
                profileCode,
                SearchRequestDTO.getCategory(),
                pageable
        );
        return result;

    }





//    @GetMapping("getFavoriteProfile/{profileCode}")
//    public  ResponseEntity<Page<FavoriteDTO>> getFavoriteProfile(@PathVariable String profileCode ,
//                                                                @RequestParam(defaultValue = "0") int page,
//                                                                @RequestParam(defaultValue = "10") int size) {
//        Pageable pageable = PageRequest.of(page,size);
//        Page<FavoriteDTO> favoriteDTOs = favoriteService.findByFavoriteList(profileCode, pageable);
//        return  ResponseEntity.ok().body(favoriteDTOs);
//    }


    @GetMapping("/getLikedCategories")
    public ResponseEntity<Map<String , Object>> getLikedCategories(@RequestParam String profileCode){
        List<FavoriteDTO> favoriteCategories = favoriteRepository.getFavoriteCategoriesByProfile(profileCode);
        long favoriteCount = favoriteRepository.countByProfileCodeAndFavoriteStatusAndIsDelete(profileCode,1,0);

        Map<String, Object> response = new HashMap<>();
        response.put("favoriteCategories", favoriteCategories);
        response.put("favoriteCount", favoriteCount);
        return ResponseEntity.ok(response);
    }


}
