package com.testing.Controller;

import com.testing.Entity.AnimalEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/animal")
public class AnimalController {

    private final List<AnimalEntity> animals = new ArrayList<>(Arrays.asList(
            new AnimalEntity(1,"Cat"),
            new AnimalEntity(2,"Dog"),
            new AnimalEntity(3,"Hippo")
    ));

    @PostMapping("/add")
    public ResponseEntity<?> addAnimal(@RequestBody AnimalEntity animal) {
        animals.add(animal);
        return ResponseEntity.status(HttpStatus.CREATED).body(animal);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<AnimalEntity>> getAllAnimals() {
        return ResponseEntity.ok(animals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnimalEntity> getAnimalById(@PathVariable("id") int id) {
        try {
            return ResponseEntity.ok(animals.get(id-1));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PutMapping("/editName")
    public ResponseEntity<?> editAnimalById(@RequestBody AnimalEntity animal) {
        try {
            animals.set((int) (animal.getId()-1), animal);
            return ResponseEntity.ok(animal);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAnimalById(@PathVariable("id") int id) {
        try {
            animals.remove(id-1);
            return ResponseEntity.status(HttpStatus.OK).body("Animal Deleted.");
        } catch (IndexOutOfBoundsException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Animal Not Found.");
        }
    }


}
