using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using LibraryApi.Data;
using LibraryApi.Models;
using System.Security.Cryptography;
using System.Text;

namespace LibraryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "RequireAdmin")]
    public class UserController : ControllerBase
    {
        private readonly LibraryContext _context;

        public UserController(LibraryContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NguoiDung>>> GetAllUsers()
        {
            var users = await _context.NguoiDungs.ToListAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<NguoiDung>> GetUser(int id)
        {
            var user = await _context.NguoiDungs.FindAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<NguoiDung>> CreateUser([FromBody] NguoiDung request)
        {
            // Check if username already exists
            if (await _context.NguoiDungs.AnyAsync(u => u.TenDangNhap == request.TenDangNhap))
                return BadRequest("Tên đăng nhập đã tồn tại");
            var user = new NguoiDung
            {
                TenDangNhap = request.TenDangNhap,
                MatKhau = request.MatKhau,
                ChucVu = request.ChucVu
            };
            _context.NguoiDungs.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUser), new { id = user.MaND }, user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] NguoiDung request)
        {
            var user = await _context.NguoiDungs.FindAsync(id);
            if (user == null) return NotFound();
            // Check if username already exists (excluding current user)
            if (await _context.NguoiDungs.AnyAsync(u => u.TenDangNhap == request.TenDangNhap && u.MaND != id))
                return BadRequest("Tên đăng nhập đã tồn tại");
            user.TenDangNhap = request.TenDangNhap;
            user.MatKhau = request.MatKhau;
            user.ChucVu = request.ChucVu;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.NguoiDungs.FindAsync(id);
            if (user == null) return NotFound();
            _context.NguoiDungs.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    public class CreateUserRequest
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public int? DocGiaId { get; set; }
    }

    public class UpdateUserRequest
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public bool IsActive { get; set; }
        public int? DocGiaId { get; set; }
    }

    public class ResetPasswordRequest
    {
        public string NewPassword { get; set; }
    }
} 