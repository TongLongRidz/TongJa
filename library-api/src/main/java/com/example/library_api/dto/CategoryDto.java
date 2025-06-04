package com.example.library_api.dto;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CategoryDto {
    private Long id;
    private String keyword;
    private String categoryCode;
    private String categoryName;
    private Integer isDeleted;
    private Integer totalBorrow;

}
