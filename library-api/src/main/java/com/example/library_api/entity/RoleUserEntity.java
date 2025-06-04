package com.example.library_api.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "ROLE_USER_MAPPING")
public class RoleUserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator ="ROLE_USER_MAPPING_SEQ")
    @SequenceGenerator(name = "ROLE_USER_MAPPING_SEQ", sequenceName = "ROLE_USER_MAPPING_SEQ",   allocationSize = 1)

    @Column(name = "MAPPING_ID")
    private Long id;

    @Column(name = "ROLE_CODE")
    private String roleCode;

    @Column(name = "PROFILE_CODE")
    private String profileCode;

}
