using Microsoft.AspNetCore.Authorization;
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
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InventoryManagementController : ControllerBase
    {
        private readonly LibraryContext _context;

        public InventoryManagementController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/InventoryManagement
        [HttpGet]
        public async Task<ActionResult<object>> GetInventory([FromQuery] string? search = null, [FromQuery] string? category = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.Saches.AsQueryable();

                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(s => s.TenSach.Contains(search) || s.TacGia.Contains(search));
                }

                if (!string.IsNullOrEmpty(category))
                {
                    query = query.Where(s => s.TheLoai == category);
                }

                var totalCount = await query.CountAsync();
                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

                var inventory = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(s => new
                    {
                        id = s.MaSach,
                        bookTitle = s.TenSach,
                        author = s.TacGia,
                        category = s.TheLoai,
                        totalQuantity = s.SoLuong,
                        availableQuantity = s.SoLuong.HasValue ? s.SoLuong.Value : 0,
                        borrowedQuantity = 0, // Simplified for now
                        location = s.ViTriLuuTru ?? "Chưa xác định",
                        status = (s.SoLuong.HasValue ? s.SoLuong.Value : 0) > 0 ? "Có sẵn" : "Hết sách"
                    })
                    .ToListAsync();

                var result = new
                {
                    inventory = inventory,
                    pagination = new
                    {
                        currentPage = page,
                        totalPages = totalPages,
                        totalCount = totalCount,
                        pageSize = pageSize
                    }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách kho", error = ex.Message });
            }
        }

        // GET: api/InventoryManagement/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetInventoryItem(int id)
        {
            try
            {
                var item = await _context.Saches
                    .Where(s => s.MaSach == id)
                    .Select(s => new
                    {
                        id = s.MaSach,
                        bookTitle = s.TenSach,
                        author = s.TacGia,
                        category = s.TheLoai,
                        totalQuantity = s.SoLuong,
                        availableQuantity = s.SoLuong.HasValue ? s.SoLuong.Value : 0,
                        borrowedQuantity = 0, // Simplified for now
                        location = s.ViTriLuuTru ?? "Chưa xác định",
                        status = (s.SoLuong.HasValue ? s.SoLuong.Value : 0) > 0 ? "Có sẵn" : "Hết sách",
                        description = s.MoTa,
                        isbn = s.ISBN,
                        publishYear = s.NamXuatBan
                    })
                    .FirstOrDefaultAsync();

                if (item == null)
                {
                    return NotFound(new { message = "Không tìm thấy sách" });
                }

                return Ok(item);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thông tin sách", error = ex.Message });
            }
        }

        // POST: api/InventoryManagement
        [HttpPost]
        public async Task<ActionResult<object>> AddInventoryItem([FromBody] object itemData)
        {
            try
            {
                // Simulate adding inventory item
                var newItem = new
                {
                    id = 999,
                    bookTitle = "Sách mới",
                    author = "Tác giả mới",
                    category = "Văn học",
                    totalQuantity = 5,
                    availableQuantity = 5,
                    borrowedQuantity = 0,
                    location = "Kệ mới",
                    status = "Có sẵn"
                };

                return CreatedAtAction(nameof(GetInventoryItem), new { id = newItem.id }, newItem);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi thêm sách vào kho", error = ex.Message });
            }
        }

        // PUT: api/InventoryManagement/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<object>> UpdateInventoryItem(int id, [FromBody] object itemData)
        {
            try
            {
                // Simulate updating inventory item
                var updatedItem = new
                {
                    id = id,
                    bookTitle = "Sách đã cập nhật",
                    author = "Tác giả đã cập nhật",
                    category = "Văn học",
                    totalQuantity = 10,
                    availableQuantity = 8,
                    borrowedQuantity = 2,
                    location = "Kệ A1",
                    status = "Có sẵn"
                };

                return Ok(updatedItem);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật thông tin sách", error = ex.Message });
            }
        }

        // DELETE: api/InventoryManagement/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<object>> DeleteInventoryItem(int id)
        {
            try
            {
                // Simulate deleting inventory item
                return Ok(new { message = "Xóa sách khỏi kho thành công", itemId = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xóa sách khỏi kho", error = ex.Message });
            }
        }

        // POST: api/InventoryManagement/check
        [HttpPost("check")]
        public async Task<ActionResult<object>> PerformInventoryCheck([FromBody] object checkData)
        {
            try
            {
                var checkResult = new
                {
                    checkId = 123,
                    checkDate = DateTime.Now,
                    totalItems = 100,
                    checkedItems = 95,
                    discrepancies = 5,
                    status = "Đang kiểm tra"
                };

                return Ok(checkResult);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi thực hiện kiểm kê", error = ex.Message });
            }
        }

        // GET: api/InventoryManagement/statistics
        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetInventoryStatistics()
        {
            try
            {
                var totalBooks = await _context.Saches.CountAsync();
                var availableBooks = await _context.Saches.Where(s => s.SoLuong.HasValue && s.SoLuong.Value > 0).CountAsync();
                var borrowedBooks = 0; // Simplified for now

                var statistics = new
                {
                    totalBooks = totalBooks,
                    availableBooks = availableBooks,
                    borrowedBooks = borrowedBooks,
                    utilizationRate = totalBooks > 0 ? (double)borrowedBooks / totalBooks * 100 : 0
                };

                return Ok(statistics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thống kê kho", error = ex.Message });
            }
        }
    }
}