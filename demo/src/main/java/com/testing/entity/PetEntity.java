package com.testing.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="PET")
public class PetEntity {

    @Id
    private Long id;

    private String name;

    private String type;

    private String breeds;

    private int birthYear;
}
