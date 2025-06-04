package com.example.library_api.dto.master;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class LdapDTO {
    private String email;
    private String password;
    private String username;
    private String fullName;
    private String firstName;
    private String lastName;
    private String company;
}
