using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryApi.Data;
using LibraryApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly LibraryContext _context;

        public UserController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetUsers()
        {
            return Ok(_context.NguoiDungs.ToList());
        }

        // GET: api/User/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetUser(int id)
        {
            try
            {
                var user = await _context.NguoiDungs
                    .Where(u => u.MaND == id)
                    .Select(u => new
                    {
                        id = u.MaND,
                        username = u.TenDangNhap,
                        role = u.ChucVu,
                        status = "Active",
                        createdAt = u.NgayTao
                    })
                    .FirstOrDefaultAsync();

                if (user == null)
                {
                    return NotFound(new { message = "Không tìm thấy người dùng" });
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thông tin người dùng", error = ex.Message });
            }
        }

        // POST: api/User
        [HttpPost]
        public async Task<ActionResult<object>> CreateUser([FromBody] object userData)
        {
            try
            {
                // Simulate user creation
                var newUser = new
                {
                    id = 999,
                    username = "newuser",
                    role = "Reader",
                    status = "Active",
                    createdAt = DateTime.Now
                };

                return CreatedAtAction(nameof(GetUser), new { id = newUser.id }, newUser);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tạo người dùng", error = ex.Message });
            }
        }

        // PUT: api/User/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<object>> UpdateUser(int id, [FromBody] object userData)
        {
            try
            {
                // Simulate user update
                var updatedUser = new
                {
                    id = id,
                    username = "updateduser",
                    role = "Librarian",
                    status = "Active",
                    updatedAt = DateTime.Now
                };

                return Ok(updatedUser);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật người dùng", error = ex.Message });
            }
        }

        // DELETE: api/User/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<object>> DeleteUser(int id)
        {
            try
            {
                // Simulate user deletion
                return Ok(new { message = "Xóa người dùng thành công", userId = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xóa người dùng", error = ex.Message });
            }
        }

        // GET: api/User/roles
        [HttpGet("roles")]
        public async Task<ActionResult<object>> GetRoles()
        {
            try
            {
                var roles = new[]
                {
                    new { id = 1, name = "Admin", description = "Quản trị viên hệ thống" },
                    new { id = 2, name = "Librarian", description = "Thủ thư" },
                    new { id = 3, name = "Reader", description = "Độc giả" },
                    new { id = 4, name = "Accountant", description = "Kế toán" },
                    new { id = 5, name = "Warehouse sách", description = "Nhân viên kho" }
                };

                return Ok(roles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách vai trò", error = ex.Message });
            }
        }

        // POST: api/User/reset-password
        [HttpPost("reset-password")]
        public async Task<ActionResult<object>> ResetPassword([FromBody] object resetData)
        {
            try
            {
                return Ok(new { message = "Đặt lại mật khẩu thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi đặt lại mật khẩu", error = ex.Message });
            }
        }

        // GET: api/User/statistics
        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetUserStatistics()
        {
            try
            {
                var totalUsers = await _context.NguoiDungs.CountAsync();
                var usersByRole = await _context.NguoiDungs
                    .GroupBy(u => u.ChucVu)
                    .Select(g => new
                    {
                        role = g.Key,
                        count = g.Count()
                    })
                    .ToListAsync();

                var statistics = new
                {
                    totalUsers = totalUsers,
                    usersByRole = usersByRole,
                    activeUsers = totalUsers,
                    inactiveUsers = 0
                };

                return Ok(statistics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thống kê người dùng", error = ex.Message });
            }
        }
    }
} 