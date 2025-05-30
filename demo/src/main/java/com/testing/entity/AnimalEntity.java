package com.testing.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="Animals")
public class AnimalEntity {

    @Id
    @Column(name="id",nullable = false)
    private Long id;

    @Column(name="name")
    private String name;

    public AnimalEntity() {

    }

    public AnimalEntity(int id, String name) {
        this.id = (long) id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
