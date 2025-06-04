package com.example.library_api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DecodeJwtDTO {
    private Long id;
    private String profileCode;
    private String firstName;
    private String lastName;
    private String[] roles;
    private String email;
    private String iat;
    private String exp;
}
