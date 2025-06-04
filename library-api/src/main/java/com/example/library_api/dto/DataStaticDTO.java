package com.example.library_api.dto;


import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
@Getter
@Setter
public class DataStaticDTO {
    Page<BorrowingBookDTO> bookDTO;
    List<CategoryDto>  categoryDTO;

}
