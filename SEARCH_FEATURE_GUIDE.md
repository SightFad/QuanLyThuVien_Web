# Hướng dẫn sử dụng chức năng tìm kiếm sách cho độc giả

## Tổng quan

Chức năng tìm kiếm sách đã được cải thiện dựa trên bảng mô tả chi tiết và biểu mẫu yêu cầu, bao gồm:

### 1. Fuzzy Search với gợi ý tìm kiếm
- **Nhập từ khóa**: Gõ từ khóa liên quan đến sách (VD: Conan)
- **Gợi ý theo fuzzy search**: Hiển thị gợi ý tìm kiếm từ tên sách, tác giả, ISBN
- **Có thể kết hợp lọc nâng cao**: Tích hợp với bộ lọc chi tiết

### 2. Biểu mẫu tìm kiếm chi tiết
Theo biểu mẫu "DANH SÁCH TRA CỨU SÁCH", bao gồm các trường:
- **Tên sách**: Tìm kiếm theo tên sách
- **Tác giả**: Tìm kiếm theo tên tác giả  
- **Mã ISBN**: Tìm kiếm theo mã ISBN
- **Thể loại**: Lọc theo thể loại sách
- **Năm xuất bản**: Lọc theo năm xuất bản

### 3. Giao diện tối giản với hình ảnh bìa sách
- Thiết kế clean, modern với hình ảnh bìa sách
- Responsive design
- UX/UI tối ưu cho trải nghiệm người dùng
- Hiển thị hình ảnh bìa sách đẹp mắt

## Cách sử dụng

### Bước 1: Tìm kiếm cơ bản
1. Nhập từ khóa vào ô tìm kiếm chính
2. Hệ thống sẽ hiển thị gợi ý tìm kiếm
3. Chọn gợi ý hoặc nhấn Enter để tìm kiếm

### Bước 2: Sử dụng bộ lọc nâng cao
1. Nhấn nút "Hiển thị bộ lọc nâng cao"
2. Điền thông tin vào các trường tương ứng:
   - Tên sách
   - Tác giả
   - Mã ISBN
   - Thể loại (dropdown)
   - Năm xuất bản (dropdown)
3. Nhấn "Tìm kiếm" để thực hiện tìm kiếm
4. Nhấn "Xóa bộ lọc" để reset

### Bước 3: Xem kết quả
- Kết quả hiển thị dưới dạng card với hình ảnh bìa sách
- Mỗi card hiển thị:
  - **Hình ảnh bìa sách** (với hiệu ứng hover)
  - Tên sách
  - Tác giả
  - Thể loại
  - Nhà xuất bản và năm xuất bản
  - Vị trí lưu trữ
  - ISBN
  - Mô tả
  - Tình trạng sách (Có sẵn/Hết sách/Còn ít)
  - Nút "Yêu cầu mượn" (nếu sách có sẵn)

## API Endpoints

### 1. Lấy tất cả sách
```
GET /api/Sach
```

### 2. Tìm kiếm nâng cao
```
GET /api/Sach/search?tenSach={tenSach}&tacGia={tacGia}&isbn={isbn}&theLoai={theLoai}&namXuatBan={namXuatBan}
```

### 3. Lấy gợi ý tìm kiếm
```
GET /api/Sach/suggestions?q={searchTerm}
```

### 4. Upload hình ảnh bìa sách
```
POST /api/Sach/upload-image
Content-Type: multipart/form-data
```

## Tính năng nổi bật

### 1. Fuzzy Search
- Tìm kiếm mờ theo tên sách
- Hỗ trợ tìm kiếm không chính xác
- Kết quả phù hợp ngay cả khi gõ sai chính tả

### 2. Gợi ý tìm kiếm thông minh
- Hiển thị gợi ý từ tên sách, tác giả, ISBN
- Phân loại gợi ý theo loại
- Tối đa 5 gợi ý mỗi lần

### 3. Bộ lọc đa tiêu chí
- Kết hợp nhiều điều kiện tìm kiếm
- Lọc theo thể loại và năm xuất bản
- Reset dễ dàng

### 4. Hình ảnh bìa sách
- Hiển thị hình ảnh bìa sách đẹp mắt
- Hiệu ứng hover với zoom nhẹ
- Fallback image khi không có hình ảnh
- Upload hình ảnh mới qua API

### 5. Responsive Design
- Tương thích với mọi thiết bị
- Giao diện tối ưu cho mobile
- UX/UI thân thiện

### 6. Fallback Mechanism
- Tự động chuyển sang tìm kiếm local nếu API lỗi
- Đảm bảo tính khả dụng của hệ thống

## Cấu trúc dữ liệu

### Book Object
```javascript
{
  id: number,
  title: string,
  author: string,
  isbn: string,
  category: string,
  publisher: string,
  publishYear: number,
  quantity: number,
  available: number,
  location: string,
  description: string,
  coverImage: string
}
```

### Search Form
```javascript
{
  tenSach: string,
  tacGia: string,
  isbn: string,
  theLoai: string,
  namXuatBan: string
}
```

## Quản lý hình ảnh

### 1. Upload hình ảnh
- Hỗ trợ định dạng: JPG, JPEG, PNG, GIF
- Kích thước tối đa: 5MB
- Tự động tạo tên file duy nhất
- Lưu trữ trong thư mục `/uploads/book-covers/`

### 2. Hiển thị hình ảnh
- Sử dụng `object-fit: cover` để hiển thị đẹp
- Hiệu ứng hover với `transform: scale(1.05)`
- Fallback image khi lỗi tải hình ảnh

### 3. Cấu trúc thư mục
```
public/
├── images/
│   ├── book-covers/          # Hình ảnh bìa sách
│   └── default-book-cover.jpg # Hình ảnh mặc định
```

## Lưu ý kỹ thuật

1. **API Integration**: Hệ thống sử dụng RESTful API với fallback mechanism
2. **Image Handling**: Upload và lưu trữ hình ảnh với validation
3. **Performance**: Tối ưu hóa query database với Entity Framework
4. **Security**: Validate input parameters và file upload
5. **Error Handling**: Xử lý lỗi gracefully với fallback options
6. **Accessibility**: Hỗ trợ keyboard navigation và screen readers

## Tương lai

Có thể mở rộng thêm các tính năng:
- Tìm kiếm theo nội dung sách
- Lọc theo đánh giá/rating
- Sắp xếp kết quả theo nhiều tiêu chí
- Lưu lịch sử tìm kiếm
- Export kết quả tìm kiếm
- Zoom hình ảnh bìa sách khi click
- Gallery view cho hình ảnh bìa sách 