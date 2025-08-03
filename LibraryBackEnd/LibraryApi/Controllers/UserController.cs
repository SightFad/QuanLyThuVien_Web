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
    public class UserController : ControllerBase
    {
        private readonly LibraryContext _context;

        public UserController(LibraryContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAllUsers()
        {
            return Ok(_context.NguoiDungs.ToList());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<NguoiDung>> GetUser(int id)
        {
            var user = await _context.NguoiDungs.FindAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<object>> CreateUser([FromBody] CreateUserRequest request)
        {
            // Check if username already exists
            if (await _context.NguoiDungs.AnyAsync(u => u.TenDangNhap == request.Username))
                return BadRequest("Tên đăng nhập đã tồn tại");
            
            // Check if email already exists (if provided)
            if (!string.IsNullOrEmpty(request.Email) && 
                await _context.NguoiDungs.AnyAsync(u => u.Email == request.Email))
                return BadRequest("Email đã tồn tại");
            
            var user = new NguoiDung
            {
                TenDangNhap = request.Username,
                MatKhau = request.Password, // In real system, hash this password
                ChucVu = request.Role,
                Email = request.Email,
                DocGiaId = request.DocGiaId,
                NgayTao = DateTime.Now
            };
            
            _context.NguoiDungs.Add(user);
            await _context.SaveChangesAsync();
            
            // Return user data in format expected by frontend
            var responseUser = new
            {
                id = user.MaND,
                username = user.TenDangNhap,
                email = user.Email ?? "Chưa cập nhật",
                role = user.ChucVu,
                isActive = true,
                createdAt = user.NgayTao,
                lastLoginAt = (DateTime?)null,
                docGiaId = user.DocGiaId
            };
            
            return CreatedAtAction(nameof(GetUser), new { id = user.MaND }, responseUser);
        }

        [HttpPut("{id}")]      
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest request)
        {
            var user = await _context.NguoiDungs.FindAsync(id);
            if (user == null) return NotFound("Người dùng không tồn tại");
            
            // Check if username already exists (excluding current user)
            if (await _context.NguoiDungs.AnyAsync(u => u.TenDangNhap == request.Username && u.MaND != id))
                return BadRequest("Tên đăng nhập đã tồn tại");
            
            // Check if email already exists (excluding current user)
            if (!string.IsNullOrEmpty(request.Email) && 
                await _context.NguoiDungs.AnyAsync(u => u.Email == request.Email && u.MaND != id))
                return BadRequest("Email đã tồn tại");
            
            // Update user fields
            user.TenDangNhap = request.Username;
            user.ChucVu = request.Role;
            user.Email = request.Email;
            user.DocGiaId = request.DocGiaId;
            
            // Only update password if provided
            if (!string.IsNullOrEmpty(request.Password))
            {
                user.MatKhau = request.Password; // In real system, hash this password
            }
            
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.NguoiDungs.FindAsync(id);
            if (user == null) return NotFound("Người dùng không tồn tại");
            
            // Check if user has related data that prevents deletion
            var hasBorrowHistory = await _context.PhieuMuons.AnyAsync(p => p.MaDG == user.DocGiaId);
            if (hasBorrowHistory)
            {
                return BadRequest("Không thể xóa người dùng có lịch sử mượn sách. Hãy vô hiệu hóa thay vì xóa.");
            }
            
            _context.NguoiDungs.Remove(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Xóa người dùng thành công" });
        }

        // GET: api/User/roles
        [HttpGet("roles")]
        public ActionResult<object> GetAvailableRoles()
        {
            var roles = new[]
            {
                new { value = "Admin", label = "Admin" },
                new { value = "Quản lý", label = "Quản lý" },
                new { value = "Librarian", label = "Librarian" },
                new { value = "Accountant", label = "Accountant" },
                new { value = "Warehouse sách", label = "Warehouse sách" },
                new { value = "Reader", label = "Reader" }
            };
            
            return Ok(roles);
        }

        // POST: api/User/{id}/reset-password
        [HttpPost("{id}/reset-password")]
        public async Task<IActionResult> ResetPassword(int id, [FromBody] ResetPasswordRequest request)
        {
            var user = await _context.NguoiDungs.FindAsync(id);
            if (user == null) return NotFound("Người dùng không tồn tại");
            
            // In real system, hash the password
            user.MatKhau = request.NewPassword;
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Đặt lại mật khẩu thành công" });
        }

        // GET: api/User/statistics
        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetUserStatistics()
        {
            var stats = new
            {
                totalUsers = await _context.NguoiDungs.CountAsync(),
                usersByRole = await _context.NguoiDungs
                    .GroupBy(u => u.ChucVu)
                    .Select(g => new { role = g.Key, count = g.Count() })
                    .ToListAsync(),
                activeUsers = await _context.NguoiDungs.CountAsync(), // In real system, track actual activity
                newUsersThisMonth = await _context.NguoiDungs
                    .Where(u => u.NgayTao >= DateTime.Now.Date.AddDays(-30))
                    .CountAsync()
            };
            
            return Ok(stats);
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