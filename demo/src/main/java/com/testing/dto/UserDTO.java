package com.testing.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserDTO {
//    private Long id;
    private String firstname;
    private String lastname;
    private int age;
    private String email;
    private List<Long> roleIds;
}
