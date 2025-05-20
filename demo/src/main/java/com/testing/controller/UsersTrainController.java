package com.testing.controller;

import com.testing.dto.UserDTO;
import com.testing.entity.UsersTrainEntity;
import com.testing.service.UsersTrainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
public class UsersTrainController {
    private final UsersTrainService usersTrainService;

    @PostMapping("/createWithRole")
    public ResponseEntity<UsersTrainEntity> createWithRole(@RequestBody UserDTO userDTO) {
        UsersTrainEntity savedUser = usersTrainService.createWithRole(userDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }
}
