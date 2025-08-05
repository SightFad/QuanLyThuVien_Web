using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using LibraryApi.Data;
using LibraryApi.Models;
using System.Security.Claims;

namespace LibraryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReaderController : ControllerBase
    {
        private readonly LibraryContext _context;

        public ReaderController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/Reader/dashboard/{readerId}
        [HttpGet("dashboard/{readerId}")]
        public async Task<ActionResult<object>> GetReaderDashboard(int readerId)
        {
            try
            {
                // Verify reader exists
                var reader = await _context.DocGias.FirstOrDefaultAsync(d => d.MaDG == readerId);
                if (reader == null)
                    return NotFound("Reader not found");

                // Get current borrows
                var currentBorrows = await _context.PhieuMuons
                    .Include(p => p.CT_PhieuMuons)
                        .ThenInclude(ct => ct.Sach)
                    .Where(p => p.MaDG == readerId && p.TrangThai == "borrowed")
                    .Select(p => p.CT_PhieuMuons.Select(ct => new
                    {
                        id = ct.MaSach,
                        bookTitle = ct.Sach.TenSach,
                        author = ct.Sach.TacGia,
                        category = ct.Sach.TheLoai,
                        borrowDate = p.NgayMuon,
                        returnDate = p.HanTra,
                        daysLeft = (int)(p.HanTra - DateTime.Now).TotalDays,
                        status = p.TrangThai,
                        location = ct.Sach.ViTriLuuTru,
                        phieuMuonId = p.MaPhieuMuon
                    }))
                    .SelectMany(x => x)
                    .ToListAsync();

                // Get total borrows count
                var totalBorrows = await _context.PhieuMuons
                    .Where(p => p.MaDG == readerId)
                    .CountAsync();

                // Get overdue books count
                var overdueBooks = await _context.PhieuMuons
                    .Where(p => p.MaDG == readerId && p.TrangThai == "borrowed" && p.HanTra < DateTime.Now)
                    .CountAsync();

                // Calculate total fines
                var totalFines = await _context.PhieuThus
                    .Where(pt => pt.MaDG == readerId && pt.LoaiThu == "PhiPhat" && pt.TrangThai == "ChuaThu")
                    .SumAsync(pt => pt.SoTien);

                // Get recent books (popular books for now)
                var recentBooks = await _context.Saches
                    .Where(s => s.SoLuong > 0)
                    .OrderByDescending(s => s.NgayTao)
                    .Take(6)
                    .Select(s => new
                    {
                        id = s.MaSach,
                        title = s.TenSach,
                        author = s.TacGia,
                        category = s.TheLoai,
                        total = s.SoLuong,
                        location = s.ViTriLuuTru,
                        coverImage = s.AnhBia
                    })
                    .ToListAsync();

                var dashboard = new
                {
                    readerInfo = new
                    {
                        id = reader.MaDG,
                        name = reader.HoTen,
                        email = reader.Email,
                        memberSince = reader.NgayDangKy?.ToString("yyyy-MM-dd") ?? DateTime.Now.ToString("yyyy-MM-dd"),
                        memberStatus = reader.MemberStatus ?? "DaThanhToan",
                        loaiDocGia = reader.LoaiDocGia ?? "Thuong",
                        capBac = reader.CapBac ?? "Thuong",
                        totalBorrows = totalBorrows,
                        currentBorrows = currentBorrows.Count(),
                        overdueBooks = overdueBooks,
                        fines = totalFines
                    },
                    currentBorrows = currentBorrows,
                    recentBooks = recentBooks
                };

                return Ok(dashboard);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thông tin dashboard", error = ex.Message });
            }
        }

        // GET: api/Reader/my-books/{readerId}
        [HttpGet("my-books/{readerId}")]
        public async Task<ActionResult<object>> GetMyBooks(int readerId)
        {
            try
            {
                // Current borrowed books
                var currentBooks = await _context.PhieuMuons
                    .Include(p => p.CT_PhieuMuons)
                        .ThenInclude(ct => ct.Sach)
                    .Where(p => p.MaDG == readerId && p.TrangThai == "borrowed")
                    .SelectMany(p => p.CT_PhieuMuons.Select(ct => new
                    {
                        id = ct.MaSach,
                        phieuMuonId = p.MaPhieuMuon,
                        bookTitle = ct.Sach.TenSach,
                        author = ct.Sach.TacGia,
                        category = ct.Sach.TheLoai,
                        isbn = ct.Sach.ISBN,
                        location = ct.Sach.ViTriLuuTru,
                        borrowDate = p.NgayMuon.ToString("yyyy-MM-dd"),
                        returnDate = p.HanTra.ToString("yyyy-MM-dd"),
                        daysLeft = (int)(p.HanTra - DateTime.Now).TotalDays,
                        status = (p.HanTra < DateTime.Now) ? "overdue" : "borrowed",
                        coverImage = ct.Sach.AnhBia
                    }))
                    .ToListAsync();

                // Borrow history
                var borrowHistory = await _context.PhieuMuons
                    .Include(p => p.CT_PhieuMuons)
                        .ThenInclude(ct => ct.Sach)
                    .Include(p => p.PhieuTras)
                    .Where(p => p.MaDG == readerId && p.TrangThai == "returned")
                    .OrderByDescending(p => p.NgayTra ?? p.NgayMuon)
                    .Take(20)
                    .SelectMany(p => p.CT_PhieuMuons.Select(ct => new
                    {
                        id = ct.MaSach,
                        phieuMuonId = p.MaPhieuMuon,
                        bookTitle = ct.Sach.TenSach,
                        author = ct.Sach.TacGia,
                        category = ct.Sach.TheLoai,
                        isbn = ct.Sach.ISBN,
                        location = ct.Sach.ViTriLuuTru,
                        borrowDate = p.NgayMuon.ToString("yyyy-MM-dd"),
                        returnDate = p.HanTra.ToString("yyyy-MM-dd"),
                        //actualReturnDate = p.NgayTra?.ToString("yyyy-MM-dd") ?? "",
                        status = (p.NgayTra > p.HanTra) ? "returned_late" : "returned",
                        fine = /*p.PhieuTras.FirstOrDefault()?.TienPhat ??*/ 0,
                        coverImage = ct.Sach.AnhBia
                    }))
                    .ToListAsync();

                return Ok(new
                {
                    currentBooks = currentBooks,
                    borrowHistory = borrowHistory
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách sách", error = ex.Message });
            }
        }

        // GET: api/Reader/profile/{readerId}
        [HttpGet("profile/{readerId}")]
        public async Task<ActionResult<object>> GetReaderProfile(int readerId)
        {
            try
            {
                var reader = await _context.DocGias.FirstOrDefaultAsync(d => d.MaDG == readerId);
                if (reader == null)
                    return NotFound("Reader not found");

                // Get borrowing statistics
                var totalBorrows = await _context.PhieuMuons
                    .Where(p => p.MaDG == readerId)
                    .CountAsync();

                var totalFines = await _context.PhieuThus
                    .Where(pt => pt.MaDG == readerId && pt.LoaiThu == "PhiPhat")
                    .SumAsync(pt => pt.SoTien);

                var profile = new
                {
                    // Basic info
                    id = reader.MaDG,
                    hoTen = reader.HoTen,
                    email = reader.Email,
                    sdt = reader.SDT,
                    diaChi = reader.DiaChi,
                    gioiTinh = reader.GioiTinh,
                    ngaySinh = reader.NgaySinh?.ToString("yyyy-MM-dd"),
                    
                    // Membership info
                    loaiDocGia = reader.LoaiDocGia ?? "Thuong",
                    capBac = reader.CapBac ?? "Thuong",
                    memberStatus = reader.MemberStatus ?? "DaThanhToan",
                    ngayDangKy = reader.NgayDangKy?.ToString("yyyy-MM-dd"),
                    ngayHetHan = reader.NgayHetHan?.ToString("yyyy-MM-dd"),
                    phiThanhVien = reader.PhiThanhVien,
                    
                    // Borrowing limits
                    soSachToiDa = reader.SoSachToiDa,
                    soNgayMuonToiDa = reader.SoNgayMuonToiDa,
                    soLanGiaHanToiDa = reader.SoLanGiaHanToiDa,
                    soNgayGiaHan = reader.SoNgayGiaHan,
                    
                    // Statistics
                    statistics = new
                    {
                        totalBorrows = totalBorrows,
                        totalFines = totalFines
                    }
                };

                return Ok(profile);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thông tin profile", error = ex.Message });
            }
        }

        // PUT: api/Reader/profile/{readerId}
        [HttpPut("profile/{readerId}")]
        public async Task<ActionResult> UpdateReaderProfile(int readerId, [FromBody] UpdateReaderProfileRequest request)
        {
            try
            {
                var reader = await _context.DocGias.FirstOrDefaultAsync(d => d.MaDG == readerId);
                if (reader == null)
                    return NotFound("Reader not found");

                // Update editable fields
                if (!string.IsNullOrEmpty(request.Email)) reader.Email = request.Email;
                if (!string.IsNullOrEmpty(request.SDT)) reader.SDT = request.SDT;
                if (!string.IsNullOrEmpty(request.DiaChi)) reader.DiaChi = request.DiaChi;
                if (request.NgaySinh.HasValue) reader.NgaySinh = request.NgaySinh;
                
                reader.NgayCapNhat = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật thông tin thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật thông tin", error = ex.Message });
            }
        }
    }

    public class UpdateReaderProfileRequest
    {
        public string? Email { get; set; }
        public string? SDT { get; set; }
        public string? DiaChi { get; set; }
        public DateTime? NgaySinh { get; set; }
    }
}