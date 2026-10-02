# บันทึกหนังที่ดู

เว็บแอปสำหรับบันทึกรายการหนังที่ดูแล้ว สามารถเพิ่ม แก้ไข ลบ ค้นหา และดูคะแนนเฉลี่ยของหนังได้ ข้อมูลถูกเก็บไว้ในไฟล์ `data/movies.json` โดยใช้ Express เป็นเซิร์ฟเวอร์และให้บริการ API สำหรับหน้าเว็บ

## ความต้องการของระบบ

- Node.js
- npm

## การติดตั้ง

โคลนโปรเจกต์และเข้าไปยังโฟลเดอร์โปรเจกต์:

```bash
git clone <URL ของ repository>
cd miniproject
```

ติดตั้ง dependencies:

```bash
npm install
```

## การรันแอป

รันเซิร์ฟเวอร์สำหรับใช้งาน:

```bash
npm start
```

หรือรันด้วยคำสั่งสำหรับพัฒนา:

```bash
npm run dev
```

จากนั้นเปิดเว็บเบราว์เซอร์ที่:

```text
http://localhost:3000
```

เซิร์ฟเวอร์จะสร้าง `data/movies.json` ที่มีค่าเริ่มต้นเป็น `[]` ให้อัตโนมัติ หากยังไม่มีไฟล์นี้

## ความสามารถของแอป

- แสดงรายการหนังที่บันทึกไว้
- เพิ่มชื่อหนัง ปีที่ฉาย วันที่ดู คะแนน และหมายเหตุ
- แก้ไขข้อมูลหนัง
- ลบหนัง
- ค้นหาจากชื่อหนังหรือหมายเหตุ
- แสดงจำนวนหนังและคะแนนเฉลี่ย

## API

Base URL:

```text
http://localhost:3000/api
```

API ไม่ต้องใช้การยืนยันตัวตน และใช้รูปแบบข้อมูล JSON

### 1. ดูหนังทั้งหมด

```http
GET /api/movies
```

ตัวอย่างผลลัพธ์ `200 OK`:

<img width="1916" height="1016" alt="image" src="https://github.com/user-attachments/assets/81ffb463-f70b-44c5-b1a0-f1f261db67da" />


### 2. ดูหนังตาม ID

```http
GET /api/movies/:id
```

ตัวอย่าง:
<img width="1902" height="1021" alt="image" src="https://github.com/user-attachments/assets/c2a5eabe-f227-44bb-8b63-292bd3bc5c0c" />


ถ้าไม่พบหนัง จะได้ `404 Not Found`:



### 3. เพิ่มหนัง

```http
POST /api/movies
Content-Type: application/json
```

ข้อมูลที่ส่ง:

<img width="1908" height="1015" alt="image" src="https://github.com/user-attachments/assets/a72920e8-75c0-43da-9e24-6247e0299276" />


ฟิลด์ `title` จำเป็นต้องมี และ `rating` ต้องเป็นจำนวนเต็มตั้งแต่ 0 ถึง 5

ผลลัพธ์สำเร็จคือ `201 Created` พร้อมข้อมูลหนังที่ถูกสร้างและ `id` ใหม่

ข้อผิดพลาดที่อาจเกิดขึ้น:

<img width="1907" height="1025" alt="image" src="https://github.com/user-attachments/assets/8b97b69a-5de1-40bd-b578-b43648e29f3f" />


### 4. แก้ไขหนัง

```http
PATCH /api/movies/:id
Content-Type: application/json
```

สามารถส่งเฉพาะฟิลด์ที่ต้องการแก้ไขได้ เช่น:

<img width="1910" height="1013" alt="image" src="https://github.com/user-attachments/assets/c5ea3351-86f1-4c67-afc4-a48280cdd912" />


ฟิลด์ที่แก้ไขได้คือ `title`, `year`, `rating`, `watchedOn` และ `notes`

ผลลัพธ์สำเร็จคือ `200 OK` พร้อมข้อมูลหนังที่แก้ไขแล้ว

ข้อผิดพลาดที่อาจเกิดขึ้น:

- `400 Bad Request` — ชื่อหนังว่าง หรือคะแนนไม่อยู่ระหว่าง 0 ถึง 5
- `404 Not Found` — ไม่พบหนังตาม ID

### 5. ลบหนัง

```http
DELETE /api/movies/:id
```

ตัวอย่าง:

```bash
curl -X DELETE http://localhost:3000/api/movies/1
```

ผลลัพธ์สำเร็จคือ `204 No Content` และไม่มี response body

ถ้าไม่พบหนัง จะได้ `404 Not Found`


