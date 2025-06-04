package com.example.library_api.service;

import com.example.library_api.dto.BookTableDTO;
import com.example.library_api.dto.BorrowingBookDTO;
import com.example.library_api.dto.BorrowBookHisDTO;
import com.example.library_api.dto.TopBooksResponseDTO;
import com.example.library_api.entity.*;
import com.example.library_api.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;



import java.sql.Timestamp;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class BorrowingService {

    private final BorrowingRepository borrowingRepository;

    private final NotificationRepository notificationRepository;

    private final BookRepository bookRepository;

    private final NotificationService notificationService;
    private  final RoleUserRepository roleUserRepository;
    private  final ProfileRepository profileRepository;

    private Comparator<BorrowingBookDTO> getCustomComparator(String lang) {
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


    public Page<BorrowingBookDTO> getAllBorrowBook(Pageable pageable, Boolean his, String name_sort, String lang) {
        int isDeleteValue = his ? 1 : 0;
        List<BorrowingBookDTO> allBorrow = borrowingRepository.findAllByIsDelete(isDeleteValue, pageable.getSort());
        if (!Objects.equals(name_sort, "dis")) {
            Comparator<BorrowingBookDTO> customComparator = getCustomComparator(lang);
            if (Objects.equals(name_sort, "min")) {
                allBorrow = allBorrow.stream().sorted(customComparator).collect(Collectors.toList());
            } else if (Objects.equals(name_sort, "max")) {
                allBorrow = allBorrow.stream().sorted(customComparator.reversed()).collect(Collectors.toList());
            }
        }
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), allBorrow.size());
        List<BorrowingBookDTO> paginatedBooks = allBorrow.subList(start, end);

        return new PageImpl<>(paginatedBooks, pageable, allBorrow.size());
    }


    public Optional<BorrowingBookDTO> getBorrowBookByID(Long BorrowID) {
        return borrowingRepository.findByIdBorrowingWithBook(BorrowID);
    }

    public String deleteStatusBorrowBookID(Long bookID) {
        Optional<BorrowingEntity> optionalBook = borrowingRepository.findById(bookID);
        if (optionalBook.isPresent()) {
            BorrowingEntity setBook = optionalBook.get();
            setBook.setIsDelete(1);
            try {
                borrowingRepository.save(setBook);
                return "ok";
            } catch (Exception e) {
                return "error";
            }
        } else {
            return "not_found";
        }
    }

    public Page<BorrowingBookDTO> getSearchBorrowBook(String searchKey, Pageable pageable, Boolean isDeleted, String lang) {
        int isDeleteValue = isDeleted ? 1 : 0;
        searchKey = searchKey.replaceAll("\\s+", " ").trim();
        return borrowingRepository.searchBorrowBook(searchKey, isDeleteValue, pageable, lang);
    }

    @Transactional
    public String updateBorrowBook(Long id, LocalDate borrowEnd, int borrowStatus,String borrowImage, String active) {
        Optional<BorrowingEntity> optionalBorrowBook = borrowingRepository.findById(id);

        if (optionalBorrowBook.isPresent()) {
            BorrowingEntity setBorrowBook = optionalBorrowBook.get();
            setBorrowBook.setBorrowEnd(borrowEnd);
            setBorrowBook.setBorrowStatus(borrowStatus);
            setBorrowBook.setBorrowImage(borrowImage);
            long borrowDays = ChronoUnit.DAYS.between(setBorrowBook.getBorrowStart(), borrowEnd);
            setBorrowBook.setBorrowDays((int)borrowDays+1);
            if (borrowStatus == 0){
                LocalDateTime today = LocalDateTime.now();
                setBorrowBook.setReturnDate(today);
            }

            Optional<BookEntity> OPT_Book = bookRepository.findBookByBookCode(setBorrowBook.getBookCode());
            if (OPT_Book.isPresent()) {
                BookEntity setBook = OPT_Book.get();
                setBook.setBookStatus(borrowStatus);
                bookRepository.save(setBook);
            }
            try {
                borrowingRepository.save(setBorrowBook);

//                Admin
                List<RoleUserEntity> roleUserEntities = roleUserRepository.findAllByProfileCode(setBorrowBook.getProfileCode());
                List<String> roleCodes = roleUserEntities.stream()
                        .map(RoleUserEntity::getRoleCode)
                        .collect(Collectors.toList());
                Integer maxNotiID = borrowingRepository.findMaxNotiCodes();
                if (maxNotiID == null) {
                    maxNotiID = 0;
                }
                String genNotiCode = "NT" + String.format("%06d", maxNotiID + 1);

                notificationService.SelectStatusSaves(setBorrowBook.getProfileCode(),active ,genNotiCode,setBorrowBook.getBookCode());
                return "ok";
            } catch (Exception e) {
                // e.printStackTrace();
                return "error";
            }
        } else {
            return "error";
        }
    }


    public static LocalDateTime convertToLocalDateTime(String dateTimeString) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
        return LocalDateTime.parse(dateTimeString, formatter);
    }

    public static LocalDate convertToLocalDate(String dateTimeString) {
        return convertToLocalDateTime(dateTimeString).toLocalDate();
    }

    @Transactional
    public void newSaveBorrowBook(BorrowBookHisDTO borrowBookHisDTO) {
        Integer maxBorrowID = borrowingRepository.findMaxBorrowingCodes();
        if (maxBorrowID == null) {
            maxBorrowID = 0;
        }
        String genBorrowCode = "BR" + String.format("%03d", maxBorrowID + 1);

        BorrowingEntity borrowingEntity = new BorrowingEntity();
        borrowingEntity.setBorrowCode(genBorrowCode);

        borrowingEntity.setBorrowStart(borrowBookHisDTO.getBorrowStart());
        borrowingEntity.setBorrowEnd(borrowBookHisDTO.getBorrowEnd());
//        borrowingEntity.setReturnDate(borrowingBookDTO.getReturnDate());
        LocalDate borrowStart = borrowBookHisDTO.getBorrowStart();
        LocalDate borrowEnd = borrowBookHisDTO.getBorrowEnd();

        LocalDate newEndDate = borrowEnd.plusDays(1);

        borrowBookHisDTO.setNewEndDate(newEndDate.toString());

        long borrowDays = ChronoUnit.DAYS.between(borrowStart, newEndDate);
        borrowingEntity.setBorrowDays((int) borrowDays);
        borrowingEntity.setBookCode(borrowBookHisDTO.getBookCode());
        borrowingEntity.setBorrowStatus(1);
        borrowingEntity.setIsDelete(0);
        borrowingEntity.setReturnDate(null);
        borrowingEntity.setProfileCode(borrowBookHisDTO.getProfileCode());

        borrowingRepository.save(borrowingEntity);

        BookEntity book = bookRepository.findByBookCode(borrowBookHisDTO.getBookCode());
        if (book != null) {
            book.setBookStatus(1);
            bookRepository.save(book);
        }
        Integer maxNotiID = borrowingRepository.findMaxNotiCodes();
        if (maxNotiID == null) {
            maxNotiID = 0;
        }
        String  active = "borrow";
        String genNotiCode = "NT" + String.format("%06d", maxNotiID + 1);
        notificationService.SelectStatusSaves(borrowingEntity.getProfileCode(),active,genNotiCode,borrowingEntity.getBookCode());
    }

    public Page<BorrowBookHisDTO> getKeyword(Pageable pageable, BorrowBookHisDTO borrowBookHisDTO) {
        String keyword = borrowBookHisDTO.getKeyword();
        boolean isDeleted = borrowBookHisDTO.getIsDelete() == 1;
        int isDelete = isDeleted ? 1 : 0;
        boolean containsAvailable = keyword.contains("ว่าง");
        boolean containsReturn = keyword.contains("ยืม");
        if (containsAvailable) {
            keyword = keyword.replace("ว่าง", "").trim();
        }
        if (containsReturn) {
            keyword = keyword.replace("ยืม", "").trim();
        }
        int status = containsAvailable ? 0 : (containsReturn ? 1 : -1);
        keyword = keyword.replaceAll("\\s+", " ").trim(); // Remove excessive spaces
        Page<BorrowBookHisDTO> pagee = borrowingRepository.getByBorrowKey(keyword, isDelete, status, pageable);
        return pagee;
    }



    public Page<BorrowBookHisDTO> getKeywordHistory(Pageable pageable, BorrowBookHisDTO borrowBookHisDTO) {
        String keyword = borrowBookHisDTO.getKeyword();
        String profileCode = borrowBookHisDTO.getProfileCode(); // Get profileCode from profileDTO

        if (profileCode == null || profileCode.isEmpty()) {
            throw new IllegalArgumentException("ProfileCode cannot be null or empty");
        }

        boolean isDeleted = borrowBookHisDTO.getIsDelete() == 1;
        int isDelete = isDeleted ? 1 : 0;

        boolean containsAvailable = keyword.contains("คืน");
        boolean containsReturn = keyword.contains("ยืม");

        if (containsAvailable) {
            keyword = keyword.replace("คืน", "").trim();
        }
        if (containsReturn) {
            keyword = keyword.replace("ยืม", "").trim();
        }

        int status = containsAvailable ? 0 : (containsReturn ? 1 : -1);

        keyword = keyword.replaceAll("\\s+", " ").trim(); // Remove excessive spaces

        Page<BorrowBookHisDTO> dataHis = borrowingRepository.getByMyHistory(keyword, isDelete, status, profileCode, pageable);
        return dataHis;
    }


    public Page<BorrowBookHisDTO> getKeywordMyListBorrow(Pageable pageable, BorrowBookHisDTO borrowBookHisDTO) {
        String keyword = borrowBookHisDTO.getKeyword();
        String profileCode = borrowBookHisDTO.getProfileCode();

        if (profileCode == null || profileCode.isEmpty()) {
            throw new IllegalArgumentException("ProfileCode cannot be null or empty");
        }

        boolean isDeleted = borrowBookHisDTO.getIsDelete() == 1;
        int isDelete = isDeleted ? 1 : 0;

        boolean containsAvailable = keyword.contains("คืน");
        boolean containsReturn = keyword.contains("ยืม");

        if (containsAvailable) {
            keyword = keyword.replace("คืน", "").trim();
        }
        if (containsReturn) {
            keyword = keyword.replace("ยืม", "").trim();
        }

        int status = borrowBookHisDTO.getBorrowStatus();
//        int status = containsAvailable ? 0 : (containsReturn ? 1 : -1);

        keyword = keyword.replaceAll("\\s+", " ").trim();

        Page<BorrowBookHisDTO> dataHis = borrowingRepository.getByMyListBorrow(keyword, isDelete, status, profileCode, pageable);
        return dataHis;
    }


    public ResponseEntity<?> getImageById(Long id) {
        Optional<BorrowingEntity> entityOptional = borrowingRepository.findBorrowImageById(id);
        if (entityOptional.isPresent()) {
            String imageUrl = entityOptional.get().getBorrowImage();
            return ResponseEntity.ok(Collections.singletonMap("image", imageUrl));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Image not found");
        }
    }


    public List<BorrowingEntity> getTopBookss(String date) {
        try {
            log.info("Original date input: {}", date);

            if (!date.matches("^(0[1-9]|1[0-2])/\\d{4}$")) {
                try {
                    log.info("Parsing date from format like: {}", date);
                    DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("EEE MMM dd yyyy HH:mm:ss 'GMT'Z (z)");
                    LocalDate parsedDate = LocalDate.parse(date, inputFormatter);
                    date = parsedDate.format(DateTimeFormatter.ofPattern("MM/yyyy"));
                    log.info("Formatted date to MM/YYYY: {}", date);
                } catch (DateTimeParseException e) {
                    log.warn("Failed to parse date: {}, using format 'EEE MMM dd yyyy HH:mm:ss 'GMT'Z (z)'", date, e);
                    return Collections.emptyList(); // Return empty list if date parsing fails
                }
            }

            if (!date.matches("^(0[1-9]|1[0-2])/\\d{4}$")) {
                log.warn("Invalid date format after parsing: {}", date);
                return Collections.emptyList();
            }

            String[] dateParts = date.split("/");
            int month = Integer.parseInt(dateParts[0]); // Get month from "MM/YYYY"
            int year = Integer.parseInt(dateParts[1]);  // Get year from "MM/YYYY"

            log.info("Searching borrowings for month: {} and year: {}", month, year);

            List<BorrowingEntity> topBooks = borrowingRepository.findByBorrowStartMonthAndYear(month, year);

            if (topBooks == null || topBooks.isEmpty()) {
                log.info("No borrowing data found for month/year: {}", date);
                return Collections.emptyList();
            }

            log.info("Found {} borrowings for month/year: {}", topBooks.size(), date);
            return topBooks;
        } catch (NumberFormatException e) {
            log.error("Error parsing month/year from date: {}", date, e);
            return Collections.emptyList();
        } catch (Exception e) {
            log.error("Unexpected error retrieving top books for date: {}", date, e);
            return Collections.emptyList();
        }
    }


    public TopBooksResponseDTO getTopBooks(String date) {
        try {
            String[] dateParts = date.split("/");
            int month = Integer.parseInt(dateParts[0]);
            int year = Integer.parseInt(dateParts[1]);

            List<Object[]> topBooks = borrowingRepository.findTopBooksByMonthAndYear(month, year);

            List<Integer> series = topBooks.stream().map(row -> ((Number) row[1]).intValue()).toList();
            List<String> labels = topBooks.stream().map(row -> (String) row[0]).toList();

            // ส่งข้อมูลกลับไปยัง Controller
            return new TopBooksResponseDTO(series, labels);
        } catch (Exception e) {
            throw new RuntimeException("เกิดข้อผิดพลาดขณะประมวลผลข้อมูลหนังสือยอดนิยม", e);
        }
    }

    public TopBooksResponseDTO getAllTopBooks() {
        try {
            List<Object[]> topBooks = borrowingRepository.findAllTopBooks();

            List<Integer> series = topBooks.stream().map(row -> ((Number) row[1]).intValue()).toList();
            List<String> labels = topBooks.stream().map(row -> (String) row[0]).toList();
            return new TopBooksResponseDTO(series, labels);
        } catch (Exception e) {
            throw new RuntimeException("เกิดข้อผิดพลาดขณะประมวลผลข้อมูลหนังสือยอดนิยม", e);
        }
    }

    public List<TopBooksResponseDTO> getBorrowingsByPeriod(String category, String period) {
        LocalDate startDate;
        LocalDate endDate = LocalDate.now();

        period = (period != null) ? period.toLowerCase() : "week";

        switch (period) {
            case "week":
                startDate = endDate.with(DayOfWeek.SUNDAY);
                endDate = startDate.plusDays(6);
                break;
            case "month":
                startDate = endDate.withDayOfMonth(1);
                endDate = endDate.withDayOfMonth(endDate.lengthOfMonth());
                break;
            case "year":
                startDate = endDate.withDayOfYear(1);
                endDate = endDate.withDayOfYear(endDate.lengthOfYear());
                break;

            default:
                return Collections.emptyList();
        }

        if (category == null || category.isEmpty()) {
            category = "%";
        }

        return borrowingRepository.getBorrowingSummaryByCategory(category, startDate, endDate);
    }


    public List<TopBooksResponseDTO> getBorrowingsByPeriod1(String category, LocalDate  startDate,LocalDate  endDate) {
        return borrowingRepository.getBorrowingSummaryByCategory1(category, startDate, endDate);
    }


}// end
