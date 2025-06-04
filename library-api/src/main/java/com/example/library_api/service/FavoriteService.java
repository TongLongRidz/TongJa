package com.example.library_api.service;


import com.example.library_api.dto.BookDto;
import com.example.library_api.dto.FavoriteDTO;
import com.example.library_api.entity.BookEntity;
import com.example.library_api.entity.CategoryEntity;
import com.example.library_api.entity.FavoriteEntity;
import com.example.library_api.entity.ProfileEntity;
import com.example.library_api.repository.BookRepository;
import com.example.library_api.repository.CategoryRepository;
import com.example.library_api.repository.FavoriteRepository;
import com.example.library_api.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final BookRepository bookRepository;
    private final ProfileRepository profileRepository;
    private final CategoryRepository categoryRepository;

    public  FavoriteEntity addFavoriteBook(FavoriteEntity favorite){

        Integer maxFavoriteID = favoriteRepository.findMaxFavorite();
        if (maxFavoriteID == null) {
            maxFavoriteID = 0;
        }

        String genFavoriteCode = "FV" + String.format("%03d", maxFavoriteID + 1);

        FavoriteEntity favorites = new FavoriteEntity();
        log.info(favorite.getBookCode());
        log.info(favorite.getProfileCode());
        favorites.setFavoriteCode(genFavoriteCode);
        favorites.setBookCode(favorite.getBookCode());
        favorites.setProfileCode(favorite.getProfileCode());
        favorites.setIsDelete(0);
        favorites.setFavoriteStatus(1);
       return favoriteRepository.save(favorites);
    }

//    public List<FavoriteEntity> getFavoriteBooks(String profileCode ){
//        return favoriteRepository.findByProfileCodeAndFavoriteStatusAndIsDelete(profileCode , 0, 1 );
//    }


    public Page<BookDto> getFavoritedData (String profileCode , int page , int size){
        Pageable pageable = PageRequest.of(page,size);

        Page<FavoriteEntity> favoriteBooks = favoriteRepository.findByProfileCodeAndFavoriteStatusAndIsDelete(profileCode, 1, 0, pageable);

        Optional<ProfileEntity> profile = profileRepository.findByProfileCode(profileCode);
        if (!profile.isPresent()) {
            return Page.empty();
        }
        List<BookDto> books = new ArrayList<>();
        for (FavoriteEntity favorite : favoriteBooks) {
            Optional<BookEntity> bookOpt = bookRepository.findByBookCodeAndIsDelete(favorite.getBookCode(), 0);
            bookOpt.ifPresent(book -> {
                Optional<CategoryEntity> categoryOpt = categoryRepository.findByCategoryCodeAndIsDelete(book.getCategoryCode(), 0);
                String categoryName = categoryOpt.map(CategoryEntity::getCategoryName).orElse("ไม่ระบุ"); // ใช้ map กับ Optional

                books.add(new BookDto(
                        book.getId(),
                        book.getBookCode(),
                        book.getBookBarCode(),
                        book.getBookNameTh(),
                        book.getBookNameEn(),
                        book.getBookImage(),
                        categoryName,
                        book.getBookStatus(),
                        book.getIsDelete()
                ));
            });
        }
        return new PageImpl<>(books, pageable, favoriteBooks.getTotalElements());

    }


    public Page<FavoriteDTO> getKeyword(String keyword,String profileCode, String category,  Pageable pageable) {
        return favoriteRepository.getByFavoriteKey(keyword,profileCode,category, pageable);
    }


    public  boolean isFavoriteExists(String profileCode , String bookCode){
        return favoriteRepository.existsByProfileCodeAndBookCodeAndFavoriteStatusAndIsDelete(profileCode, bookCode,1,0);
    }


public List<FavoriteEntity> findFavoriteByProfileCodeAndFavoriteStatusAndIsDelete(String profileCode , int favoriteStatus, int isDelete){
        return  favoriteRepository.findFavoriteByProfileCodeAndFavoriteStatusAndIsDelete(profileCode,favoriteStatus,isDelete);
}





}