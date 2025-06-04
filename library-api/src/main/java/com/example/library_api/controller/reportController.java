package com.example.library_api.controller;


import com.example.library_api.dto.*;
import com.example.library_api.entity.BookEntity;
import com.example.library_api.entity.BorrowingEntity;
import com.example.library_api.repository.BookRepository;
import com.example.library_api.repository.BorrowingRepository;
import com.example.library_api.service.BookService;
import com.example.library_api.service.BorrowingService;
import com.example.library_api.service.ReprotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@Slf4j
@RequestMapping(path = "/api/report")
@RequiredArgsConstructor
public class reportController {
    private final ReprotService reprotService;
    private final BorrowingRepository borrowingRepository;
    private  final BorrowingService borrowingService;
    private final BookRepository bookRepository;
    private final BookService bookService;

    @GetMapping(path = "reportAll")
    public Map<String, Long> getReports() {
        long totalBorrowings = borrowingRepository.countTotalBorrowings(); // นับจำนวนการยืมทั้งหมดที่ไม่ถูกลบ
        long totalProfileBorrow = borrowingRepository.countDistinctBorrowers(); // นับจำนวนการยคนยืม

        long totalNoReturns = borrowingRepository.countActiveBorrowings(); // นับจำนวนการยืมที่ไม่ถูกลบ
        long totalReturns = borrowingRepository.countReturnedBooks(); // นับจำนวนการคืนที่ไม่ถูกลบ
        long countOverReturns = borrowingRepository.countOverdueReturns(); // นับรายการที่เกินกำหนด

        long totalBook = bookRepository.countToTalBooks();
        long countAvailableBooks = bookRepository.countAvailableBooks();
        long countBorrowedBooks = bookRepository.countBorrowedBooks();



        Map<String, Long> reportData = new HashMap<>();
        reportData.put("totalBorrowings", totalBorrowings);
        reportData.put("totalProfileBorrow", totalProfileBorrow);

        reportData.put("totalNoReturns", totalNoReturns);
        reportData.put("totalReturns", totalReturns);
        reportData.put("countOverReturns", countOverReturns);

        reportData.put("totalBook", totalBook);
        reportData.put("countAvailableBooks", countAvailableBooks);
        reportData.put("countBorrowedBooks", countBorrowedBooks);




//        reportData.put("totalBorrowers", totalBorrowers);

        return reportData;
    }


    @GetMapping(path = "/send-date")
    public ResponseEntity<DataStaticDTO> sendDate(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate ) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE MMM dd yyyy HH:mm:ss 'GMT'Z '('zzzz')'");
        LocalDate Start = null;
        LocalDate End = null;
        if (startDate != null && !startDate.equals("null") && endDate != null && !endDate.equals("null")) {
            Start = ZonedDateTime.parse(startDate, formatter).withHour(0).withMinute(0).withSecond(0).toLocalDate();
            End = ZonedDateTime.parse(endDate, formatter).withHour(23).withMinute(59).withSecond(0).toLocalDate();
        }

        Pageable page = PageRequest.of(0, 10);
        try {
            DataStaticDTO DTO  = new DataStaticDTO();
            Page<BorrowingBookDTO> borrowingBookDTOList = reprotService.getBorrowingData(page, Start, End);
            List<CategoryDto> CategoryDTOList = reprotService.getCategoryStatic(Start, End);

            DTO.setBookDTO(borrowingBookDTOList);
            DTO.setCategoryDTO(CategoryDTOList);

            return ResponseEntity.ok(DTO);
        } catch (Exception e) {
            System.err.println("Error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



    @GetMapping(path = "/mostBorrowers")
    public ResponseEntity<Page<BorrowingBookDTO>> getMostFrequentBorrowers( @RequestParam String period,
                                                                            @RequestParam(value = "page", defaultValue = "1") int page,
                                                                            @RequestParam(value = "size", defaultValue = "10") int size
                                                                          ) {
        Pageable pageable = PageRequest.of(page-1,size);
        return reprotService.getMostFrequentBorrower1(period,pageable);
    }

    @GetMapping(path="reportBorrowMoth")
    public  ResponseEntity<List<Map<String ,Object>>> getReportBorrowMoth(@RequestParam String date,
                                                                          @RequestParam(required = false) String category){
            List<Map<String, Object>> report = reprotService.getReportBorrowMonth(date,category);
            return ResponseEntity.ok(report);
    }



    @GetMapping("getTopBooks")
    public TopBooksResponseDTO getTopBooks(@RequestParam(required = false) String date) {
        try {
            if (date == null || date.isEmpty()) {
                return borrowingService.getAllTopBooks();
            }
            return borrowingService.getTopBooks(date);
        } catch (Exception e) {
            throw new RuntimeException("เกิดข้อผิดพลาดขณะดึงข้อมูลหนังสือยอดนิยม", e);
        }
    }

    @GetMapping("getTopBooked")
    public ResponseEntity<List<BorrowingBookDTO>> getBorrowingData(@RequestParam(name = "date", required = false) String date) {
        try {
            List<BorrowingBookDTO> borrowingData = reprotService.getBorrowingDatas(date);
            return ResponseEntity.ok(borrowingData);
        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/top-viewed")
    public ResponseEntity<List<ReportTopBookDto>> getTopViewedBooks(@RequestParam(defaultValue = "10") int limit,
                                                                    @RequestParam(required = false) String categoryCode) {
        List<ReportTopBookDto> topViewedBooks = bookService.getTopViewedBooks(limit,categoryCode);
        return ResponseEntity.ok(topViewedBooks);
    }

    @GetMapping("/borrowing-test")
    public ResponseEntity<List<TopBooksResponseDTO>> getBorrowingByPeriod(
            @RequestParam(required = false) String categoryCode,
            @RequestParam(required = false) String period
    ) {
        System.out.println(categoryCode);
        System.out.println(period);
        List<TopBooksResponseDTO> borrowings = borrowingService.getBorrowingsByPeriod(categoryCode, period);
        return ResponseEntity.ok(borrowings);
    }
    

    @PostMapping("/borrowing-period1")
    public ResponseEntity<List<TopBooksResponseDTO>> getBorrowingByPeriod1(@RequestBody TopBooksResponseDTO dtoReq) {
        List<TopBooksResponseDTO> borrowings = borrowingService.getBorrowingsByPeriod1(
                dtoReq.getCategory(),
                dtoReq.getDateStart(),
                dtoReq.getDateEnd()
        );
        return ResponseEntity.ok(borrowings);
    }


} // end
