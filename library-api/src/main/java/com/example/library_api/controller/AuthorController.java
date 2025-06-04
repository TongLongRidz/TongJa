package com.example.library_api.controller;

import com.example.library_api.dto.JwtResponse;
import com.example.library_api.dto.MsUserDTo;
import com.example.library_api.dto.ProfileDTO;
import com.example.library_api.dto.ResponseDto;
import com.example.library_api.entity.ProfileEntity;
import com.example.library_api.security.JwtUtils;
import com.example.library_api.security.UserDetailsImpl;
import com.example.library_api.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.Map;


@RequestMapping(path = "/auth")
@RestController
@Slf4j
@RequiredArgsConstructor
public class AuthorController {
    private  final AuthenticationManager authenticationManager;
    private  final JwtUtils jwtUtils;
    private  final ProfileService profileService;


    @PostMapping("login")
    public ResponseEntity<?> userLogin(@RequestBody MsUserDTo msUserDto) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(msUserDto.getEmail(), msUserDto.getPassword()));
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        ProfileDTO profileEntity = profileService.getProfileByIdWithLogin(userDetails.getId());

        JwtResponse jwt = null;
        if (authentication != null) {
            if (authentication.getPrincipal() instanceof UserDetailsImpl){
                jwt = jwtUtils.generateJwtToken(authentication, profileEntity);
            }
        }
        return ResponseEntity.ok(jwt);
    }

    @PostMapping("register")
    public ResponseEntity<?> registerform(@RequestBody ProfileEntity profileDTO) {
        ResponseDto responseDto = new ResponseDto();
        try {
            profileService.registerUser(profileDTO);

            responseDto.setStatus(200);
            responseDto.setDescription("สมัครสมาชิก สำเร็จ");
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            log.error("Error occurred while registering user", e);

            responseDto.setStatus(400);
            responseDto.setDescription("สมัครสมาชิก ไม่สำเร็จ");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDto);
        }
    }

    @GetMapping("checkEmailExists")
    public Map<String, Boolean> checkEmail(@RequestParam String email) {
        boolean exists = profileService.emailExists(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists",exists);
        return  response;
    }

    @GetMapping("/doc/manual")
    public ResponseEntity<Resource> getDocManual() {
        try {
            String userHome = System.getProperty("user.home");
            String filePath = userHome + File.separator + ".takeLibro" + File.separator + "Doc" + File.separator + "Manual-system-user-takeLibro.pdf";
            File file = new File(filePath);

            if (file.exists()) {
                Resource resource = new FileSystemResource(file);
                String contentType = URLConnection.guessContentTypeFromName(file.getName());
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            log.error("Error serving doc manual: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}
