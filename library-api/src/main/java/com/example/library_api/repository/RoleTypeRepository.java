package com.example.library_api.repository;

import com.example.library_api.entity.RoleTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleTypeRepository extends JpaRepository<RoleTypeEntity, Long> {
    Optional<RoleTypeEntity> findByRoleCode(String roleCode);
}
