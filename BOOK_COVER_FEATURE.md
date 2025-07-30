# Tính năng Hình ảnh Bìa Sách

## Tổng quan

Tính năng hình ảnh bìa sách đã được tích hợp vào hệ thống quản lý thư viện, cho phép:

- **Hiển thị hình ảnh bìa sách** trong kết quả tìm kiếm
- **Upload hình ảnh bìa sách** khi thêm/sửa sách
- **Quản lý hình ảnh** với validation và error handling
- **Responsive design** cho mọi thiết bị

## Cấu trúc Database

### Bảng Saches
```sql
ALTER TABLE [Saches] ADD [AnhBia] nvarchar(max) NOT NULL DEFAULT N'';
ALTER TABLE [Saches] ADD [NhaXuatBan] nvarchar(max) NOT NULL DEFAULT N'';
```

### Model Sach.cs
```csharp
public class Sach
{
    // ... existing properties
    public string NhaXuatBan { get; set; }
    public string AnhBia { get; set; } // Thêm trường hình ảnh bìa sách
}
```

## API Endpoints

### 1. Upload hình ảnh bìa sách
```
POST /api/Sach/upload-image
Content-Type: multipart/form-data

Request:
- file: Image file (JPG, PNG, GIF, max 5MB)

Response:
{
  "imageUrl": "/uploads/book-covers/guid-filename.jpg"
}
```

### 2. Cập nhật API responses
Tất cả API trả về sách đã được cập nhật để bao gồm trường `anhBia`:

```json
{
  "maSach": 1,
  "tenSach": "Đắc Nhân Tâm",
  "tacGia": "Dale Carnegie",
  "theLoai": "Kỹ năng sống",
  "namXB": 2019,
  "isbn": "978-604-1-00001-1",
  "soLuong": 5,
  "trangThai": "Còn",
  "viTriLuuTru": "Kệ A1",
  "nhaXuatBan": "NXB Tổng hợp TP.HCM",
  "anhBia": "/uploads/book-covers/dac-nhan-tam.jpg",
  "soLuongConLai": 3
}
```

## Frontend Components

### 1. BookCoverUpload Component
Component chuyên dụng để upload hình ảnh bìa sách:

**Tính năng:**
- Drag & drop upload
- File validation (type, size)
- Preview hình ảnh
- Loading state
- Error handling

**Sử dụng:**
```jsx
import BookCoverUpload from './components/BookCoverUpload';

<BookCoverUpload
  onImageUpload={(imageUrl) => setCoverImage(imageUrl)}
  currentImage={book.coverImage}
  disabled={false}
/>
```

### 2. Cập nhật ReaderSearch
Kết quả tìm kiếm hiển thị hình ảnh bìa sách:

```jsx
<div className="book-card">
  <div className="book-cover">
    <img
      src={book.coverImage}
      alt={`Bìa sách ${book.title}`}
      onError={handleImageError}
      className="book-cover-image"
    />
  </div>
  <div className="book-content">
    {/* Book information */}
  </div>
</div>
```

### 3. Cập nhật BookModal
Form thêm/sửa sách bao gồm upload hình ảnh:

```jsx
<BookCoverUpload
  onImageUpload={handleImageUpload}
  currentImage={formData.coverImage}
/>
```

## Cấu trúc thư mục

```
LibraryBackEnd/LibraryApi/
├── wwwroot/
│   └── uploads/
│       └── book-covers/          # Hình ảnh được upload
│
public/
├── images/
│   ├── book-covers/              # Hình ảnh mẫu
│   └── default-book-cover.jpg    # Hình ảnh mặc định
│
src/
├── components/
│   ├── BookCoverUpload.js        # Component upload
│   ├── BookCoverUpload.css       # Styles cho upload
│   ├── BookModal.js              # Modal thêm/sửa sách
│   └── BookModal.css
└── pages/
    └── reader/
        ├── ReaderSearch.js        # Trang tìm kiếm
        └── ReaderSearch.css       # Styles cho tìm kiếm
```

## Validation Rules

### 1. File Type
- **Cho phép:** JPG, JPEG, PNG, GIF
- **Không cho phép:** PDF, DOC, TXT, etc.

### 2. File Size
- **Tối đa:** 5MB
- **Khuyến nghị:** 1-2MB cho hiệu suất tốt

### 3. Image Dimensions
- **Khuyến nghị:** 300x400px (tỷ lệ 3:4)
- **Tối thiểu:** 150x200px
- **Tối đa:** 1200x1600px

## Error Handling

### 1. Upload Errors
```javascript
// File type error
if (!allowedTypes.includes(file.type)) {
  alert('Chỉ chấp nhận file hình ảnh (JPG, PNG, GIF)');
  return;
}

// File size error
if (file.size > 5 * 1024 * 1024) {
  alert('Kích thước file không được vượt quá 5MB');
  return;
}
```

### 2. Display Errors
```javascript
// Fallback image khi lỗi
const handleImageError = (e) => {
  e.target.src = '/images/default-book-cover.jpg';
};
```

## CSS Styling

### 1. Book Cover Display
```css
.book-cover {
  position: relative;
  width: 100%;
  height: 200px;
  background: #e2e8f0;
  overflow: hidden;
}

.book-cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-card:hover .book-cover-image {
  transform: scale(1.05);
}
```

### 2. Upload Area
```css
.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  background: #f9fafb;
  transition: all 0.2s ease;
  cursor: pointer;
  min-height: 200px;
}

.upload-area.dragging {
  border-color: #667eea;
  background: #eff6ff;
  transform: scale(1.02);
}
```

## Migration

### 1. Tạo migration
```bash
cd LibraryBackEnd/LibraryApi
dotnet ef migrations add AddBookCoverImage
```

### 2. Cập nhật database
```bash
dotnet ef database update
```

## Testing

### 1. Upload Test
- Upload file hợp lệ (JPG, PNG, GIF)
- Upload file không hợp lệ (PDF, DOC)
- Upload file quá lớn (>5MB)
- Upload file rỗng

### 2. Display Test
- Hiển thị hình ảnh bình thường
- Hiển thị fallback image khi lỗi
- Responsive trên mobile/tablet

### 3. API Test
```bash
# Test upload
curl -X POST \
  http://localhost:5280/api/Sach/upload-image \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@book-cover.jpg'

# Test search with images
curl http://localhost:5280/api/Sach/search?tenSach=Đắc
```

## Performance Optimization

### 1. Image Optimization
- Sử dụng `object-fit: cover` để hiển thị đẹp
- Lazy loading cho hình ảnh
- Compression tự động (có thể thêm)

### 2. Caching
- Browser caching cho hình ảnh
- CDN cho production (khuyến nghị)

### 3. Storage
- Local storage cho development
- Cloud storage cho production (Azure Blob, AWS S3)

## Security Considerations

### 1. File Validation
- Validate file type bằng MIME type
- Validate file size
- Scan virus (có thể thêm)

### 2. File Storage
- Tạo tên file duy nhất (GUID)
- Không lưu trực tiếp user input
- Backup strategy

### 3. Access Control
- Authentication cho upload
- Authorization cho admin functions

## Future Enhancements

### 1. Image Processing
- Auto-resize images
- Generate thumbnails
- Multiple image formats (WebP, AVIF)

### 2. Advanced Features
- Image cropping tool
- Multiple book covers per book
- Cover gallery view

### 3. Integration
- ISBN API để lấy cover tự động
- OCR để extract text từ cover
- AI để suggest covers

## Troubleshooting

### 1. Upload không hoạt động
- Kiểm tra CORS settings
- Kiểm tra file permissions
- Kiểm tra disk space

### 2. Hình ảnh không hiển thị
- Kiểm tra file path
- Kiểm tra file permissions
- Kiểm tra network connectivity

### 3. Performance issues
- Optimize image sizes
- Implement lazy loading
- Use CDN for production 