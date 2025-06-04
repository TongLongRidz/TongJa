package com.example.library_api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class JwtResponse {
    String token;
    String accessToken;
    String refreshToken;
    String jwt;
    List<String> roles;
}
