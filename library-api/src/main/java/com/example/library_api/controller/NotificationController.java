package com.example.library_api.controller;


import com.example.library_api.dto.ResponseDto;
import com.example.library_api.entity.NotificationEntity;
import com.example.library_api.repository.NotificationRepository;
import com.example.library_api.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;

    @GetMapping("/all/{profileCode}")
    public List<NotificationEntity> getNotiByCode(@PathVariable String profileCode){
        return notificationService.notiByRolCode(profileCode);
    }

    @PostMapping("isRead/{id}")
    public ResponseEntity<?> notiIsRead(@PathVariable Long id){
        ResponseDto responseDto = new ResponseDto();
        responseDto.setDescription("อ่านข้อความแจ้งเตื่อน"+id+"สำเร็จ");
        responseDto.setStatus(200);
        notificationService.isRead(id);
    return ResponseEntity.ok().body(responseDto);
    }

    @PutMapping("isReadAll/{profileCode}")
    public List<NotificationEntity> isReadAll(@PathVariable String profileCode) {
        return notificationService.isReadAll(profileCode);
    }

    @PutMapping("isDeleteAll/{profileCode}")
    public void isDeleteAll(@PathVariable String profileCode) {
        notificationService.isDeleteAll(profileCode);
    }


    @PutMapping("/deleteSelected")
    public void deleteSelected(@RequestBody List<Long> ids) {
        notificationService.deleteNotiByIds(ids);
    }




}
