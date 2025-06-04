package com.example.library_api.controller;

import com.example.library_api.dto.SaleDto;
import com.example.library_api.service.SaleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequestMapping(path = "/api/sale")
@RequiredArgsConstructor
public class SaleController {



    private final SaleService saleService;


    @PostMapping("/list")
    public ResponseEntity<Map<String, Object>> dataReport(@RequestBody List<SaleDto> saleDto) {
        Map<String, Integer> branchSales = saleService.TotalSalesByBranch(saleDto);
        Integer totalAverageSalesed = saleService.totalAverageSales(saleDto);
//        Integer TotalaverageSalesPerDays = saleService.TotalaverageSalesPerDay(saleDto);
        Map<String, Integer> maxSalesByBranchs = saleService.MaxSalesByBranch(saleDto);

        Map<String, Object> response = new HashMap<>();
        response.put("branchSales", branchSales);
        response.put("totalAverageSalesed", totalAverageSalesed);
        response.put("maxSalesByBranchs", maxSalesByBranchs);
//        response.put("TotalaverageSalesPerDays", TotalaverageSalesPerDays);
        return ResponseEntity.ok(response);
    }






}
