package com.example.library_api.repository;

import com.example.library_api.entity.RoleUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoleUserRepository extends JpaRepository<RoleUserEntity, Long> {
    List<RoleUserEntity> findAllByProfileCode(String profileCode);
    Optional<RoleUserEntity> findByProfileCode(String profileCode);
}
