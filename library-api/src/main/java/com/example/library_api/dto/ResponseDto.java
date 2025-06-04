package com.example.library_api.dto;


import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class ResponseDto {

    private int status;
    private String Description;


}
