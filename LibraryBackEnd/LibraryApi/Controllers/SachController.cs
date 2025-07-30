using LibraryApi.Data;
using LibraryApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace LibraryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SachController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly IWebHostEnvironment _environment;

        public SachController(LibraryContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetBooks()
        {
            var books = await _context.Saches
                .Include(s => s.CT_PhieuMuons)
                .ToListAsync();
            var result = books.Select(book => {
                // Số sách đã mượn (chưa trả)
                int daMuon = book.CT_PhieuMuons?.Count() ?? 0;
                int tong = book.SoLuong ?? 0;
                int conLai = tong - daMuon;
                return new {
                    book.MaSach,
                    book.TenSach,
                    book.TacGia,
                    book.TheLoai,
                    book.NamXB,
                    book.ISBN,
                    book.SoLuong,
                    book.TrangThai,
                    book.ViTriLuuTru,
                    book.NhaXuatBan,
                    book.AnhBia,
                    SoLuongConLai = conLai < 0 ? 0 : conLai
                };
            });
            return Ok(result);
        }

        // Endpoint tìm kiếm nâng cao với fuzzy search
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<object>>> SearchBooks(
            [FromQuery] string? tenSach = null,
            [FromQuery] string? tacGia = null,
            [FromQuery] string? isbn = null,
            [FromQuery] string? theLoai = null,
            [FromQuery] int? namXuatBan = null)
        {
            var query = _context.Saches
                .Include(s => s.CT_PhieuMuons)
                .AsQueryable();

            // Fuzzy search cho tên sách
            if (!string.IsNullOrEmpty(tenSach))
            {
                var searchTerm = tenSach.ToLower();
                query = query.Where(s => 
                    EF.Functions.Like(s.TenSach.ToLower(), $"%{searchTerm}%") ||
                    s.TenSach.ToLower().Contains(searchTerm));
            }

            // Tìm kiếm theo tác giả
            if (!string.IsNullOrEmpty(tacGia))
            {
                var authorTerm = tacGia.ToLower();
                query = query.Where(s => s.TacGia.ToLower().Contains(authorTerm));
            }

            // Tìm kiếm theo ISBN
            if (!string.IsNullOrEmpty(isbn))
            {
                query = query.Where(s => s.ISBN.Contains(isbn));
            }

            // Lọc theo thể loại
            if (!string.IsNullOrEmpty(theLoai) && theLoai != "Tất cả")
            {
                query = query.Where(s => s.TheLoai == theLoai);
            }

            // Lọc theo năm xuất bản
            if (namXuatBan.HasValue)
            {
                query = query.Where(s => s.NamXB == namXuatBan.Value);
            }

            var books = await query.ToListAsync();
            
            var result = books.Select(book => {
                // Số sách đã mượn (chưa trả)
                int daMuon = book.CT_PhieuMuons?.Count() ?? 0;
                int tong = book.SoLuong ?? 0;
                int conLai = tong - daMuon;
                return new {
                    book.MaSach,
                    book.TenSach,
                    book.TacGia,
                    book.TheLoai,
                    book.NamXB,
                    book.ISBN,
                    book.SoLuong,
                    book.TrangThai,
                    book.ViTriLuuTru,
                    book.NhaXuatBan,
                    book.AnhBia,
                    SoLuongConLai = conLai < 0 ? 0 : conLai,
                    MoTa = book.TrangThai // Sử dụng TrangThai làm mô tả tạm thời
                };
            });

            return Ok(result);
        }

        // Endpoint lấy gợi ý tìm kiếm
        [HttpGet("suggestions")]
        public async Task<ActionResult<IEnumerable<object>>> GetSearchSuggestions([FromQuery] string q)
        {
            if (string.IsNullOrEmpty(q) || q.Length < 2)
            {
                return Ok(new List<object>());
            }

            var searchTerm = q.ToLower();
            var suggestions = new List<object>();

            // Gợi ý từ tên sách
            var bookSuggestions = await _context.Saches
                .Where(s => s.TenSach.ToLower().Contains(searchTerm))
                .Select(s => new { Text = s.TenSach, Type = "Tên sách" })
                .Take(3)
                .ToListAsync();

            suggestions.AddRange(bookSuggestions);

            // Gợi ý từ tác giả
            var authorSuggestions = await _context.Saches
                .Where(s => s.TacGia.ToLower().Contains(searchTerm))
                .Select(s => new { Text = s.TacGia, Type = "Tác giả" })
                .Take(2)
                .ToListAsync();

            suggestions.AddRange(authorSuggestions);

            // Gợi ý từ ISBN
            var isbnSuggestions = await _context.Saches
                .Where(s => s.ISBN.Contains(searchTerm))
                .Select(s => new { Text = s.ISBN, Type = "ISBN" })
                .Take(1)
                .ToListAsync();

            suggestions.AddRange(isbnSuggestions);

            return Ok(suggestions.Take(5));
        }

        // Endpoint upload hình ảnh bìa sách
        [HttpPost("upload-image")]
        public async Task<ActionResult<string>> UploadBookImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Không có file được chọn");
            }

            // Kiểm tra định dạng file
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            
            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest("Chỉ chấp nhận file hình ảnh (jpg, jpeg, png, gif)");
            }

            // Kiểm tra kích thước file (tối đa 5MB)
            if (file.Length > 5 * 1024 * 1024)
            {
                return BadRequest("Kích thước file không được vượt quá 5MB");
            }

            try
            {
                // Tạo thư mục uploads nếu chưa tồn tại
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "book-covers");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Tạo tên file duy nhất
                var fileName = $"{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                // Lưu file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Trả về đường dẫn tương đối
                var relativePath = $"/uploads/book-covers/{fileName}";
                return Ok(new { imageUrl = relativePath });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi upload file: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Sach>> GetBook(int id)
        {
            var book = await _context.Saches.FirstOrDefaultAsync(s => s.MaSach == id);
            if (book == null) return NotFound();
            return book;
        }

        [HttpPost]
        public async Task<ActionResult<Sach>> CreateBook([FromBody] CreateSachDto dto)
        {
            var book = new Sach
            {
                TenSach = dto.TenSach,
                TacGia = dto.TacGia,
                TheLoai = dto.TheLoai,
                NamXB = dto.NamXB,
                ISBN = dto.ISBN,
                SoLuong = dto.SoLuong,
                TrangThai = dto.TrangThai,
                ViTriLuuTru = dto.ViTriLuuTru,
                NhaXuatBan = dto.NhaXuatBan,
                AnhBia = dto.AnhBia
            };
            _context.Saches.Add(book);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBook), new { id = book.MaSach }, book);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] CreateSachDto dto)
        {
            var book = await _context.Saches.FirstOrDefaultAsync(s => s.MaSach == id);
            if (book == null) return NotFound();
            book.TenSach = dto.TenSach;
            book.TacGia = dto.TacGia;
            book.TheLoai = dto.TheLoai;
            book.NamXB = dto.NamXB;
            book.ISBN = dto.ISBN;
            book.SoLuong = dto.SoLuong;
            book.TrangThai = dto.TrangThai;
            book.ViTriLuuTru = dto.ViTriLuuTru;
            book.NhaXuatBan = dto.NhaXuatBan;
            book.AnhBia = dto.AnhBia;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Saches.FirstOrDefaultAsync(s => s.MaSach == id);
            if (book == null) return NotFound();
            _context.Saches.Remove(book);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
