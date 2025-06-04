package com.example.library_api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "ROLES")
public class RoleTypeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator ="ROLES_SEQ")
    @SequenceGenerator(name = "ROLES_SEQ", sequenceName = "ROLES_SEQ",   allocationSize = 1)

    @Column(name = "ROLE_ID")
    private Long id;

    @Column(name = "ROLE_CODE")
    private String roleCode;

    @Column(name = "ROLE_NAME")
    private String roleName;
}
