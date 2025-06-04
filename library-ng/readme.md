# TakeLibro-NG

โครงการนี้ถูกสร้างขึ้นด้วย [Angular CLI](https://github.com/angular/angular-cli) เวอร์ชัน 18.2.12

## ข้อกำหนดเบื้องต้น

- **Node.js**: เวอร์ชัน 18.20.4
- **Angular CLI**: เวอร์ชัน 18.2.12

## การติดตั้ง

##### 1. โคลนที่เก็บโค้ด:

```bash
git clone https://git.takeitsolution.com/innotech/takeit/library/library-ng.git
```

##### 2. เข้าไปที่ไดเรกทอรีของโปรเจกต์:

```bash
cd library-ng
```

##### 3. ติดตั้ง dependencies:

```bash
npm install (หากล้มเหลว ลองใช้ --force)
```

## การใช้งาน

เพื่อเริ่มเซิร์ฟเวอร์พัฒนาในเครื่อง ให้รันคำสั่ง:

```bash
ng serve
```

แอปพลิเคชันจะพร้อมใช้งานที่ http://localhost:4200

## ใน shared.module.ts

วิธีอัปเดต SharedModule

```bash
1. **เพิ่ม CommonModule ใน imports และ exports**
2. **เพิ่มไลบรารีที่ต้องการในทั้ง imports และ exports**
```

### ตัวอย่าง:

```typescript
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SomeLibraryModule } from "some-library"; // ตัวอย่างไลบรารี

@NgModule({
  declarations: [
    // เพิ่ม component, directive หรือ pipe ที่ใช้ร่วมกันที่นี่
  ],
  imports: [
    CommonModule, // นำเข้า CommonModule สำหรับ directive ของ Angular
    SomeLibraryModule, // นำเข้าไลบรารีที่ต้องการ
  ],
  exports: [
    CommonModule, // ส่งออก CommonModule เพื่อใช้ในโมดูลอื่น ๆ
    SomeLibraryModule, // ส่งออกไลบรารีที่ต้องการ
  ],
})
export class SharedModule {}
```

## การสร้างโค้ด

รันคำสั่งต่อไปนี้เพื่อสร้างองค์ประกอบต่าง ๆ ของ Angular:

### สร้าง Component

```bash
ng generate component ชื่อ-component
```

### สร้าง Guard

เพื่อสร้าง guard ใหม่:

```bash
ng generate guard ชื่อ-guard
```

ตัวอย่าง หากต้องการสร้าง guard ชื่อ `auth` ให้รัน:

```bash
ng generate guard auth
```

ระบบจะสร้างไฟล์ที่จำเป็นสำหรับ guard ในตำแหน่งที่ระบุ

### สร้าง Service

เพื่อสร้าง service ใหม่:

```bash
ng generate service ชื่อ-service
```

ตัวอย่าง หากต้องการสร้าง service ชื่อ `user`:

```bash
ng generate service user
```

ระบบจะสร้างไฟล์ `user.service.ts` และ `user.service.spec.ts`

## การสร้างโค้ด

รัน `ng generate component ชื่อ-component` เพื่อสร้าง component ใหม่ นอกจากนี้ยังสามารถใช้ `ng generate directive|pipe|service|class|guard|interface|enum|module`

## การสร้างโปรเจกต์

รัน `ng build` เพื่อคอมไพล์โปรเจกต์ ไฟล์ที่สร้างขึ้นจะถูกเก็บไว้ในไดเรกทอรี `dist/`

```bash
npm run build:office

ในที่อยู่ของไฟล์ build => library-ng/dist/library/browser ให้เปลี่ยนเป็น library-ng/dist/library/TakeLibro
```

หาก build แล้วไม่อ่านข้อมูลไฟล์ต่างๆ ให้เช็ค angular.json

```bash
"architect": {
    "build": {
        "options": {
            "assets": [{
                "glob": "**/*",
                "input": "public",
                "output": "takeLibro" หรือ "output": "."
            }]
        }
    }
}
```
