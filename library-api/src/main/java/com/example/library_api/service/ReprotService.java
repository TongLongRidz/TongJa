package com.example.library_api.service;


import com.example.library_api.dto.BookDto;
import com.example.library_api.dto.BorrowingBookDTO;
import com.example.library_api.dto.CategoryDto;
import com.example.library_api.entity.BookEntity;
import com.example.library_api.entity.BorrowingEntity;
import com.example.library_api.entity.CategoryEntity;
import com.example.library_api.entity.ProfileEntity;
import com.example.library_api.repository.BookRepository;
import com.example.library_api.repository.BorrowingRepository;
import com.example.library_api.repository.CategoryRepository;
import com.example.library_api.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class ReprotService {

    private final BorrowingRepository borrowingRepository;
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final ProfileRepository profileRepository;



    public List<CategoryDto> getCategoryStatic(LocalDate startDate, LocalDate endDate) {
        List<BookEntity> bookEntities = bookRepository.findAllByIsDeleteFalse();
        List<CategoryEntity> categoryEntities = categoryRepository.findAllByIsDeleteFalse();
        Map<String, Integer> totalBorrowCountMap = new HashMap<>();

        for (BookEntity bookItem : bookEntities) {
            int borrowCount;
            if (startDate == null || endDate == null) {
                borrowCount = borrowingRepository.findTotalBook(bookItem.getBookCode());
            } else {
                borrowCount = borrowingRepository.findTotalBookBetweenDates(bookItem.getBookCode(), startDate, endDate);
            }
            totalBorrowCountMap.merge(bookItem.getCategoryCode(), borrowCount, Integer::sum);
        }

        List<CategoryDto> categoryDtoList = categoryEntities.stream()
                .map(categoryItem -> {
                    CategoryDto categoryDto = new CategoryDto();
                    categoryDto.setId(categoryItem.getId());
                    categoryDto.setCategoryName(categoryItem.getCategoryName());
                    categoryDto.setTotalBorrow(totalBorrowCountMap.getOrDefault(categoryItem.getCategoryCode(), 0));
                    return categoryDto;
                })
                .collect(Collectors.toList());

        categoryDtoList.sort((c1, c2) -> Integer.compare(c2.getTotalBorrow(), c1.getTotalBorrow()));
        return categoryDtoList;
    }


    public Page<BorrowingBookDTO> getBorrowingData(Pageable pageable, LocalDate startDate, LocalDate endDate) {
        List<BorrowingEntity> borrowingEntities = new ArrayList<>();
        if( startDate == null || endDate == null ) {
            borrowingEntities = borrowingRepository.findAllByIsDeleteFalse();
        } else {
            borrowingEntities = borrowingRepository.findAllByIsDeleteFalseAndBorrowStartBetween(startDate, endDate);
        }

        List<BorrowingBookDTO> borrowingBookDTOs = borrowingEntities.stream()
                .collect(Collectors.groupingBy(BorrowingEntity::getBookCode, Collectors.counting()))
                .entrySet()
                .stream()
                .map(entry -> {
                    BookEntity bookEntity = bookRepository.findByBookCode(entry.getKey());
                    if (bookEntity == null) {
                        throw new RuntimeException("Book not found for code: " + entry.getKey());
                    }
                    return new BorrowingBookDTO(
                            entry.getKey(),                          // Book code
                            bookEntity.getBookNameTh(),              // Book name in Thai
                            bookEntity.getBookNameEn(),              // Book name in English
                            entry.getValue().intValue()              // Borrow count
                    );
                })
                .sorted(Comparator.comparingInt(BorrowingBookDTO::getBorrowCount).reversed())
                .collect(Collectors.toList());
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), borrowingBookDTOs.size());
        return new PageImpl<>(borrowingBookDTOs.subList(start, end), pageable, borrowingBookDTOs.size());
    }




    public ResponseEntity<Page<BorrowingBookDTO>> getMostFrequentBorrower1(String period , Pageable pageable) {
        final LocalDate startDate = LocalDate.now();
        LocalDate adjustedStartDate;
        LocalDate adjustedEndDate;

        if ("week".equalsIgnoreCase(period)) {
            DayOfWeek currentDayOfWeek = startDate.getDayOfWeek();
            adjustedStartDate = startDate.minusDays(currentDayOfWeek.getValue() % 7);
            adjustedEndDate = adjustedStartDate.plusDays(6);
        } else if ("month".equalsIgnoreCase(period)) {
            adjustedStartDate = startDate.withDayOfMonth(1);
            adjustedEndDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        } else if ("year".equalsIgnoreCase(period)) {
            adjustedStartDate = startDate.withDayOfYear(1);
            adjustedEndDate = startDate.withDayOfYear(startDate.lengthOfYear());
        } else {
            return ResponseEntity.ok(Page.empty(pageable));
        }

        List<BorrowingEntity> borrowingEntities = borrowingRepository.findAllByIsDeleteFalse();
        Map<String, List<BorrowingEntity>> groupedBorrowings = borrowingEntities.stream()
                .filter(borrowingEntity ->
                        borrowingEntity.getBorrowStart() != null &&
                                !borrowingEntity.getBorrowStart().isBefore(adjustedStartDate) &&
                                !borrowingEntity.getBorrowStart().isAfter(adjustedEndDate))
                .collect(Collectors.groupingBy(BorrowingEntity::getProfileCode));

        List<BorrowingBookDTO> bookDTOS = groupedBorrowings.entrySet().stream()
                .map(entry -> {
                    ProfileEntity profileEntity = profileRepository.findProfileByProfileCode(entry.getKey().trim());
                    if (profileEntity == null) {
                        throw new RuntimeException("Profile not found for code: " + entry.getKey());
                    }

                    List<BorrowingBookDTO> borrowList = entry.getValue().stream()
                            .map(borrowingEntity -> {
                                BookEntity bookEntity = bookRepository.findByBookCode(borrowingEntity.getBookCode());
                                String bookNameTh = bookEntity != null ? bookEntity.getBookNameTh() : null;
                                String bookNameEn = bookEntity != null ? bookEntity.getBookNameEn() : null;

                                return new BorrowingBookDTO(
                                        borrowingEntity.getBookCode(),
                                        borrowingEntity.getProfileCode(),
                                        bookNameTh,
                                        bookNameEn,
                                        borrowingEntity.getBorrowStart(),
                                        borrowingEntity.getBorrowEnd(),
                                        borrowingEntity.getBorrowStatus()
                                );
                            })
                            .collect(Collectors.toList());

                    return new BorrowingBookDTO(
                            entry.getKey(),
                            profileEntity.getImage(),
                            profileEntity.getFirstName(),
                            profileEntity.getLastName(),
                            entry.getValue().size(),
                            borrowList
                    );
                })
                .sorted(Comparator.comparingInt(BorrowingBookDTO::getBorrowCount).reversed())
                .collect(Collectors.toList());

        if (bookDTOS.isEmpty()) {
            return ResponseEntity.ok(Page.empty(pageable));
        }

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), bookDTOS.size());

        if (start >= bookDTOS.size()) {
            return ResponseEntity.ok(Page.empty(pageable));
        }

        Page<BorrowingBookDTO> pageResult = new PageImpl<>(bookDTOS.subList(start, end), pageable, bookDTOS.size());
        return ResponseEntity.ok(pageResult);
    }

    public List<Map<String, Object>> getReportBorrowMonth(String year, String categoryCode) {
        int reportYear = Integer.parseInt(year);
        List<BorrowingEntity> borrowings = borrowingRepository.findBorrowingsByYearAndCategory(reportYear, categoryCode);
        Map<Integer, Long> monthlyBorrowCount = borrowings.stream()
                .collect(Collectors.groupingBy(
                        b -> b.getBorrowStart().getMonthValue(),
                        Collectors.counting()
                ));
        return YearMonth.of(reportYear, 1).atDay(1)
                .datesUntil(YearMonth.of(reportYear, 12).atEndOfMonth().plusDays(1))
                .filter(date -> date.getDayOfMonth() == 1) 
                .map(date -> Map.of(
                        "month", (Object) date.getMonthValue(),
                        "borrowCount", (Object) monthlyBorrowCount.getOrDefault(date.getMonthValue(), 0L) // Default count to 0 if no data
                ))
                .collect(Collectors.toList());
    }



    public List<BorrowingBookDTO> getBorrowingData(String date) {


        if (date == null || "null".equalsIgnoreCase(date)) {
            List<BorrowingEntity> borrowingEntities = borrowingRepository.findAllByIsDeleteFalse();

            return borrowingEntities.stream()
                    .collect(Collectors.groupingBy(BorrowingEntity::getBookCode, Collectors.counting()))
                    .entrySet()
                    .stream()
                    .map(entry -> {
                        BookEntity bookEntity = bookRepository.findByBookCode(entry.getKey());
                        if (bookEntity == null) {
                            throw new RuntimeException("Book not found for code: " + entry.getKey());
                        }
                        return new BorrowingBookDTO(
                                entry.getKey(),                          // รหัสหนังสือ (bookCode)
                                bookEntity.getBookNameTh(),              // ชื่อหนังสือ (ภาษาไทย)
                                bookEntity.getBookNameEn(),              // ชื่อหนังสือ (ภาษาอังกฤษ)
                                entry.getValue().intValue()              // จำนวนครั้งที่ยืม
                        );
                    })
                    .sorted(Comparator.comparingInt(BorrowingBookDTO::getBorrowCount).reversed())
                    .collect(Collectors.toList());
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/yyyy");
        LocalDate parsedDate = LocalDate.parse("01/" + date, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        LocalDate startDate = parsedDate.withDayOfMonth(1); // วันที่ 1 ของเดือน
        LocalDate endDate = parsedDate.withDayOfMonth(parsedDate.lengthOfMonth()); // วันที่สุดท้ายของเดือน

        List<BorrowingEntity> borrowingEntities = borrowingRepository.findAllByIsDeleteFalseAndBorrowStartBetween(startDate, endDate);

        return borrowingEntities.stream()
                .collect(Collectors.groupingBy(BorrowingEntity::getBookCode, Collectors.counting()))
                .entrySet()
                .stream()
                .map(entry -> {
                    BookEntity bookEntity = bookRepository.findByBookCode(entry.getKey());
                    if (bookEntity == null) {
                        throw new RuntimeException("Book not found for code: " + entry.getKey());
                    }
                    return new BorrowingBookDTO(
                            entry.getKey(),                          // รหัสหนังสือ (bookCode)
                            bookEntity.getBookNameTh(),              // ชื่อหนังสือ (ภาษาไทย)
                            bookEntity.getBookNameEn(),              // ชื่อหนังสือ (ภาษาอังกฤษ)
                            entry.getValue().intValue()              // จำนวนครั้งที่ยืม
                    );
                })
                .sorted(Comparator.comparingInt(BorrowingBookDTO::getBorrowCount).reversed())
                .collect(Collectors.toList());
    }


    public List<BorrowingBookDTO> getBorrowingDatas(String date) {
        if (date == null || "null".equalsIgnoreCase(date)) {
            List<BorrowingEntity> borrowingEntities = borrowingRepository.findAllByIsDeleteFalse();

            List<String> bookCodes = borrowingEntities.stream()
                    .map(BorrowingEntity::getBookCode)
                    .distinct()
                    .collect(Collectors.toList());

            Map<String, BookEntity> booksMap = bookRepository.findAllByBookCodeIn(bookCodes).stream()
                    .collect(Collectors.toMap(BookEntity::getBookCode, Function.identity()));

            return borrowingEntities.stream()
                    .collect(Collectors.groupingBy(BorrowingEntity::getBookCode, Collectors.counting()))
                    .entrySet()
                    .stream()
                    .map(entry -> {
                        BookEntity bookEntity = booksMap.get(entry.getKey());
                        if (bookEntity == null) {
                            throw new RuntimeException("Book not found for code: " + entry.getKey());
                        }
                        return new BorrowingBookDTO(
                                entry.getKey(),                          // รหัสหนังสือ (bookCode)
                                bookEntity.getBookNameTh(),              // ชื่อหนังสือ (ภาษาไทย)
                                bookEntity.getBookNameEn(),              // ชื่อหนังสือ (ภาษาอังกฤษ)
                                entry.getValue().intValue()              // จำนวนครั้งที่ยืม
                        );
                    })
                    .sorted(Comparator.comparingInt(BorrowingBookDTO::getBorrowCount).reversed())
                    .collect(Collectors.toList());
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/yyyy");
        LocalDate parsedDate = LocalDate.parse("01/" + date, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        LocalDate startDate = parsedDate.withDayOfMonth(1); // วันที่ 1 ของเดือน
        LocalDate endDate = parsedDate.withDayOfMonth(parsedDate.lengthOfMonth()); // วันที่สุดท้ายของเดือน

        List<BorrowingEntity> borrowingEntities = borrowingRepository.findAllByIsDeleteFalseAndBorrowStartBetween(startDate, endDate);

        List<String> bookCodes = borrowingEntities.stream()
                .map(BorrowingEntity::getBookCode)
                .distinct()
                .collect(Collectors.toList());

        Map<String, BookEntity> booksMap = bookRepository.findAllByBookCodeIn(bookCodes).stream()
                .collect(Collectors.toMap(BookEntity::getBookCode, Function.identity()));

        return borrowingEntities.stream()
                .collect(Collectors.groupingBy(BorrowingEntity::getBookCode, Collectors.counting()))
                .entrySet()
                .stream()
                .map(entry -> {
                    BookEntity bookEntity = booksMap.get(entry.getKey());
                    if (bookEntity == null) {
                        throw new RuntimeException("Book not found for code: " + entry.getKey());
                    }
                    return new BorrowingBookDTO(
                            entry.getKey(),                          // รหัสหนังสือ (bookCode)
                            bookEntity.getBookNameTh(),              // ชื่อหนังสือ (ภาษาไทย)
                            bookEntity.getBookNameEn(),              // ชื่อหนังสือ (ภาษาอังกฤษ)
                            entry.getValue().intValue()              // จำนวนครั้งที่ยืม
                    );
                })
                .sorted(Comparator.comparingInt(BorrowingBookDTO::getBorrowCount).reversed())
                .collect(Collectors.toList());
    }






} // end