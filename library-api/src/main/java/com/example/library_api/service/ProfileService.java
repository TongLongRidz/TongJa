package com.example.library_api.service;

import com.example.library_api.dto.ProfileByAdminDTO;
import com.example.library_api.dto.ProfileDTO;
import com.example.library_api.entity.*;
import com.example.library_api.repository.ProfileRepository;
import com.example.library_api.repository.RoleTypeRepository;
import com.example.library_api.repository.RoleUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.RejectedExecutionException;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service

public class ProfileService {

    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleUserRepository roleUserRepository;
    private final RoleTypeRepository roleTypeRepository;


    public Optional<ProfileDTO> getProfileById(Long profileId) {
        return profileRepository.findByIdProfile(profileId);
    }

    public void registerUser(ProfileEntity profileDTO) {
        Optional<ProfileEntity> existingProfile = profileRepository.findByProfileCode(profileDTO.getProfileCode());
        if (existingProfile.isPresent()) {
            throw new RuntimeException("User with this profile code already exists.");
        }

        Integer maxProfileID = profileRepository.findMaxBorrowingCodes();
        if (maxProfileID == null) {
            maxProfileID = 0;
        }
        String genProfileCode = "PR" + String.format("%03d", maxProfileID + 1);

        String encodedPassword;
        try {
            encodedPassword = passwordEncoder.encode(profileDTO.getPassword());
        } catch (Exception e) {
            throw new RuntimeException("Error while encoding password", e);
        }

        ProfileEntity msUserEntity = new ProfileEntity();
        msUserEntity.setPassword(encodedPassword);
        msUserEntity.setProfileCode(genProfileCode);
        msUserEntity.setFirstName(profileDTO.getFirstName());
        msUserEntity.setLastName(profileDTO.getLastName());
        msUserEntity.setEmail(profileDTO.getEmail());
        msUserEntity.setTelephone(profileDTO.getTelephone());
        msUserEntity.setImage(profileDTO.getImage());
        msUserEntity.setIsDelete(0);

        msUserEntity.setCreateAt(LocalDateTime.now());
        msUserEntity.setUpdateAt(null);
        if(profileDTO.getUsername() != null){
            msUserEntity.setUsername(profileDTO.getUsername());
        }

        profileRepository.save(msUserEntity);

        RoleUserEntity roleUserEntity = new RoleUserEntity();

        roleUserEntity.setRoleCode("R002");
        roleUserEntity.setProfileCode(genProfileCode);

        roleUserRepository.save(roleUserEntity);


    }

    public boolean emailExists(String email) {
        return profileRepository.existsByEmail(email);
    }

    public ProfileDTO getProfileByIdWithLogin(Long id) {
        Optional<ProfileEntity> profileOptional = profileRepository.findById(id);
        if (profileOptional.isPresent()) {
            ProfileEntity profileEntity = profileOptional.get();
            RoleUserEntity getRoleUser = getRoleUser(profileEntity.getProfileCode());
            RoleTypeEntity getRoleType = getRoleType(getRoleUser.getRoleCode());


            if (getRoleUser != null) {
                return profileOptional.map(profile -> new ProfileDTO(
                        profile.getId(),
                        profile.getFirstName(),
                        profile.getLastName(),
                        profile.getEmail(),
                        profile.getTelephone(),
                        profile.getImage(),
                        profile.getProfileCode(),
                        profile.getCreateAt(),
                        profile.getUpdateAt(),
                        getRoleUser.getRoleCode(),
                        getRoleType.getRoleName()
                )).orElse(null);
            }
        }
        return null;
    }

    public RoleUserEntity getRoleUser(String userCode) {
        List<RoleUserEntity> roleEntities = roleUserRepository.findAllByProfileCode(userCode);
        if (roleEntities.isEmpty()) {
            return null;
        }
        return roleEntities.get(0); // This will just return the first match
    }


    public RoleTypeEntity getRoleType(String roleCode) {
        Optional<RoleTypeEntity> roleType = roleTypeRepository.findByRoleCode(roleCode);
        return roleType.orElse(null);
    }

    public static List<String> getRole() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            // ดึงรายการ role ที่ผู้ใช้มีในรูปแบบของ List<String>
            return SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());
        } else {
            return null;
        }
    }


    public String editProfileUser(ProfileEntity profile) {
        Optional<ProfileEntity> optionalProfile = profileRepository.findById(profile.getId());
        if (optionalProfile.isPresent()) {
            ProfileEntity profileEntity = optionalProfile.get();

            profileEntity.setFirstName(profile.getFirstName());
            profileEntity.setLastName(profile.getLastName());
            profileEntity.setEmail(profile.getEmail());
            profileEntity.setTelephone(profile.getTelephone());
            profileEntity.setImage(profile.getImage());

            try {
                profileRepository.save(profileEntity);
                return "ok";
            } catch (Exception e) {
                // Log the exception
                System.err.println("Error updating profile: " + e.getMessage());
                return "error";
            }
        }
        return "error";
    }


    public String adminEditProfileUser(ProfileByAdminDTO profile) {
        Optional<ProfileEntity> optionalProfile = profileRepository.findById(profile.getId());

        if (optionalProfile.isPresent()) {
            ProfileEntity profileEntity = optionalProfile.get();
            RoleUserEntity roleUserEntity = getRoleUser(profileEntity.getProfileCode());
            if(roleUserEntity != null){
                roleUserEntity.setRoleCode(profile.getRole());
                roleUserRepository.save(roleUserEntity);
            }

            profileEntity.setFirstName(profile.getFirstName());
            profileEntity.setLastName(profile.getLastName());
            profileEntity.setEmail(profile.getEmail());
            profileEntity.setTelephone(profile.getTelephone());
            profileEntity.setImage(profile.getImage());

            try {
                profileRepository.save(profileEntity);
                return "ok";
            } catch (Exception e) {
                // Log the exception
                System.err.println("Error updating profile: " + e.getMessage());
                return "error";
            }
        }
        return "error";
    }

    public String adminEditProfilePassword(ProfileByAdminDTO profile) {
        Optional<ProfileEntity> optionalProfile = profileRepository.findById(profile.getId());
        String encodedPassword;


        if (optionalProfile.isPresent()) {
            ProfileEntity profileEntity = optionalProfile.get();
            try {
                encodedPassword = passwordEncoder.encode(profile.getPassword());
            } catch (Exception e) {
                throw new RuntimeException("Error while encoding password", e);
            }
            profileEntity.setPassword(encodedPassword);

            try {
                profileRepository.save(profileEntity);
                return "ok";
            } catch (Exception e) {
                // Log the exception
                System.err.println("Error updating profile: " + e.getMessage());
                return "error";
            }
        }
        return "error";
    }

    public String adminAddProfileUser(ProfileByAdminDTO profile) {
        Optional<ProfileEntity> existingProfile = profileRepository.findByProfileCode(profile.getProfileCode());
        if (existingProfile.isPresent()) {
            throw new RuntimeException("User with this profile code already exists.");
        }

        Integer maxProfileID = profileRepository.findMaxBorrowingCodes();
        if (maxProfileID == null) {
            maxProfileID = 0;
        }
        String genProfileCode = "PR" + String.format("%03d", maxProfileID + 1);

        String encodedPassword;
        try {
            encodedPassword = passwordEncoder.encode(profile.getPassword());
        } catch (Exception e) {
            throw new RuntimeException("Error while encoding password", e);
        }

        // Create ProfileEntity
        ProfileEntity msUserEntity = new ProfileEntity();
        msUserEntity.setPassword(encodedPassword);
        msUserEntity.setProfileCode(genProfileCode);
        msUserEntity.setFirstName(profile.getFirstName());
        msUserEntity.setLastName(profile.getLastName());
        msUserEntity.setEmail(profile.getEmail());
        msUserEntity.setTelephone(profile.getTelephone());
        msUserEntity.setImage(profile.getImage());
        msUserEntity.setCreateAt(LocalDateTime.now());
        msUserEntity.setIsDelete(0);

        try {
            profileRepository.save(msUserEntity);

            RoleUserEntity roleUserEntity = new RoleUserEntity();
            roleUserEntity.setRoleCode(profile.getRole());
            roleUserEntity.setProfileCode(genProfileCode);

            roleUserRepository.save(roleUserEntity);
            return "ok";
        } catch (DataIntegrityViolationException e) {
            return "error: Data integrity violation";
        } catch (Exception e) {
            return "error: " + e.getMessage();
        }
    }


    public String deleteProfileId(Long id) {
        Optional<ProfileEntity> deleteProfile = profileRepository.findById(id);
        if (deleteProfile.isPresent()) {
            ProfileEntity profileEntity = deleteProfile.get();
            profileEntity.setIsDelete(1);
            try {
                profileRepository.save(profileEntity);
                return "success";
            } catch (Exception e) {
                return "error";
            }
        } else {
            return "not_found";
        }
    }


    public String adminCheckEmail(ProfileByAdminDTO profile) {
        Optional<ProfileEntity> optionalProfile = profileRepository.findById(profile.getId());
        boolean emailStatus = profileRepository.existsByEmail(profile.getEmail());

        if (profile.getEmail().equals(optionalProfile.get().getEmail())) {
            return "ok";
        }
        if(emailStatus){
            return "error";
        }
        return "ok";
    }




// ------------------------------------------------------------------------------------------------------

    private final Comparator<ProfileDTO> customComparator = (b1, b2) -> {
        String name1 = b1.getFirstName();
        String name2 = b2.getLastName();
        String normalizedName1 = name1.toUpperCase() + name1.toLowerCase();
        String normalizedName2 = name2.toUpperCase() + name2.toLowerCase();
        return normalizedName1.compareTo(normalizedName2);
    };


    public Page<ProfileDTO> getAllProfileServeice(Pageable pageable, Boolean his, String name_sort, String role) {
        int isDeleteValue = his ? 1 : 0;
        List<ProfileDTO> allBooks = profileRepository.findAllByIsDelete(isDeleteValue, role, pageable.getSort());
        if(!Objects.equals(name_sort, "dis") && Objects.equals(name_sort, "min") || Objects.equals(name_sort, "max")){
            if (Objects.equals(name_sort, "min")) {
                allBooks = allBooks.stream().sorted(customComparator).collect(Collectors.toList());
            } else if (Objects.equals(name_sort, "max")) {
                allBooks = allBooks.stream().sorted(customComparator.reversed()).collect(Collectors.toList());
            }
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), allBooks.size());
            List<ProfileDTO> paginatedBooks = allBooks.subList(start, end);
            return new PageImpl<>(paginatedBooks, pageable, allBooks.size());
        }
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), allBooks.size());
        List<ProfileDTO> pagedBooks = allBooks.subList(start, end);
        // pagedBooks.image resize height 60px width auto
        return new PageImpl<>(pagedBooks, pageable, allBooks.size());
    }


    public Page<ProfileDTO> getSearchProfile(String searchKey, Pageable pageable, Boolean his, String name_sort, String Role) {
        int isDeleteValue = his ? 1 : 0;
        List<ProfileDTO> allBooks = profileRepository.searchByProfileOrNameTh(searchKey, isDeleteValue, Role, pageable.getSort());
        if(!Objects.equals(name_sort, "dis") && Objects.equals(name_sort, "min") || Objects.equals(name_sort, "max")){
            if (Objects.equals(name_sort, "min")) {
                allBooks = allBooks.stream().sorted(customComparator).collect(Collectors.toList());
            } else if (Objects.equals(name_sort, "max")) {
                allBooks = allBooks.stream().sorted(customComparator.reversed()).collect(Collectors.toList());
            }
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), allBooks.size());
            List<ProfileDTO> paginatedBooks = allBooks.subList(start, end);
            return new PageImpl<>(paginatedBooks, pageable, allBooks.size());
        }
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), allBooks.size());
        List<ProfileDTO> pagedBooks = allBooks.subList(start, end);

        return new PageImpl<>(pagedBooks, pageable, allBooks.size());
    }


        public String getFirstName(String profileCode){
        Optional<ProfileEntity> profileEntity = profileRepository.findByProfileCode(profileCode);
        return  profileEntity.map(ProfileEntity::getFirstName)
                .orElseThrow(() ->  new RejectedExecutionException("Profile not found"));
        }

    public ProfileEntity userLdapIsDeleteOrNot(ProfileEntity profileEntity) {
        if (profileEntity != null && profileEntity.getIsDelete() == 1) {
            profileEntity.setIsDelete(0);
            profileRepository.save(profileEntity);
            System.out.println("Profile restored successfully.");
        }
        return profileEntity;
    }



}

