package com.example.library_api.repository;

import com.example.library_api.dto.ProfileDTO;
import com.example.library_api.entity.ProfileEntity;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProfileRepository extends JpaRepository<ProfileEntity, Long> {

    @Query("SELECT new com.example.library_api.dto.ProfileDTO(p.id, p.firstName, p.lastName, p.profileCode) " +
            "FROM ProfileEntity p WHERE p.id = :profileId")
    Optional<ProfileDTO> findByIdProfile(@Param("profileId") Long profileId);

    Optional<ProfileEntity> findByProfileCode(String profileCode);
    @Query("SELECT MAX(CAST(SUBSTRING(p.profileCode, 3) AS int)) FROM ProfileEntity p WHERE p.profileCode LIKE 'PR%'")
    Integer findMaxBorrowingCodes();

    boolean existsByEmail(String email);

    @Query("SELECT new com.example.library_api.dto.ProfileDTO(p.id, p.firstName, p.lastName, p.email, p.telephone, p.image, p.profileCode, p.createAt, p.updateAt, r.roleCode, r.roleName) " +
            "FROM ProfileEntity p " +
            "LEFT JOIN RoleUserEntity ru ON p.profileCode = ru.profileCode " +
            "LEFT JOIN RoleTypeEntity r ON ru.roleCode = r.roleCode " +
            "WHERE p.isDelete = :isDelete " +
            "AND (" +
            "(:role = 'R003' AND p.isDelete = 0) " + // if role is R003, fetch all with isDelete = 0
            "OR (:role = 'R001' AND (ru.roleCode = 'R001' OR ru.roleCode = 'R002')) " + // if role is R001, fetch R001 and R002
            "OR (:role = 'R002' AND 1=0) " + // if role is R002, return nothing (or null)
            ")")
    List<ProfileDTO> findAllByIsDelete(@Param("isDelete") Integer isDelete, @Param("role") String role, Sort sort);

    @Query("SELECT new com.example.library_api.dto.ProfileDTO(p.id, p.firstName, p.lastName, p.email, p.telephone, p.image, p.profileCode, p.createAt, p.updateAt, r.roleCode, r.roleName) " +
            "FROM ProfileEntity p " +
            "LEFT JOIN RoleUserEntity ru ON p.profileCode = ru.profileCode " +
            "LEFT JOIN RoleTypeEntity r ON ru.roleCode = r.roleCode " +
            "WHERE (LOWER(CONCAT(p.firstName, ' ', p.lastName)) LIKE LOWER(CONCAT('%', :searchKey, '%')) " +
            "OR LOWER(p.email) LIKE LOWER(CONCAT('%', :searchKey, '%')) " +
            "OR LOWER(p.telephone) LIKE LOWER(CONCAT('%', :searchKey, '%')) " +
            "OR LOWER(p.profileCode) LIKE LOWER(CONCAT('%', :searchKey, '%'))) " +
            "AND p.isDelete = :isDelete " +
            "AND (" +
            "(:role = 'R003' AND p.isDelete = 0) " + // if role is R003, fetch all with isDelete = 0
            "OR (:role = 'R001' AND (ru.roleCode = 'R001' OR ru.roleCode = 'R002')) " + // if role is R001, fetch R001 and R002
            "OR (:role = 'R002' AND 1=0) " + // if role is R002, return nothing (or null)
            ")")
    List<ProfileDTO> searchByProfileOrNameTh(@Param("searchKey") String searchKey, @Param("isDelete") Integer isDelete, @Param("role") String role, Sort sort);

    ProfileEntity findProfileByProfileCode(String profileCode);

    ProfileEntity findProfileByUsername(String username);
}
