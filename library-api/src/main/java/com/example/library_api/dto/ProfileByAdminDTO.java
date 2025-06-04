package com.example.library_api.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
public class ProfileByAdminDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String telephone;
    private String image;
    private String profileCode;
    private String password;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;

    private String role;
    private String roleName;

}
