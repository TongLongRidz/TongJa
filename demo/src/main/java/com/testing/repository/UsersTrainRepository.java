package com.testing.repository;

import com.testing.entity.UsersTrainEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersTrainRepository extends JpaRepository<UsersTrainEntity, Long> {

}
