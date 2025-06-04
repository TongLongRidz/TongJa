package com.example.library_api.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Data
@Getter
@Setter
public class SaleDto {


    private LocalDate date;

    private String branch;

    private int quantity;

    private int price;

}
