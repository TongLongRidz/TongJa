package com.example.library_api.service;


import com.example.library_api.entity.BookEntity;
import com.example.library_api.entity.BorrowingEntity;
import com.example.library_api.entity.NotificationEntity;
import com.example.library_api.entity.RoleUserEntity;
import com.example.library_api.repository.BorrowingRepository;
import com.example.library_api.repository.NotificationRepository;
import com.example.library_api.repository.RoleUserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;

    private final ProfileService profileService;

    private final RoleUserRepository roleUserRepository;

    private final BorrowingRepository borrowingRepository;

//    private final Aut

    public void deleteNotiByIds(List<Long> ids) {
        for (Long id : ids) {
            NotificationEntity notification = notificationRepository.findById(id).orElse(null);
            if (notification != null) {
                notification.setIsDelete(1); // เปลี่ยน isDelete เป็น 1
                notificationRepository.save(notification); // บันทึกการเปลี่ยนแปลง
            }
        }
    }

    public void saveNoti(String notiCode, String profileCode, String bookCode, String notiMsgTH, String notiMsgEN, String notiName) {
        NotificationEntity notification = new NotificationEntity();

        notification.setNotiCode(notiCode);
        notification.setProfileCode(profileCode);
        notification.setBookCode(bookCode);
        notification.setNotiName(notiName);
        notification.setNotiMsgTh(notiMsgTH);
        notification.setNotiMsgEn(notiMsgEN);
        notification.setSendDate(new Date());
        notification.setOpenDate(null);
        notification.setIsRead(0);
        notification.setIsDelete(0);

        notificationRepository.save(notification);
    }

    public List<String> getRoleCodesByProfileCode(String profileCode) {
        List<RoleUserEntity> roleUserEntities = roleUserRepository.findAllByProfileCode(profileCode);

        return roleUserEntities.stream()
                .map(RoleUserEntity::getRoleCode)
                .collect(Collectors.toList());
    }


    public List<NotificationEntity> notiByRolCode(String profileCode) {
        List<String> roleCodes = getRoleCodesByProfileCode(profileCode);

        if (roleCodes.contains("R001") || roleCodes.contains("R003")) {
            return notificationRepository.findAllByNotiNameAndIsDeleteOrderBySendDateDesc("ADMIN", 0);
        } else if (roleCodes.contains("R002")) {
            return notificationRepository.findAllByProfileCodeAndNotiNameAndIsDeleteOrderBySendDateDesc(profileCode, "USER", 0);
        }

        return new ArrayList<>();
    }


    public void SelectStatusSaves(String profileCode, String active, String genNotiCode, String bookCode) {
        List<String> roleCodes = getRoleCodesByProfileCode(profileCode);
        String firstNmae = profileService.getFirstName(profileCode);

        String adminMsgTH = "";
        String userMsgTH = "";
        String adminMsgEN = "";
        String userMsgEN = "";
        String atctiveMsgTH = returnNotiActive(active)[0];
        String atctiveMsgEN = returnNotiActive(active)[1];

        if(roleCodes.contains("R001") || roleCodes.contains("R003")){
            adminMsgTH = "คุณได้ " + atctiveMsgTH + " รหัส " + bookCode + "ของคุณ " + firstNmae + " สำเร็จแล้ว";
            userMsgTH = "คุณได้ " + atctiveMsgTH + " รหัส " + bookCode + " สำเร็จแล้ว";

            adminMsgEN = "You have " + atctiveMsgEN + " the book with code " + bookCode + " for " + firstNmae;
            userMsgEN = "You have " + atctiveMsgEN + " the book with code " + bookCode;
        } else if (roleCodes.contains("R002")) {
            adminMsgTH = "ผู้ใช้ " + firstNmae + " " + atctiveMsgTH + " รหัส " + bookCode + " สำเร็จแล้ว";
            userMsgTH = "คุณได้ " + atctiveMsgTH + " รหัส " + bookCode + " สำเร็จแล้ว";

            adminMsgEN = "User " + firstNmae + " has " + atctiveMsgEN + " the book with code " + bookCode;
            userMsgEN = "You have " + atctiveMsgEN + " the book with code " + bookCode;
        }


        saveNoti(genNotiCode, profileCode, bookCode, adminMsgTH, adminMsgEN, "ADMIN");
        saveNoti(genNotiCode, profileCode, bookCode, userMsgTH, userMsgEN, "USER");
    }

    public String[] returnNotiActive(String active) {
        switch (active) {
            case "return":
                return new String[]{"คืนหนังสือ", "return book"};
            case "borrow":
                return new String[]{"ยืมหนังสือ", "borrow book"};
            case "slip":
                return new String[]{"เลื่อนการคืนหนังสือ", "postpone book return"};
        }
        return null;
    }


    public void isRead(Long id) {
        Optional<NotificationEntity> optionalNotification = notificationRepository.findById(id);
        if (optionalNotification.isPresent()) {
            NotificationEntity notification = optionalNotification.get();
            notification.setIsRead(1);
            notification.setOpenDate(LocalDateTime.now());
            notificationRepository.save(notification);
        }
    }

    public List<NotificationEntity> isReadAll(String profileCode) {
        List<String> roleCodes = getRoleCodesByProfileCode(profileCode);
        List<NotificationEntity> notificationEntities = new ArrayList<>();

        if (roleCodes.contains("R001") || roleCodes.contains("R003")) {
            notificationEntities = notificationRepository.findAllByNotiNameAndIsDeleteOrderBySendDateDesc("ADMIN", 0);
        } else if (roleCodes.contains("R002")) {
            notificationEntities = notificationRepository.findAllByProfileCodeAndNotiNameAndIsDeleteOrderBySendDateDesc(profileCode, "USER", 0);
        }

        for (NotificationEntity notification : notificationEntities) {
            notification.setIsRead(1);
        }

        notificationRepository.saveAll(notificationEntities);

        return notificationEntities;
    }


    public void isDeleteAll(String profileCode) {
        List<String> roleCodes = getRoleCodesByProfileCode(profileCode);
        List<NotificationEntity> notificationEntities = new ArrayList<>();

        if (roleCodes.contains("R001") || roleCodes.contains("R003")) {
            notificationEntities = notificationRepository.findAllByNotiNameAndIsDeleteOrderBySendDateDesc("ADMIN", 0);
        } else if (roleCodes.contains("R002")) {
            notificationEntities = notificationRepository.findAllByProfileCodeAndNotiNameAndIsDeleteOrderBySendDateDesc(profileCode, "USER", 0);
        }

        for (NotificationEntity notification : notificationEntities) {
            notification.setIsDelete(1);
        }
        notificationRepository.saveAll(notificationEntities);

    }

//    @Scheduled(fixedRate = 5000)
    @Scheduled(cron = "0 0 0 * * ?") // ทุกวันตอนเที่ยงคืน
    public void NotiReturn() {
        Integer maxNotiID = borrowingRepository.findMaxNotiCodes();
        if (maxNotiID == null) {
            maxNotiID = 0;
        }
        String genNotiCode = "NT" + String.format("%06d", maxNotiID + 1);
        LocalDate today = LocalDate.now();
        List<BorrowingEntity> Books = borrowingRepository.findAllByIsDeleteAndBorrowStatus(0 ,1);
            for (BorrowingEntity borrow : Books) {
                LocalDate borrowEnd = borrow.getBorrowEnd();
                String profileCode = borrow.getProfileCode();
                String bookCode = borrow.getBookCode();
                String notiMsgTH = "";
                String notiMsgEN = "";

                long daysOver = ChronoUnit.DAYS.between(borrowEnd, today);
                if (borrowEnd.isEqual(today)) {
                    notiMsgTH = "ถึงกำหนดคืนหนังสือรหัส " + bookCode + "กรุณาคืนหนังสือภายในวันนี้";
                    notiMsgEN = "The book with code " + bookCode + " Please return the book by today.";
                } else if (borrowEnd.isBefore(today)) {
                    if (daysOver == 1) {
                        notiMsgTH = "เกินกำหนดคืนหนังสือ รหัส" + bookCode + " 1 วันแล้ว กรุณาคืนหนังสือ";
                        notiMsgEN = "The book with code " + bookCode + " is overdue by 1 day. Please return the book.";
                    } else {
                        notiMsgTH = "เกินกำหนดคืนหนังสือรหัส " + bookCode + " " + daysOver + " วันแล้ว กรุณาคืนหนังสือ";
                        notiMsgEN = "The book with code " + bookCode + " is overdue by " + daysOver + " days. Please return the book.";
                    }
                }
                NotificationEntity notification = new NotificationEntity();
                notification.setNotiCode(genNotiCode);
                notification.setProfileCode(profileCode);
                notification.setBookCode(bookCode);
                notification.setNotiMsgTh(notiMsgTH);
                notification.setNotiMsgEn(notiMsgEN);
                notification.setNotiName("USER");
                notification.setSendDate(new Date());
                notification.setIsRead(0);
                notification.setIsDelete(0);
                notificationRepository.save(notification);
        }
    }








//end
}