# Báo cáo doanh thu phí thành viên và phí phạt

## Tổng quan

Chức năng báo cáo doanh thu được phát triển theo biểu mẫu chuẩn BM10 và BM11, cho phép kế toán tạo báo cáo doanh thu phí thành viên và phí phạt một cách chính xác và đầy đủ.

## Các loại báo cáo

### 1. Báo cáo doanh thu phí thành viên (BM10)
- **Mục đích**: Theo dõi doanh thu từ phí thành viên
- **Cột dữ liệu**:
  - Ngày báo cáo
  - Loại thẻ
  - Thành tiền (VNĐ)

### 2. Báo cáo doanh thu phí phạt (BM11)
- **Mục đích**: Theo dõi doanh thu từ phí phạt
- **Cột dữ liệu**:
  - Ngày báo cáo
  - Nguồn thu
  - Số lượng
  - Thành tiền (VNĐ)

### 3. Báo cáo tổng hợp
- **Mục đích**: Kết hợp cả hai loại báo cáo trên
- **Bao gồm**: BM10 + BM11 + Tổng kết

## Cách sử dụng

### Backend API

#### 1. Lấy báo cáo tổng hợp
```http
GET /api/BaoCao/doanh-thu?tuNgay=2024-01-01&denNgay=2024-01-31
```

#### 2. Lấy báo cáo phí thành viên (BM10)
```http
GET /api/BaoCao/phi-thanh-vien?tuNgay=2024-01-01&denNgay=2024-01-31
```

#### 3. Lấy báo cáo phí phạt (BM11)
```http
GET /api/BaoCao/phi-phat?tuNgay=2024-01-01&denNgay=2024-01-31
```

#### 4. Lấy báo cáo tùy chỉnh
```http
POST /api/BaoCao/tuy-chinh
Content-Type: application/json

{
  "tuNgay": "2024-01-01",
  "denNgay": "2024-01-31",
  "loaiBaoCao": "phithanhvien" // hoặc "phiphat" hoặc "tonghop"
}
```

### Frontend

1. **Truy cập trang**: Vào trang "Báo cáo tài chính" trong menu kế toán
2. **Chọn thời gian**: Nhập từ ngày và đến ngày
3. **Chọn loại báo cáo**: 
   - Tổng hợp
   - Phí thành viên (BM10)
   - Phí phạt (BM11)
4. **Tạo báo cáo**: Nhấn nút "Tạo báo cáo"
5. **Xuất báo cáo**: 
   - In báo cáo: Nhấn nút "In báo cáo"
   - Xuất Excel: Nhấn nút "Xuất Excel"

## Cấu trúc dữ liệu

### Response cho báo cáo phí thành viên
```json
{
  "TieuDe": "DANH SÁCH BÁO CÁO DOANH THU PHÍ THÀNH VIÊN",
  "MaBaoCao": "BM10",
  "TuNgay": "01/01/2024",
  "DenNgay": "31/01/2024",
  "DanhSach": [
    {
      "NgayBaoCao": "2024-01-15T00:00:00",
      "LoaiThe": "Thẻ thường",
      "ThanhTien": 50000
    }
  ],
  "TongDoanhThu": 50000,
  "TongDoanhThuFormatted": "50,000 VNĐ"
}
```

### Response cho báo cáo phí phạt
```json
{
  "TieuDe": "DANH SÁCH BÁO CÁO DOANH THU PHÍ PHẠT",
  "MaBaoCao": "BM11",
  "TuNgay": "01/01/2024",
  "DenNgay": "31/01/2024",
  "DanhSach": [
    {
      "NgayBaoCao": "2024-01-15T00:00:00",
      "NguonThu": "Trả sách trễ",
      "SoLuong": 2,
      "ThanhTien": 20000
    }
  ],
  "TongDoanhThu": 20000,
  "TongDoanhThuFormatted": "20,000 VNĐ"
}
```

## Cài đặt và chạy

### Backend (.NET Core)
1. Đảm bảo đã cài đặt .NET Core 6.0+
2. Chạy migration để cập nhật database:
   ```bash
   dotnet ef database update
   ```
3. Chạy ứng dụng:
   ```bash
   dotnet run
   ```

### Frontend (React)
1. Cài đặt dependencies:
   ```bash
   npm install
   ```
2. Chạy ứng dụng:
   ```bash
   npm start
   ```

## Lưu ý quan trọng

1. **Kết nối database**: Đảm bảo connection string trong `appsettings.json` đã được cấu hình đúng
2. **Quyền truy cập**: Chỉ kế toán mới có quyền truy cập chức năng này
3. **Dữ liệu**: Báo cáo dựa trên dữ liệu thực từ bảng `PhieuThu` và `PhieuPhat`
4. **Định dạng ngày**: Sử dụng định dạng YYYY-MM-DD cho API
5. **In báo cáo**: Sử dụng chức năng in của trình duyệt (Ctrl+P)

## Troubleshooting

### Lỗi thường gặp

1. **"Có lỗi xảy ra khi kết nối server"**
   - Kiểm tra backend có đang chạy không
   - Kiểm tra URL API trong frontend

2. **"Vui lòng chọn từ ngày và đến ngày"**
   - Đảm bảo đã nhập đầy đủ từ ngày và đến ngày

3. **Báo cáo trống**
   - Kiểm tra có dữ liệu trong khoảng thời gian đã chọn không
   - Kiểm tra dữ liệu trong database

### Liên hệ hỗ trợ

Nếu gặp vấn đề, vui lòng liên hệ team phát triển để được hỗ trợ. 