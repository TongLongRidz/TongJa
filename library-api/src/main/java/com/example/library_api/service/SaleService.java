package com.example.library_api.service;

import com.example.library_api.dto.SaleDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class SaleService {

    public  Map<String, Integer> TotalSalesByBranch(List<SaleDto> saleDto) {
        Map<String, Integer> branchSales = new HashMap<>();
//        Map<String, Integer> maxSalesByBranch = new HashMap<>();

        for (SaleDto sale: saleDto){
            String branch = sale.getBranch();
            int totalSale = sale.getQuantity() * sale.getPrice();

            branchSales.put(branch, branchSales.getOrDefault(branch, 0) + totalSale);

        }

        return branchSales;
    }

    public Integer totalAverageSales(List<SaleDto> saleDto) {
        int totalSales = 0;
        int number = saleDto.size();

        for (SaleDto sale : saleDto) {
            int total = sale.getQuantity() * sale.getPrice();
            totalSales += total;
        }

        Integer averageSalesPerEntry = number > 0 ? totalSales / number : 0;

        return averageSalesPerEntry;
    }


    public Map<String, Integer> MaxSalesByBranch(List<SaleDto> saleDto) {
        Map<String, Integer> maxSalesByBranch = new HashMap<>();

        for (SaleDto sale : saleDto) {
            String branch = sale.getBranch();
            int totalSale = sale.getQuantity() * sale.getPrice();

            maxSalesByBranch.put(branch, Math.max(maxSalesByBranch.getOrDefault(branch, 0), totalSale));
        }

        return maxSalesByBranch;
    }



    public Integer averageSalesDay(List<SaleDto> saleDto) {
        Map<LocalDate, Integer> dayDates = new HashMap<>();

        for (SaleDto sale: saleDto) {
            LocalDate date = sale.getDate();
            int total = sale.getQuantity() * sale.getPrice();

            dayDates.put(date,dayDates.getOrDefault(date,0) + total );
        }

        int totalSales = 0;
        for (Integer salesAmount : dayDates.values()) {
            totalSales += salesAmount;
        }

        int numberDays = dayDates.size();
        Integer totalSalesDay = numberDays > 0 ? totalSales / numberDays : 0;
        return totalSalesDay;
    }




}
