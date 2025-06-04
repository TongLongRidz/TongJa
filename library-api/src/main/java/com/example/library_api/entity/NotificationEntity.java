package com.example.library_api.entity;


import jakarta.persistence.*;
import jdk.jfr.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "LOG_NOTI")
public class NotificationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "LOG_NOTI_SEQ")
    @SequenceGenerator(name = "LOG_NOTI_SEQ", sequenceName = "LOG_NOTI_SEQ", allocationSize = 1)

    @Column(name = "NOTI_LOG_ID")
    private Long notiLogId;

    @Column(name = "NOTI_CODE")
    private String notiCode;

    @Column(name = "PROFILE_CODE")
    private String profileCode;

    @Timestamp
    @Column(name = "SEND_DATE")
    private Date sendDate;

    @Timestamp
    @Column(name = "OPEN_DATE")
    private LocalDateTime openDate;

    @Column(name = "NOTI_NAME")
    private String notiName;

    @Column(name = "NOTI_MSG_TH")
    private String notiMsgTh;

    @Column(name = "NOTI_MSG_EN")
    private String notiMsgEn;

    @Column(name = "IS_READ")
    private Integer isRead;

    @Column(name = "IS_DELETE")
    private Integer isDelete;

    @Column(name = "BOOK_CODE")
    private String bookCode;

}
