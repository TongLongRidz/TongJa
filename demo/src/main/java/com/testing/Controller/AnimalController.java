package com.testing.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/animal")
public class AnimalController {

    private final List<String> animals = new ArrayList<>(Arrays.asList("cat", "dog", "hippo"));

    @PostMapping("/add")
    public ResponseEntity<String> addAnimal(@RequestBody String animal) {
        animals.add(animal);
        return ResponseEntity.status(HttpStatus.CREATED).body(animal);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<String>> getAllAnimals() {
        return ResponseEntity.ok(animals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<String> getAnimalById(@PathVariable("id") int id) {
        try {
            return ResponseEntity.ok(animals.get(id));
        } catch (IndexOutOfBoundsException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Animal Not Found.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editAnimalById(@PathVariable("id") int id, @RequestBody String animal) {
        try {
            animals.set(id, animal);
            return ResponseEntity.ok(animals);
        } catch (IndexOutOfBoundsException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Animal Not Found.");
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAnimalById(@PathVariable("id") int id) {
        try {
            animals.remove(id);
            return ResponseEntity.status(HttpStatus.OK).body("Animal Deleted.");
        } catch (IndexOutOfBoundsException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Animal Not Found.");
        }
    }


}
