package com.example.library_api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Column;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
@Data
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL) // ไม่รวมค่า null
public class TopBooksResponseDTO {
    private String category;
    private Long borrow;
    private Long returnBook;
    private Long overdue;

    private LocalDate dateStart;
    private LocalDate dateEnd;



    private List<Integer> series;
    private List<String> labels;

    public TopBooksResponseDTO(){}

    public TopBooksResponseDTO(List<Integer> series, List<String> labels) {
        this.series = series;
        this.labels = labels;
    }

    public TopBooksResponseDTO(String category, Long borrow, Long returnBook, Long overdue) {
        this.category = category;
        this.borrow = borrow;
        this.returnBook = returnBook;
        this.overdue = overdue;
    }


    public TopBooksResponseDTO(String category,LocalDate dateStart, LocalDate dateEnd){
        this.category = category;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
    }


}
