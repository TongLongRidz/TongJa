package com.testing.service;

import com.testing.dto.UserDTO;
import com.testing.entity.RoleEntity;
import com.testing.entity.UsersTrainEntity;
import com.testing.repository.RoleRepository;
import com.testing.repository.UsersTrainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsersTrainService {
    private final UsersTrainRepository usersTrainRepository;
    private final RoleRepository roleRepository;

    public UsersTrainEntity createWithRole(UserDTO userDTO) {
        UsersTrainEntity user = new UsersTrainEntity();
//        user.setId(userDTO.getId());
        user.setFirstname(userDTO.getFirstname());
        user.setLastname(userDTO.getLastname());
        user.setAge(userDTO.getAge());
        user.setEmail(userDTO.getEmail());

        List<RoleEntity> roleList = roleRepository.findAllById(userDTO.getRoleIds());
        user.setRoles(roleList);

        return usersTrainRepository.save(user);
    }

//    public UsersTrainEntity createWithRole(UsersTrainEntity usersTrainEntity) {
//        UsersTrainEntity user = new UsersTrainEntity();
//        user.setFirstname(usersTrainEntity.getFirstname());
//        user.setLastname(usersTrainEntity.getLastname());
//        user.setAge(usersTrainEntity.getAge());
//
//        return usersTrainRepository.save(user);
//    }

}
