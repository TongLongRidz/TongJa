package com.example.library_api.service;

import com.example.library_api.dto.*;
import com.example.library_api.entity.BookEntity;
import com.example.library_api.entity.BorrowingEntity;
import com.example.library_api.entity.CategoryEntity;
import com.example.library_api.repository.BookRepository;
import com.example.library_api.repository.BorrowingRepository;
import com.example.library_api.repository.CategoryRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BorrowingRepository borrowingRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Value("${book.image.path}")
    private String bookImagePath;

    @Autowired
    private HttpServletRequest requestLocalApi;

    private Comparator<BookTableDTO> getCustomComparator(String lang) {
        return (b1, b2) -> {
            String name1;
            String name2;
            if ("th".equalsIgnoreCase(lang)) {
                name1 = b1.getBookNameTh();
                name2 = b2.getBookNameTh();
            } else {
                name1 = b1.getBookNameEn();
                name2 = b2.getBookNameEn();
            }

            String normalizedName1 = name1.toUpperCase() + name1.toLowerCase();
            String normalizedName2 = name2.toUpperCase() + name2.toLowerCase();

            return normalizedName1.compareTo(normalizedName2);
        };
    }


    public Page<BookTableDTO> getAllBook(Pageable pageable, Boolean his, String name_sort, String lang) {
        int isDeleteValue = his ? 1 : 0;
        if(!Objects.equals(name_sort, "dis") && Objects.equals(name_sort, "min") || Objects.equals(name_sort, "max")){
            List<BookTableDTO> allBooks = bookRepository.findAllByIsDelete(isDeleteValue);
            Comparator<BookTableDTO> customComparator = getCustomComparator(lang);
            if (Objects.equals(name_sort, "min")) {
                allBooks = allBooks.stream().sorted(customComparator).collect(Collectors.toList());
            } else if (Objects.equals(name_sort, "max")) {
                allBooks = allBooks.stream().sorted(customComparator.reversed()).collect(Collectors.toList());
            }
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), allBooks.size());
            List<BookTableDTO> paginatedBooks = allBooks.subList(start, end);
            return new PageImpl<>(paginatedBooks, pageable, allBooks.size());
        }
        return bookRepository.findAllByIsDeletePage(isDeleteValue, pageable);
    }

    public Optional<BookEntity> getBookByID(Long bookID) {
        return bookRepository.findById(bookID);
    }

    public String newBook(BookDto bookDto) {
        if (bookRepository.existsByBookBarCode(bookDto.getBookBarCode())) { return "already"; }
        Integer maxBookID = bookRepository.findMaxBookCode();
        if (maxBookID == null) {
            maxBookID = 0;
        }
        String genBookCode = "B" + String.format("%03d", maxBookID + 1);
        BookEntity setBook = new BookEntity();
        setBook.setBookCode(genBookCode);
        setBook.setBookBarCode(bookDto.getBookBarCode());
        setBook.setBookNameTh(bookDto.getBookNameTh());
        setBook.setBookNameEn(bookDto.getBookNameEn());
        setBook.setBookImage(bookDto.getBookImage());

        try {
            String bookImage = bookDto.getBookImage();
            if (bookImage != null && !bookImage.isEmpty()) {
                String imageDir = System.getProperty("user.home") + "/";
                File dir = new File(imageDir + bookImagePath);
                if (!dir.exists()) { dir.mkdirs(); }

                String imagePath = bookImagePath + "/" + genBookCode + "-" + bookDto.getBookBarCode() + ".png";
                if (bookImage.startsWith("data:image")) {
                    bookImage = bookImage.split(",")[1];
                }

                String base64Regex = "^[A-Za-z0-9+/]*={0,2}$";
                if (!Pattern.matches(base64Regex, bookImage)) {
                    System.err.println("Invalid Base64 input");
                    return "error";
                }

                byte[] imageBytes = Base64.getDecoder().decode(bookImage);
                try (FileOutputStream fos = new FileOutputStream(imageDir + imagePath)) {
                    fos.write(imageBytes);
                }
                setBook.setBookImageDir(imagePath);
            } else {
                System.err.println("No image data provided");
                return "error";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }

        setBook.setCategoryCode(bookDto.getCategoryCode());
        setBook.setBookStatus(0);
        setBook.setIsDelete(0);
        setBook.setTotalView(0);
        try {
            bookRepository.save(setBook);
            return "ok";
        } catch (Exception e) {
            // e.printStackTrace();
            return "error";
        }
    }


    public String updateBook(BookDto bookDto, String active ) {
        Optional<BookEntity> optionalBook = bookRepository.findById(bookDto.getId());
        if (optionalBook.isPresent()) {
            BookEntity setBook = optionalBook.get();
            setBook.setBookCode(bookDto.getBookCode());
            setBook.setBookBarCode(bookDto.getBookBarCode());
            setBook.setBookNameTh(bookDto.getBookNameTh());
            setBook.setBookNameEn(bookDto.getBookNameEn());
            setBook.setBookImage(bookDto.getBookImage());
            setBook.setCategoryCode(bookDto.getCategoryCode());
            setBook.setBookStatus(bookDto.getBookStatus());

            try {
                String bookImage = bookDto.getBookImage();
                if (bookImage != null && !bookImage.isEmpty()) {
                    String imageDir = System.getProperty("user.home") + "/";
                    File dir = new File(imageDir + bookImagePath);
                    if (!dir.exists()) { dir.mkdirs(); }

                    String imagePath = bookImagePath + "/" + bookDto.getBookCode() + "-" + bookDto.getBookBarCode() + ".png";
                    if (bookImage.startsWith("data:image")) {
                        bookImage = bookImage.split(",")[1];
                    }

                    String base64Regex = "^[A-Za-z0-9+/]*={0,2}$";
                    if (!Pattern.matches(base64Regex, bookImage)) {
                        System.err.println("Invalid Base64 input");
                        return "error";
                    }

                    byte[] imageBytes = Base64.getDecoder().decode(bookImage);
                    try (FileOutputStream fos = new FileOutputStream(imageDir + imagePath)) {
                        fos.write(imageBytes);
                    }
                    setBook.setBookImageDir(imagePath);
                } else {
                    System.err.println("No image data provided");
                    return "error";
                }
            } catch (Exception e) {
//                e.printStackTrace();
                System.err.println("Error Save png");
                return "error";
            }
            List<BorrowingEntity> OPT_Borrow = borrowingRepository.findBorrowingsByBookCodeAll(bookDto.getBookCode());
            for (BorrowingEntity borrow : OPT_Borrow) {
                borrow.setBorrowStatus(bookDto.getBookStatus());
                if (bookDto.getBookStatus() == 0 && borrow.getBorrowStatus() != 0){
                    LocalDateTime today = LocalDateTime.now();
                    borrow.setReturnDate(today);
                }
                borrowingRepository.save(borrow);
            }
            try {
                bookRepository.save(setBook);
                return "ok";
            } catch (Exception e) {
                // e.printStackTrace();
                return "error";
            }
        } else {
            return "error";
        }
    }

    public String deleteKillBookID(Long bookID) {
        try {
            if (bookRepository.existsById(bookID)) {
                bookRepository.deleteById(bookID); return "ok";
            } else { return "not_found"; }
        } catch (Exception e) {
            return "error";
        }
    }

    public String deleteStatusBookID(Long bookID) {
        Optional<BookEntity> optionalBook = bookRepository.findById(bookID);
        if (optionalBook.isPresent()) {
            BookEntity setBook = optionalBook.get();
            setBook.setIsDelete(1);
            try {
                bookRepository.save(setBook);
                return "ok";
            } catch (Exception e) {
                return "error";
            }
        } else {
            return "not_found";
        }
    }

    public String reDeleteStatusBookID(Long bookID) {
        Optional<BookEntity> optionalBook = bookRepository.findById(bookID);
        if (optionalBook.isPresent()) {
            BookEntity setBook = optionalBook.get();
            setBook.setIsDelete(0);
            try {
                bookRepository.save(setBook);
                return "ok";
            } catch (Exception e) {
                return "error";
            }
        } else {
            return "not_found";
        }
    }

    public Page<BookTableDTO> getSearchBook(String searchKey, Pageable pageable, Boolean his, String name_sort, String lang) {
        int isDeleteValue = his ? 1 : 0;

        String lowerSearchKey = "%" + searchKey.toLowerCase() + "%";
        List<BookTableDTO> allBooks = bookRepository.searchBooksByLanguage(lowerSearchKey, isDeleteValue, lang, pageable.getSort());


        if(!Objects.equals(name_sort, "dis") && Objects.equals(name_sort, "min") || Objects.equals(name_sort, "max")){
            Comparator<BookTableDTO> customComparator = getCustomComparator(lang);
            if (Objects.equals(name_sort, "min")) {
                allBooks = allBooks.stream().sorted(customComparator).collect(Collectors.toList());
            } else if (Objects.equals(name_sort, "max")) {
                allBooks = allBooks.stream().sorted(customComparator.reversed()).collect(Collectors.toList());
            }
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), allBooks.size());
            List<BookTableDTO> paginatedBooks = allBooks.subList(start, end);
            return new PageImpl<>(paginatedBooks, pageable, allBooks.size());
        }
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), allBooks.size());
        List<BookTableDTO> pagedBooks = allBooks.subList(start, end);
        return new PageImpl<>(pagedBooks, pageable, allBooks.size());
    }

    public Page<BookDto> searchBooks(int page, int size, String categoryCode, String status) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<BookDto> bookDtoPage = bookRepository.findBooks(categoryCode, status, pageable);
        for (BookDto bookDto : bookDtoPage.getContent()) {
            bookDto.setBookImage(getPathBookImage(bookDto.getBookCode(), bookDto.getBookBarCode()));
        }
        return bookDtoPage;
    }


    public BookDetailDTO getBookDetailsByID(Long bookId) {
        Optional<BookEntity> bookOpt = bookRepository.findById(bookId);
        if (bookOpt.isPresent()) {
            BookEntity book = bookOpt.get();
            book.setBookImage(getPathBookImage(book.getBookCode(), book.getBookBarCode()));
            Optional<CategoryEntity> categoryOpt = categoryRepository.findNameCategoryByCode(book.getCategoryCode());

            LocalDate today = LocalDate.now().plusMonths(1);
            LocalDate sevenDaysAgo = LocalDate.now().minusDays(6);
            List<BorrowingBookDTO> borrowings = borrowingRepository.findBorrowingsByBookCodeWeek(book.getBookCode(), sevenDaysAgo, today);

            BookDetailDTO bookDetail = new BookDetailDTO();
            categoryOpt.ifPresent(category -> bookDetail.setAll(book, category, borrowings));
            bookDetail.setTotalBorrow(borrowingRepository.findBorrowCountByBookCode(bookDetail.getBookCode()));

            return bookDetail;
        }
        return null;
    }

    public List<BookEntity> getBookRecommend(BookEntity bookByID, Pageable pageable) {
        Page<BookEntity> bookEntityPage = bookRepository.findRecommendByCategory(bookByID.getCategoryCode(), bookByID.getBookCode(), pageable);
        List<BookEntity> recommendedBooks = bookEntityPage.getContent();
        for (BookEntity book : recommendedBooks) {
            book.setBookImage(getPathBookImage(book.getBookCode(), book.getBookBarCode()));
        }
        return recommendedBooks;
    }



    public String checkBookDetailsByID(Long bookId) {
        Optional<BookEntity> bookOpt = bookRepository.findById(bookId);
        if (bookOpt.isPresent()) {
            return "ok";
        }
        return null;
    }

    public List<Object[]> getBookBorrowCounts() {
        return bookRepository.findBookBorrowCounts();
    }

    @Transactional
    public boolean incrementTotalView(Long id) {
        try {
            bookRepository.incrementTotalViewById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public List<ReportTopBookDto> getTopViewedBooks(int topLimit, String categoryCode) {
        Pageable pageable = PageRequest.of(0, topLimit);
        if (categoryCode != null && !categoryCode.isEmpty()) {
            return bookRepository.findTopViewedBooksByCategory(categoryCode, pageable);
        } else {
            return bookRepository.findTopViewedBooks(pageable);
        }
    }

    private String getPathBookImage(String bookCode, String barCode) {
        String scheme = requestLocalApi.getScheme();
        String serverName = requestLocalApi.getServerName();
        int port = requestLocalApi.getServerPort();

        String baseUrl = scheme + "://" + serverName + ":" + port;
        String imageUrl = baseUrl + "/api/book/images/" + bookCode + "-" + barCode + ".png";
        return imageUrl;
    }


}
