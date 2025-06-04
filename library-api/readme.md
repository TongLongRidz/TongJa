# Docker Container TakeLibro API

ระบบ TakeLibro ที่ทำหน้าที่เป็น API หลังบ้าน

## Getting Started

คู่มือวิธีการ Run , Build ระบบ TakeLibro ด้วย Docker

## Prerequisites

- **Java JDK**: Version 17
- **Maven**: Version 4.0.0
- **Spring Boot**: Version 3.3.1


## ฐานข้อมูล oracle

```shell
Hostname: 172.17.51.151:1530
```

```shell
Port: 1530
```

```shell
SID: orcl
```

```shell
Username: training
```

```shell
Password: !Sys@dmin1
```

## ระบบทดสอบของ Office

- `IP` - xxx.xxx.xxx.xxx
- `username` - xxxx
- `password` - xxxx

## Container Parameters

คำสั่งใช้ Run Docker ด้วย Compose ให้ทำงานแบบ Detached Mode และ Build ใหม่ไปในตัว

### อย่าลืม copy .m2 มาใส่ ใน folder project

```shell
C:\Users\<YourUsername>\.m2
```


```shell
docker compose -f .\docker-compose-office.yml up -d --build
```

คำสั่งใช้ Save Image เป็น Zip

```shell
docker save -o apiTakeLibro.zip libro-api-office
```

คำสั่งใช้สำหรับ Stop Container และ Remove Container ออกจาก Server

```shell
docker compose -f .\docker-compose-office.yml down
```

คำสั่งใช้ load Zip Image เข้า Server

```shell
docker --context xxxxx load -i .\apiTakeLibro.zip
```

คำสั่งใช้ Run Docker compose ที่ Server

```shell
docker --context xxxxx compose -f .\docker-compose-office.yml up -d
```

## สร้าง context

- docker context create `[context_name]` --docker `[host]`

Ex. UAT

```shell
docker context create takeLibro --docker "host=ssh://xxxxx"
```
