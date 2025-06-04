package com.example.library_api.repository;

import com.example.library_api.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<NotificationEntity , Long>{
//    List<NotificationEntity> findByNotiName(String notiName);

    List<NotificationEntity> findAllByNotiNameAndIsDeleteOrderBySendDateDesc(
            String notiName,
            Integer isDelete
    );

    List<NotificationEntity> findAllByProfileCodeAndNotiNameAndIsDeleteOrderBySendDateDesc(
            String profileCode,
            String notiName,
            Integer isDelete
    );

    NotificationEntity findByBookCodeAndProfileCode(String bookCode, String profileCode);


}
