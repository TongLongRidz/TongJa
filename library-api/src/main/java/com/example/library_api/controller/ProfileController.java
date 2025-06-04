package com.example.library_api.controller;

import com.example.library_api.dto.DecodeJwtDTO;
import com.example.library_api.dto.ProfileByAdminDTO;
import com.example.library_api.dto.ProfileDTO;
import com.example.library_api.dto.ResponseDto;
import com.example.library_api.entity.BorrowingEntity;
import com.example.library_api.entity.ProfileEntity;
import com.example.library_api.security.JwtUtils;
import com.example.library_api.service.ProfileService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.Optional;

@RestController
@Slf4j
@RequestMapping(path = "/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;
    private final JwtUtils jwtUtils;

    @GetMapping("/id/{profileId}")
    public  ResponseEntity<ProfileDTO> getProfileByID(@PathVariable Long profileId) {
        Optional<ProfileDTO> profileDTO = profileService.getProfileById(profileId);
        return ResponseEntity.ok(profileDTO.get());
    }

    @GetMapping("/{id}")
    public  ResponseEntity<ProfileDTO> getProfileByIdEntity(@PathVariable Long id) {
        ProfileDTO profile = profileService.getProfileByIdWithLogin(id);
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/edit")
    public ResponseEntity<ResponseDto> editProfile(@RequestBody ProfileEntity profile) {
        String result = profileService.editProfileUser(profile);
        ResponseDto responseDto = new ResponseDto();

        if ("error".equals(result)) {
            responseDto.setStatus(400);
            responseDto.setDescription("เกิดข้อผิดพลาด! ในการอัพเดทข้อมูล");
            return ResponseEntity.badRequest().body(responseDto);
        }

        responseDto.setStatus(200);
        responseDto.setDescription("แก้ไขผู้ใช้: " + profile.getFirstName() + " " + profile.getLastName() + " สำเร็จ");
        return ResponseEntity.ok(responseDto);
    }


//    ----------------- for page --------------

    @GetMapping()
    public ResponseEntity<Page<ProfileDTO>> getAllProfile(
            HttpServletRequest request,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "true") boolean sort,
            @RequestParam(defaultValue = "dis") String name_sort,
            @RequestParam(defaultValue = "false") boolean his) {
        Pageable pageable;
        DecodeJwtDTO decodedJwt = jwtUtils.decodeJwt(request);
        if (decodedJwt != null) {
            if (!Objects.equals(name_sort, "dis")){
                pageable = PageRequest.of(page - 1, size);
            } else {
                if (sort) {
                    pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.ASC, "id"));
                } else {
                    pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "id"));
                }
            }
            String role = decodedJwt.getRoles().length > 0 ? decodedJwt.getRoles()[0] : "R001";
            Page<ProfileDTO> bookList = profileService.getAllProfileServeice(pageable, his, name_sort, role);

            return ResponseEntity.ok(bookList);
        }
        return ResponseEntity.badRequest().body(Page.empty());
    }


    @PostMapping("/search")
    public ResponseEntity<Page<ProfileDTO>> setSearchBook(
            HttpServletRequest request,
            @RequestBody String searchKey,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "true") boolean sort,
            @RequestParam(defaultValue = "dis") String name_sort,
            @RequestParam(defaultValue = "false") boolean his) {
        Pageable pageable;
        DecodeJwtDTO decodedJwt = jwtUtils.decodeJwt(request);
        if (decodedJwt != null) {
            if (!Objects.equals(name_sort, "dis")) {
                pageable = PageRequest.of(page - 1, size);
            } else {
                if (sort) {
                    pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.ASC, "id"));
                } else {
                    pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "id"));
                }
            }
            String role = decodedJwt.getRoles().length > 0 ? decodedJwt.getRoles()[0] : "R001";
            Page<ProfileDTO> bookList = profileService.getSearchProfile(searchKey, pageable, his, name_sort, role);

            if (bookList.isEmpty()) {
                return ResponseEntity.ok(null);
            } else {
                return ResponseEntity.ok(bookList);
            }
        }

        return ResponseEntity.badRequest().body(Page.empty());
    }



    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProfileId(@PathVariable("id") Long id) {
        ResponseDto responseDto = new ResponseDto();
        try{
            profileService.deleteProfileId(id);

            responseDto.setStatus(200);
            responseDto.setDescription("ลบข้อมูลโปรไฟล์ สำเร็จ");
            return ResponseEntity.ok(responseDto);
        }catch (Exception e){
            responseDto.setStatus(500);
            responseDto.setDescription("ลบข้อมูลโปรไฟล์ ไม่สำเร็จ");
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
        }

    }


    @PostMapping("admin/edit")
    public ResponseEntity<ResponseDto> adminEditProfile(@RequestBody ProfileByAdminDTO profile) {
        String result = profileService.adminEditProfileUser(profile);
        ResponseDto responseDto = new ResponseDto();

        if ("error".equals(result)) {
            responseDto.setStatus(400);
            responseDto.setDescription("เกิดข้อผิดพลาด! ในการอัพเดทข้อมูล");
            return ResponseEntity.badRequest().body(responseDto);
        }

        responseDto.setStatus(200);
        responseDto.setDescription("แก้ไขผู้ใช้: " + profile.getFirstName() + " " + profile.getLastName() + " สำเร็จ");
        return ResponseEntity.ok(responseDto);
    }


    @PostMapping("admin/addUser")
    public ResponseEntity<ResponseDto>  adminAddUser(@RequestBody ProfileByAdminDTO profileDTO) {
        String result = profileService.adminAddProfileUser(profileDTO);
        ResponseDto responseDto = new ResponseDto();

        if ("error".equals(result)) {
            responseDto.setStatus(400);
            responseDto.setDescription("เกิดข้อผิดพลาด! ในการเพิ่มข้อมูลผู้ใช้งาน");
            return ResponseEntity.badRequest().body(responseDto);
        }

        responseDto.setStatus(200);
        responseDto.setDescription("เพิ่มผู้ใช้งาน: " + profileDTO.getFirstName() + " " + profileDTO.getLastName() + " สำเร็จ");
        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("admin/edit/password")
    public ResponseEntity<ResponseDto> adminEditProfilePassword(@RequestBody ProfileByAdminDTO profile) {
        String result = profileService.adminEditProfilePassword(profile);
        ResponseDto responseDto = new ResponseDto();

        if ("error".equals(result)) {
            responseDto.setStatus(400);
            responseDto.setDescription("เกิดข้อผิดพลาด! ในการอัพเดทข้อมูล");
            return ResponseEntity.badRequest().body(responseDto);
        }

        responseDto.setStatus(200);
        responseDto.setDescription("แก้ไขรหัสผ่านผู้ใช้ไอดี: " + profile.getId() + " สำเร็จ");
        return ResponseEntity.ok(responseDto);
    }


    @PostMapping("admin/check/email")
    public ResponseEntity<Boolean> adminCheckEmail(@RequestBody ProfileByAdminDTO profile) {
        String result = profileService.adminCheckEmail(profile);

        if ("ok".equals(result)) {
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.ok(false);
    }





}
