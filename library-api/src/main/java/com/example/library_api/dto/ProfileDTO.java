package com.example.library_api.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
public class ProfileDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String telephone;
    private String image;
    private String profileCode;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
    private String username;



    private String role;
    private String roleName;
    private String roleCode;

    public ProfileDTO() {
    }

    public ProfileDTO(Long id, String firstName, String lastName, String profileCode) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.profileCode = profileCode;
    }

    public ProfileDTO(Long id, String firstName, String lastName, String email, String telephone, String image, String profileCode, LocalDateTime createAt, LocalDateTime updateAt) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.profileCode = profileCode;
        this.email = email;
        this.telephone = telephone;
        this.image = image;
        this.createAt = createAt;
        this.updateAt = updateAt;
    }

    public ProfileDTO(Long id, String firstName, String lastName, String email, String telephone, String image, String profileCode, LocalDateTime createAt, LocalDateTime updateAt, String role, String roleName) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.profileCode = profileCode;
        this.email = email;
        this.telephone = telephone;
        this.image = image;
        this.createAt = createAt;
        this.updateAt = updateAt;

        this.role = role;
        this.roleName = roleName;
    }
}
