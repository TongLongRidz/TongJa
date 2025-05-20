package com.testing.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name="USERS_TRAIN")
public class UsersTrainEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "your_sequence")
    @SequenceGenerator(name = "your_sequence", sequenceName = "your_sequence_name",
            initialValue = 1, allocationSize = 1)
    private Long id;

    @Column(name = "firstname")
    private String firstname;

    private String lastname;

    private int age;

    private String email;

    @ManyToMany
    @JoinTable(
            name = "user_role",
            joinColumns=@JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private List<RoleEntity> roles;
}
