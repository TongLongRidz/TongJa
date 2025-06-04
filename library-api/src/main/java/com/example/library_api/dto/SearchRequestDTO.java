package com.example.library_api.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class SearchRequestDTO {
    private String keyword;
    private String category;
}
