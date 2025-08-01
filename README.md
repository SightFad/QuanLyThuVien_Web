# Hệ Thống Quản Lý Thư Viện

## 🚀 Tính Năng Chính

- **Quản lý sách**: Thêm, sửa, xóa, tìm kiếm sách
- **Quản lý độc giả**: Đăng ký, quản lý thông tin độc giả
- **Quản lý mượn trả**: Xử lý phiếu mượn, trả sách
- **Quản lý phạt**: Tính toán và xử lý tiền phạt
- **Báo cáo**: Báo cáo thống kê, báo cáo tài chính
- **Phân quyền**: Hệ thống phân quyền theo vai trò

## 👥 Vai Trò Người Dùng

### 1. **Quản trị viên** (admin/admin123)
- Quản lý toàn bộ hệ thống
- Quản lý người dùng và phân quyền
- Cấu hình hệ thống

### 2. **Thủ thư** (librarian/librarian123)
- Quản lý sách và độc giả
- Xử lý mượn trả sách
- Quản lý phạt và vi phạm

### 3. **Độc giả** (reader/reader123)
- Tìm kiếm và đặt trước sách
- Xem lịch sử mượn
- Quản lý thông tin cá nhân

### 4. **Kế toán** (accountant/accountant123)
- Quản lý tài chính
- Xử lý thanh toán phạt
- Báo cáo tài chính

### 5. **Nhân viên kho sách** (warehouse/warehouse123)
- Quản lý kho sách
- Nhập xuất sách
- Kiểm kê tồn kho

## 🛠️ Cài Đặt và Chạy

### Backend (ASP.NET Core)

```bash
cd LibraryBackEnd/LibraryApi
dotnet restore
dotnet run
```

Backend sẽ chạy tại: `http://localhost:5280`

### Frontend (React)

```bash
npm install
npm start
```

Frontend sẽ chạy tại: `http://localhost:3000`

## 🔧 Cấu Hình

### Backend Configuration
- Database: SQL Server (có thể chuyển sang In-Memory cho testing)
- JWT Authentication
- CORS enabled

### Frontend Configuration
- React 18
- React Router v6
- Axios cho API calls
- Fallback data khi backend offline

## 📱 Giao Diện

- **Responsive Design**: Tương thích với mọi thiết bị
- **Modern UI**: Giao diện hiện đại, dễ sử dụng
- **Dark/Light Mode**: Hỗ trợ chế độ tối/sáng
- **Real-time Status**: Hiển thị trạng thái kết nối backend

## 🔐 Bảo Mật

- JWT Token Authentication
- Role-based Access Control
- Secure API endpoints
- Input validation

## 📊 Báo Cáo

- Báo cáo mượn trả
- Báo cáo tài chính
- Thống kê sách
- Báo cáo vi phạm

## 🚨 Xử Lý Lỗi

### Backend Offline
- Frontend tự động chuyển sang chế độ offline
- Sử dụng dữ liệu mẫu để demo
- Hiển thị thông báo trạng thái

### Lỗi Kết Nối
- Retry mechanism
- Fallback data
- User-friendly error messages

## 📝 Ghi Chú

- Hệ thống hỗ trợ cả online và offline mode
- Dữ liệu mẫu được cung cấp cho testing
- Có thể chạy frontend mà không cần backend
- Backend status được hiển thị real-time

## 🆘 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra backend có đang chạy không
2. Kiểm tra console browser để xem lỗi
3. Đảm bảo port 5280 không bị chiếm
4. Thử refresh trang web 