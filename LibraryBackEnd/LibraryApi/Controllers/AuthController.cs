using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryApi.Data;
using LibraryApi.Models;
using LibraryApi.Services;
using System.Security.Cryptography;
using System.Text;
using System.Security.Claims;

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
            if (user == null || user.MatKhau != request.Password)
                return Unauthorized("Sai tên đăng nhập hoặc mật khẩu");
            var token = _jwtService.GenerateToken(user);
            // Map role cho frontend
            string mappedRole = user.ChucVu switch
            {
                "Admin" => "Quản trị viên",
                "Librarian" => "Thủ thư",
                "Accountant" => "Kế toán",
                "Reader" => "Độc giả",
                _ => user.ChucVu
            };
            return Ok(new { token, username = user.TenDangNhap, role = mappedRole });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] NguoiDung request)
        {
            if (await _context.NguoiDungs.AnyAsync(u => u.TenDangNhap == request.TenDangNhap))
                return BadRequest("Tên đăng nhập đã tồn tại");
            var user = new NguoiDung
            {
                TenDangNhap = request.TenDangNhap,
                MatKhau = request.MatKhau, // Không hash nữa
                ChucVu = request.ChucVu
            };
            _context.NguoiDungs.Add(user);
            await _context.SaveChangesAsync();
            return Ok(user);
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
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
} 