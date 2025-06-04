package com.example.library_api.controller;


import com.example.library_api.dto.*;
import com.example.library_api.service.BorrowingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@RestController
@Slf4j
@RequestMapping(path = "/api/borrowing")
@RequiredArgsConstructor
public class BorrowingController {

    private final BorrowingService borrowingService;

    @GetMapping()
    public ResponseEntity<Page<BorrowingBookDTO>> getAllBorrowing(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "true") boolean sort,
            @RequestParam(defaultValue = "dis") String name_sort,
            @RequestParam(defaultValue = "false") boolean historyAll,
            @RequestParam(defaultValue = "th") String lang ){
        Pageable pageable;
        if (!Objects.equals(name_sort, "dis")){
            pageable = PageRequest.of(page - 1, size);
        } else {
            if (sort) {
                pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.ASC, "id"));
            } else {
                pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "id"));
            }
        }
        Page<BorrowingBookDTO> borrowList = borrowingService.getAllBorrowBook(pageable, historyAll, name_sort, lang);
        return ResponseEntity.ok(borrowList);
    }



    @DeleteMapping(path = "delete/{id}")
    public ResponseEntity<?> deleteIsStatusBookID(@PathVariable("id") Long id) {
        String log = borrowingService.deleteStatusBorrowBookID(id);
        ResponseDto responseDto = new ResponseDto();
        if ("ok".equals(log)) {

            responseDto.setStatus(200);
            responseDto.setDescription("สำเร็จ! ลบหนังสือด้วย ID: " + id);
            return ResponseEntity.ok(responseDto);
        } else if ("not_found".equals(log)) {

            responseDto.setStatus(404);
            responseDto.setDescription("เกิดข้อผิดพลาด! ไม่พบหนังสือด้วย ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseDto);
        } else {
            responseDto.setStatus(400);
            responseDto.setDescription("เกิดข้อผิดพลาด! ลบหนังสือล้มเหลวด้วย ID: " + id);
            return ResponseEntity.badRequest().body(responseDto);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BorrowingBookDTO> getBorrowBookById(@PathVariable long id) {
        Optional<BorrowingBookDTO> BorrowID = borrowingService.getBorrowBookByID(id);
        return BorrowID.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }


    @PostMapping("/search")
    public ResponseEntity<Page<BorrowingBookDTO>> setSearchBook(
            @RequestBody String searchKey,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "true") boolean sort,
            @RequestParam(defaultValue = "false") boolean his,
            @RequestParam(defaultValue = "th") String lang) {
        Pageable pageable;
        if (sort) {
            pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.ASC, "id"));
        } else {
            pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "id"));
        }
        Page<BorrowingBookDTO> bookList = borrowingService.getSearchBorrowBook(searchKey, pageable, his, lang);
        return ResponseEntity.ok(bookList);
    }


    @PostMapping("edit")
    public ResponseEntity<?> setUpdateBorrowBook(@RequestBody BorrowingBookDTO borrowingBookDTO) {
        Long id = borrowingBookDTO.getId();
        LocalDate borrowEnd = borrowingBookDTO.getBorrowEnd();
        int borrowStatus = borrowingBookDTO.getBorrowStatus();
        String active = borrowingBookDTO.getActive();
        String borrowImage = borrowingBookDTO.getBorrowImage();

        String log = borrowingService.updateBorrowBook(id, borrowEnd, borrowStatus, borrowImage, active);
        ResponseDto responseDto = new ResponseDto();
        if ("error".equals(log)) {

            responseDto.setStatus(400);
            responseDto.setDescription("เกิดข้อผิดพลาด! การอัปเดตหนังสือล้มเหลว");
            return ResponseEntity.badRequest().body(responseDto);
        }
        responseDto.setStatus(200);
        responseDto.setDescription("สำเร็จ! อัปเดตหนังสือ");
        return ResponseEntity.ok("สำเร็จ! อัปเดตหนังสือ");
    }


    @PostMapping("/saveBorrowData")
    public ResponseEntity<?> saveBorrowBook(@RequestBody BorrowBookHisDTO borrowBookHisDTO) {
        ResponseDto responseDto = new ResponseDto();
        try {
            borrowingService.newSaveBorrowBook(borrowBookHisDTO);

            responseDto.setStatus(200);
            responseDto.setDescription("บันทึกรายการยืม สำเร็จ");
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {

            responseDto.setStatus(500);
            responseDto.setDescription("บันทึกรายการยืม ไม่สำเร็จ");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
        }
    }


    @PostMapping("/searchHis")
    @ResponseStatus(HttpStatus.OK)
    public Page<BorrowBookHisDTO> getKeyword(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "true") boolean sort,
            @RequestBody BorrowBookHisDTO borrowBookHisDTO) {
        Pageable pageable = sort
                ? PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"))
                : PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "id"));


        return borrowingService.getKeyword(pageable, borrowBookHisDTO);
    }

    @PostMapping("/searchMyHis")
    @ResponseStatus(HttpStatus.OK)
    public Page<BorrowBookHisDTO> getKeywordHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "true") boolean sort,
            @RequestBody BorrowBookHisDTO borrowBookHisDTO) {

        Pageable pageable = sort
                ? PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"))
                : PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "id"));

        return borrowingService.getKeywordHistory(pageable, borrowBookHisDTO);
    }

    @PostMapping("/searchMyListBorrow")
    @ResponseStatus(HttpStatus.OK)
    public Page<BorrowBookHisDTO> getKeywordMyListBorrow(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "true") boolean sort,
            @RequestParam(value = "status", required = false) Integer status,
            @RequestBody BorrowBookHisDTO borrowBookHisDTO) {

        Pageable pageable = sort
                ? PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"))
                : PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "id"));

        if (status != null) {
            borrowBookHisDTO.setBorrowStatus(status);
        }
        return borrowingService.getKeywordMyListBorrow(pageable, borrowBookHisDTO);
    }


    @PostMapping("/searchMyListBorrowHis")
    @ResponseStatus(HttpStatus.OK)
    public Page<BorrowBookHisDTO> getKeywordMyListBorrowHis(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "true") boolean sort,
            @RequestBody BorrowBookHisDTO borrowBookHisDTO) {

        Pageable pageable = sort
                ? PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"))
                : PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "id"));

        return borrowingService.getKeywordMyListBorrow(pageable, borrowBookHisDTO);
    }

    @GetMapping("/getborrowImage/{id}")
    public ResponseEntity<?> getBorrowImage(@PathVariable("id") Long id) {
        return borrowingService.getImageById(id);
    }





} // end
