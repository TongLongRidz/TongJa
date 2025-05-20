package com.testing.repository;

import com.testing.entity.PetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<PetEntity, Long> {

    List<PetEntity> findByBreeds(String breeds);
    List<PetEntity> findByBreedsContainingIgnoreCaseOrTypeOrderByNameAsc(String breeds, String type);
    List<PetEntity> findByBirthYearGreaterThan(int birthYear);
    List<PetEntity> findByNameAndBreedsAndType(String name, String breeds, String type);

    @Query("SELECT p FROM PetEntity p WHERE p.name LIKE :name AND p.type = :type")
    List<PetEntity> findByNameAndTypeJPQL(@Param("name") String name, @Param("type") String type);

    @Query(value = "SELECT p FROM Pet p WHERE p.name LIKE :name AND p.breeds = :breeds AND p.type = :type",nativeQuery = true)
    List<PetEntity> findByNameAndBreedsAndTypeSQL (@Param("name") String name, @Param("breeds") String breeds, @Param("type") String type);
}
