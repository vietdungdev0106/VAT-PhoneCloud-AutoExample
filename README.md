![Demo](./intro/reg-fb.gif)

---

# Hướng dẫn sử dụng PhoneCloud Register Facebook

## **1. Đăng ký & Cài đặt PhoneCloud**

### **Bước 1. Đăng ký tài khoản VAT-PhoneCloud**
- Truy cập: [https://phonecloud.one/](https://phonecloud.one/)

### **Bước 2. Cài đặt tool PhoneCloud trên điện thoại**
- **Yêu cầu:** Điện thoại Android 9 trở lên.
- **Các bước:**
    1. Đăng nhập thành công trên website.
    2. Vào **Account Details**, nhấn **CLICK HERE** để tải tool.
    3. Cài đặt file APK đã tải (ví dụ: `fd15376e-8e25-40f8-a41c-2b53c91fb2da.apk`) vào điện thoại qua **ADB**.
    4. Sau khi cài xong, mở ứng dụng lên. Khi popup xin cấp quyền hiện ra, chạy lệnh:
        ```bash
        adb shell sh /storage/emulated/0/Android/data/com.vat.phonecloud/files/start.sh
        ```
    5. Sau khi cấp quyền thành công, ứng dụng sẽ tự động mở lại.
    6. Quay lại **Account Details** trên website, copy **Farmer token** và dán vào tool trên điện thoại, sau đó nhấn **Start**.
    7. Trên web, vào [Menu → Devices](https://phonecloud.one/devices), tìm thiết bị bạn đã cài tool.
        - Nếu **Status** là `PENDING`, nhấn **Accept** để xác nhận thiết bị.
    8. Trên điện thoại, nhấn **Start** lại lần nữa để hoàn tất kết nối.

---

## **2. Tải, cài đặt & mod Facebook**

### **Bước 1. Tải ứng dụng Facebook**
- Truy cập: [apkpure.com/vn/facebook/com.facebook.katana](https://apkpure.com/vn/facebook/com.facebook.katana) để tải file APK.

### **Bước 2. Mod ứng dụng Facebook**
- Vào [Menu → Applications](https://phonecloud.one/applications) trên phonecloud.one.
- Nhấn **Add** và upload file `Facebook.apk` vừa tải ở Bước 1.
- Chờ quá trình mod hoàn tất (1-5 phút tuỳ dung lượng file).

### **Bước 3. Lấy API Key**
- Sau khi mod xong, copy **Api key** của app để dùng ở bước sau.

---

## **3. Clone Repo & Chạy Tool**

### **Bước 1. Clone source code**
- Dùng `git`:
    ```bash
    git clone <repo-url>
    ```
    Hoặc tải file `.zip` rồi giải nén.

### **Bước 2. Mở tool**
- Mở file `main.html` bằng **Chrome** (hoặc trình duyệt bất kỳ).

### **Bước 3. Kết nối API Key**
- Truy cập [Menu → Document Api](https://phonecloud.one/document-api) để copy **API Key** của bạn.
- Dán **API Key** vào tool.
- Dán **App Mod API Key** (API Key lấy ở Bước 2.3) vào tool.

### **Bước 4. Kết nối thiết bị**
- Nhấn **Connect** để hiển thị danh sách các thiết bị đã kết nối.
- Bắt đầu sử dụng.

---

## **Liên hệ & Hỗ trợ**
- Nếu gặp vấn đề trong quá trình cài đặt hoặc sử dụng, vui lòng liên hệ đội ngũ hỗ trợ tại [https://phonecloud.one/](https://phonecloud.one/).

---
