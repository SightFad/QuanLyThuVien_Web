using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryApi.Data;
using LibraryApi.Models;
using LibraryApi.Services;
using System.Security.Cryptography;
using System.Text;
using System.Security.Claims;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace LibraryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly JwtService _jwtService;

        public AuthController(LibraryContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.NguoiDungs.FirstOrDefaultAsync(u => u.TenDangNhap == request.Username);
            if (user == null || !VerifyPassword(request.Password, user.MatKhau))
                return Unauthorized("Sai tên đăng nhập hoặc mật khẩu");
            
            var token = _jwtService.GenerateToken(user);
            
            // Tạo response cơ bản
            var response = new LoginResponse
            {
                Token = token,
                UserId = user.MaND,
                Username = user.TenDangNhap,
                Role = user.ChucVu,
                ExpiresAt = DateTime.UtcNow.AddDays(7) // Mặc định 7 ngày
            };
            
            // Nếu user là Reader, lấy thông tin DocGia chi tiết
            if (user.DocGiaId.HasValue)
            {
                var docGia = await _context.DocGias.FirstOrDefaultAsync(d => d.MaDG == user.DocGiaId.Value);
                if (docGia != null)
                {
                    response.DocGiaId = docGia.MaDG;
                    response.HoTen = docGia.HoTen;
                    response.Email = docGia.Email;
                    response.LoaiDocGia = docGia.LoaiDocGia ?? "Thuong";
                    response.CapBac = docGia.CapBac ?? "Thuong";
                    response.MemberStatus = docGia.MemberStatus ?? "ChuaThanhToan";
                    response.NgayHetHan = docGia.NgayHetHan;
                    response.SoSachToiDa = docGia.SoSachToiDa;
                    response.SoNgayMuonToiDa = docGia.SoNgayMuonToiDa;
                }
            }
            
            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterReaderRequest request)
        {
            // Kiểm tra tên đăng nhập đã tồn tại
            if (await _context.NguoiDungs.AnyAsync(u => u.TenDangNhap == request.Username))
                return BadRequest("Tên đăng nhập đã tồn tại");
            // Tạo mới DocGia
            var docGia = new DocGia
            {
                HoTen = request.HoTen,
                Email = request.Email,
                SDT = request.SDT,
                DiaChi = request.DiaChi,
                GioiTinh = request.GioiTinh,
                NgaySinh = request.NgaySinh
            };
            _context.DocGias.Add(docGia);
            await _context.SaveChangesAsync();
            // Tạo mới NguoiDung
            var user = new NguoiDung
            {
                TenDangNhap = request.Username,
                MatKhau = HashPassword(request.Password), // Có thể hash nếu muốn
                ChucVu = "Reader",
                DocGiaId = docGia.MaDG
            };
            _context.NguoiDungs.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { user.MaND, user.TenDangNhap, user.ChucVu, user.DocGiaId });
        }

        [HttpGet("user/{id}")]
        public async Task<ActionResult<NguoiDung>> GetUser(int id)
        {
            var user = await _context.NguoiDungs.FirstOrDefaultAsync(u => u.MaND == id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpGet("profile")]
        public async Task<ActionResult<NguoiDung>> GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int id))
            {
                return Unauthorized();
            }
            var user = await _context.NguoiDungs.FirstOrDefaultAsync(u => u.MaND == id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        private bool VerifyPassword(string password, string hash)
        {
            return HashPassword(password) == hash;
        }
    }

    public class RegisterRequest
    {
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
} 