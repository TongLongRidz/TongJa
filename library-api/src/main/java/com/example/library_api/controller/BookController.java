package com.example.library_api.controller;


import com.example.library_api.dto.*;
import com.example.library_api.entity.BookEntity;
import com.example.library_api.entity.CommentEntity;
import com.example.library_api.service.BookService;
import com.example.library_api.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.net.URLConnection;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@Slf4j
@RequestMapping(path = "/api/book")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;
    private final CommentService commentService;

    @GetMapping()
    public ResponseEntity<Page<BookTableDTO>> getAllBooks(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "true") boolean sort,
            @RequestParam(defaultValue = "dis") String name_sort,
            @RequestParam(defaultValue = "false") boolean his,
            @RequestParam(defaultValue = "th") String lang){
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
        Page<BookTableDTO> bookList = bookService.getAllBook(pageable, his, name_sort, lang);

        return ResponseEntity.ok(bookList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookEntity> getBookById(@PathVariable long id) {
        Optional<BookEntity> bookEntity = bookService.getBookByID(id);
        return bookEntity.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }


    @PostMapping("new")
    public ResponseEntity<?> setNewBook(@RequestBody BookDto bookDto) {
        String log = bookService.newBook(bookDto);
        ResponseDto responseDto = new ResponseDto();

        if ("error".equals(log)) {
            responseDto.setStatus(400);
            responseDto.setDescription("เกิดข้อผิดพลาด! การสร้างหนังสือใหม่ล้มเหลว");
            return ResponseEntity.badRequest().body(responseDto);
        } else if ("already".equals(log)) {
            responseDto.setStatus(400);
            responseDto.setDescription("เกิดข้อผิดพลาด! รหัสหนังสือมีอยู่แล้ว");
            return ResponseEntity.badRequest().body(responseDto);
        }
        responseDto.setStatus(200);
        responseDto.setDescription("สำเร็จ! สร้างหนังสือใหม่: " + bookDto.getBookNameTh());
        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("edit")
    public ResponseEntity<?> setUpdateBook(@RequestBody BookDto bookDto, @RequestParam String active) {
        String log = bookService.updateBook(bookDto, active);
        ResponseDto responseDto = new ResponseDto();
        if ("error".equals(log)) {
            responseDto.setStatus(400);
            responseDto.setDescription("เกิดข้อผิดพลาด! การอัปเดตหนังสือล้มเหลว");
            return ResponseEntity.badRequest().body(responseDto);
        }
        responseDto.setStatus(200);
        responseDto.setDescription("สำเร็จ! อัปเดตหนังสือ: "+ bookDto.getBookNameTh());
        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping(path = "delete/kill/{id}")
    public ResponseEntity<?> deleteKillBookID(@PathVariable("id") Long id) {
        String log = bookService.deleteKillBookID(id);
        ResponseDto responseDto = new ResponseDto();

        if ("ok".equals(log)) {

            responseDto.setStatus(200);
            responseDto.setDescription("สำเร็จ! ลบหนังสือโดยไม่คืนค่าด้วย ID: " + id);
            return ResponseEntity.ok(responseDto);
        } else if ("not_found".equals(log)) {

            responseDto.setStatus(404);
            responseDto.setDescription("เกิดข้อผิดพลาด! ไม่พบหนังสือโดยไม่คืนค่าด้วย ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseDto);
        } else {

            responseDto.setStatus(400);
            responseDto.setDescription("เกิดข้อผิดพลาด! ลบหนังสือโดยไม่คืนค่าล้มเหลวด้วย ID: " + id);
            return ResponseEntity.badRequest().body(responseDto);
        }
    }

    @DeleteMapping(path = "delete/{id}")
    public ResponseEntity<?> deleteIsStatusBookID(@PathVariable("id") Long id) {
        String log = bookService.deleteStatusBookID(id);
        ResponseDto responseDto = new ResponseDto();

        if ("ok".equals(log)) {

            responseDto.setStatus(200);
            responseDto.setDescription("สำเร็จ! ลบหนังสือด้วย ID: " + id);
            return ResponseEntity.ok(responseDto);
        } else if ("not_found".equals(log)) {

            responseDto.setStatus(404);
            responseDto.setDescription("เกิดข้อผิดพลาด! ไม่พบหนังสือด้วย ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("เกิดข้อผิดพลาด! ไม่พบหนังสือด้วย ID: " + id);
        } else {
            responseDto.setStatus(400);
            responseDto.setDescription("เกิดข้อผิดพลาด! ลบหนังสือล้มเหลวด้วย ID: " + id);
            return ResponseEntity.badRequest().body(responseDto);
        }
    }

    @DeleteMapping(path = "redelete/{id}")
    public ResponseEntity<?> reDeleteIsStatusBookID(@PathVariable("id") Long id) {
        String log = bookService.reDeleteStatusBookID(id);
        ResponseDto responseDto = new ResponseDto();

        if ("ok".equals(log)) {

            responseDto.setStatus(200);
            responseDto.setDescription("สำเร็จ! ลบกลับหนังสือด้วย ID: " + id);
            return ResponseEntity.ok(responseDto);
        } else if ("not_found".equals(log)) {

            responseDto.setStatus(404);
            responseDto.setDescription("เกิดข้อผิดพลาด! ไม่พบหนังสือด้วย ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseDto);
        } else {

            responseDto.setStatus(400);
            responseDto.setDescription("เกิดข้อผิดพลาด! ลบกลับหนังสือล้มเหลวด้วย ID: " + id);
            return ResponseEntity.badRequest().body(responseDto);
        }
    }

    @PostMapping("/search")
    public ResponseEntity<Page<BookTableDTO>> setSearchBook(
            @RequestBody String searchKey,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "true") boolean sort,
            @RequestParam(defaultValue = "dis") String name_sort,
            @RequestParam(defaultValue = "false") boolean his,
            @RequestParam(defaultValue = "th") String lang) {

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

        Page<BookTableDTO> bookList = bookService.getSearchBook(searchKey, pageable, his, name_sort, lang);

        if (bookList.isEmpty()) {
            return ResponseEntity.ok(null);
        } else {
            return ResponseEntity.ok(bookList);
        }
    }

    @GetMapping("/searchbooks")
    public Page<BookDto> searchBooks(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "15") int size,
            @RequestParam(value = "categoryCode", required = false) String categoryCode,
            @RequestParam(value = "status", required = false) String status) {
        return bookService.searchBooks(page, size, categoryCode, status);
    }


    @GetMapping("detail/check/{id}")
    public ResponseEntity<Boolean> checkBookDetailById(@PathVariable long id) {
        String log = bookService.checkBookDetailsByID(id);
        if (Objects.equals(log, "ok")) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.ok(false);
        }
    }

    @GetMapping("detail/{id}")
    public ResponseEntity<BookDetailDTO> getBookDetailById(@PathVariable long id) {
        BookDetailDTO bookDetail = bookService.getBookDetailsByID(id);
        if (bookDetail != null) {
            return ResponseEntity.ok(bookDetail);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("detail/recommend/{id}")
    public ResponseEntity<List<BookEntity>> getBookDetailRecommend(@PathVariable Long id) {
        Optional<BookEntity> bookByID = bookService.getBookByID(id);
        Pageable pageable;
        pageable = PageRequest.of(0, 4, Sort.by(Sort.Direction.ASC, "id"));
        List<BookEntity> bookPage = bookService.getBookRecommend(bookByID.get(), pageable);
        if (bookPage != null) {
            return ResponseEntity.ok(bookPage);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/borrow-counts")
    public List<Object[]> BookBorrowCounts() {
        return bookService.getBookBorrowCounts();
    }


    @PostMapping("/comment/add")
    public ResponseEntity<?> addBookComment(@RequestBody CommentEntity commentEntity) {
        Long id = commentService.addBookComment(commentEntity);
        if(id != null){
            return ResponseEntity.ok(id);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/comment/book/{Code}")
    public ResponseEntity<Page<CommentsDTO>>getBookComments(
            @PathVariable String Code,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<CommentsDTO> comments = commentService.getBookComments(Code, pageable);
        if (comments.isEmpty()) {
            return ResponseEntity.ok(null);
        } else {
            return ResponseEntity.ok(comments);
        }
    }

    @PostMapping("/increment-view/{id}")
    public ResponseEntity<?> incrementView(@PathVariable Long id){
        ResponseDto responseDto = new ResponseDto();
        if(bookService.incrementTotalView(id)){
            responseDto.setStatus(200);
            responseDto.setDescription("View count incremented successfully");
            return ResponseEntity.ok(responseDto);
        } else {
            responseDto.setStatus(400);
            responseDto.setDescription("Error increment view count");
            return ResponseEntity.badRequest().body(responseDto);
        }

    }

    @GetMapping("/images/{imageName}")
    public ResponseEntity<Resource> getImage(@PathVariable String imageName) {
        try {
            String userHome = System.getProperty("user.home");
            String imagePath = userHome + File.separator + ".takeLibro" + File.separator + "Books" + File.separator + imageName;
            File imageFile = new File(imagePath);

            if (imageFile.exists()) {
                Resource resource = new FileSystemResource(imageFile);
                String contentType = URLConnection.guessContentTypeFromName(imageName);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            log.error("Error serving image: {}", imageName, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


} // end
