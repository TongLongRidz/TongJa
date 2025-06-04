package com.example.library_api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "PROFILE")
public class ProfileEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator ="SEQ_PROFILE")
    @SequenceGenerator(name = "SEQ_PROFILE", sequenceName = "SEQ_PROFILE",   allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @Column(name = "FIRSTNAME")
    private String firstName;

    @Column(name = "LASTNAME")
    private  String lastName;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "TELEPHONE")
    private String telephone;

    @Column(name = "IMAGE_BASE64")
    private String image;

    @Column(name = "PASSWORD")
    private String password;

    @Column(name = "CREATE_AT")
    @CreationTimestamp
    private LocalDateTime createAt;

    @Column(name = "UPDATE_AT")
    @UpdateTimestamp
    private LocalDateTime updateAt;

    @Column(name = "PROFILE_CODE")
    private String profileCode;

    @Column(name = "IS_DELETE")
    private Integer isDelete;

    @Column(name = "USERNAME")
    private String username;
}
