package com.example.library_api.repository;

import com.example.library_api.entity.MsUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MsUserRepository extends JpaRepository<MsUserEntity, Long> {

//    MsUserEntity fin(String email);

   MsUserEntity findByEmail(String email);


}
