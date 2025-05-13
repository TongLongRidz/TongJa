package com.testing.Controller;

import com.testing.Entity.ProductEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
@Slf4j
public class ProductController {
    private final List<ProductEntity> productList = new ArrayList<>();
//    private final List<String> productList = new ArrayList<>();

    @GetMapping
    public ResponseEntity<List<ProductEntity>> show(){
        return ResponseEntity.ok(productList);
    }

    @PostMapping
    public ResponseEntity<ProductEntity> createProduct(@RequestBody ProductEntity product) {
        productList.add(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    @PutMapping("{id}")
    public ResponseEntity<?> editProduct(@PathVariable int id, @RequestBody String body) {
        try {
            for (ProductEntity product :  productList){
                if (product.getId() == id){
                    product.setName(body);
                }
            }
            return ResponseEntity.ok(productList);
        } catch (IndexOutOfBoundsException e) {
//            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product Not Found");
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteProductByID(@PathVariable int id) {
        try {
            productList.remove(id);
            return ResponseEntity.status(HttpStatus.OK).body("Product Deleted");
        } catch (IndexOutOfBoundsException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product Not Found");
        }
    }

//    @PostMapping
//    public ResponseEntity<String> createProduct(@RequestBody String name) {
//        productList.add(name);
//        return ResponseEntity.status(HttpStatus.CREATED).body("Save Product Success");
//    }
}
