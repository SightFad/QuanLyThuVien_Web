using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using LibraryApi.Data;
using LibraryApi.Models;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

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
        public async Task<ActionResult<object>> GetInventory(
            [FromQuery] string search = "",
            [FromQuery] string status = "all",
            [FromQuery] string location = "all",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.Saches.AsQueryable();

                // Apply search filter
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(s => 
                        s.TenSach.Contains(search) ||
                        s.TacGia.Contains(search) ||
                        s.ISBN.Contains(search));
                }

                // Apply status filter
                if (status != "all")
                {
                    switch (status)
                    {
                        case "available":
                            query = query.Where(s => s.SoLuongConLai > 0);
                            break;
                        case "out_of_stock":
                            query = query.Where(s => s.SoLuongConLai == 0);
                            break;
                        case "low_stock":
                            query = query.Where(s => s.SoLuongConLai > 0 && s.SoLuongConLai <= 5);
                            break;
                        case "damaged":
                            query = query.Where(s => s.TrangThai == "HuHong" || s.TrangThai == "CanKiemTra");
                            break;
                    }
                }

                // Apply location filter
                if (location != "all")
                {
                    query = query.Where(s => s.KeSach == location);
                }

                // Get total count for pagination
                var totalCount = await query.CountAsync();

                // Apply pagination and select data
                var inventory = await query
                    .OrderBy(s => s.TenSach)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(s => new
                    {
                        id = s.MaSach,
                        bookTitle = s.TenSach,
                        author = s.TacGia,
                        isbn = s.ISBN,
                        category = s.TheLoai,
                        totalQuantity = s.SoLuong ?? 0,
                        availableQuantity = s.SoLuongConLai,
                        borrowedQuantity = (s.SoLuong ?? 0) - s.SoLuongConLai,
                        location = s.KeSach ?? "Chưa phân kệ",
                        status = s.SoLuongConLai == 0 ? "out_of_stock" : 
                                s.SoLuongConLai <= 5 ? "low_stock" : "available",
                        condition = s.TrangThai ?? "Tot",
                        price = s.GiaSach,
                        publishYear = s.NamXuatBan,
                        publisher = s.NhaXuatBan,
                        entryDate = s.NgayNhap?.ToString("yyyy-MM-dd"),
                        lastUpdated = s.NgayCapNhat?.ToString("yyyy-MM-dd")
                    })
                    .ToListAsync();

                // Calculate summary statistics
                var totalBooks = await _context.Saches.SumAsync(s => s.SoLuong ?? 0);
                var availableBooks = await _context.Saches.SumAsync(s => s.SoLuongConLai);
                var outOfStockCount = await _context.Saches.CountAsync(s => s.SoLuongConLai == 0);
                var lowStockCount = await _context.Saches.CountAsync(s => s.SoLuongConLai > 0 && s.SoLuongConLai <= 5);

                var result = new
                {
                    inventory = inventory,
                    pagination = new
                    {
                        page = page,
                        pageSize = pageSize,
                        totalCount = totalCount,
                        totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                    },
                    summary = new
                    {
                        totalBooks = totalBooks,
                        availableBooks = availableBooks,
                        borrowedBooks = totalBooks - availableBooks,
                        outOfStockCount = outOfStockCount,
                        lowStockCount = lowStockCount,
                        uniqueTitles = await _context.Saches.CountAsync()
                    },
                    locations = await _context.Saches
                        .Where(s => !string.IsNullOrEmpty(s.KeSach))
                        .Select(s => s.KeSach)
                        .Distinct()
                        .OrderBy(l => l)
                        .ToListAsync()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách tồn kho", error = ex.Message });
            }
        }

        // GET: api/InventoryManagement/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetInventoryItem(int id)
        {
            try
            {
                var book = await _context.Saches
                    .Where(s => s.MaSach == id)
                    .Select(s => new
                    {
                        id = s.MaSach,
                        bookTitle = s.TenSach,
                        author = s.TacGia,
                        isbn = s.ISBN,
                        category = s.TheLoai,
                        totalQuantity = s.SoLuong ?? 0,
                        availableQuantity = s.SoLuongConLai,
                        borrowedQuantity = (s.SoLuong ?? 0) - s.SoLuongConLai,
                        location = s.KeSach ?? "Chưa phân kệ",
                        status = s.SoLuongConLai == 0 ? "out_of_stock" : 
                                s.SoLuongConLai <= 5 ? "low_stock" : "available",
                        condition = s.TrangThai ?? "Tot",
                        price = s.GiaSach,
                        publishYear = s.NamXuatBan,
                        publisher = s.NhaXuatBan,
                        description = s.MoTa,
                        coverImage = s.AnhBia,
                        entryDate = s.NgayNhap?.ToString("yyyy-MM-dd"),
                        lastUpdated = s.NgayCapNhat?.ToString("yyyy-MM-dd")
                    })
                    .FirstOrDefaultAsync();

                if (book == null)
                    return NotFound("Không tìm thấy sách trong kho");

                return Ok(book);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thông tin sách", error = ex.Message });
            }
        }

        // PUT: api/InventoryManagement/{id}/location
        [HttpPut("{id}/location")]
        public async Task<ActionResult> UpdateBookLocation(int id, [FromBody] UpdateLocationDto dto)
        {
            try
            {
                var book = await _context.Saches.FindAsync(id);
                if (book == null)
                    return NotFound("Không tìm thấy sách");

                book.KeSach = dto.Location;
                book.NgayCapNhat = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật vị trí sách thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật vị trí sách", error = ex.Message });
            }
        }

        // PUT: api/InventoryManagement/{id}/condition
        [HttpPut("{id}/condition")]
        public async Task<ActionResult> UpdateBookCondition(int id, [FromBody] UpdateConditionDto dto)
        {
            try
            {
                var book = await _context.Saches.FindAsync(id);
                if (book == null)
                    return NotFound("Không tìm thấy sách");

                book.TrangThai = dto.Condition;
                book.NgayCapNhat = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật tình trạng sách thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật tình trạng sách", error = ex.Message });
            }
        }

        // POST: api/InventoryManagement/{id}/adjust-quantity
        [HttpPost("{id}/adjust-quantity")]
        public async Task<ActionResult> AdjustQuantity(int id, [FromBody] AdjustQuantityDto dto)
        {
            try
            {
                var book = await _context.Saches.FindAsync(id);
                if (book == null)
                    return NotFound("Không tìm thấy sách");

                // Validate adjustment
                var newTotal = (book.SoLuong ?? 0) + dto.AdjustmentQuantity;
                if (newTotal < 0)
                    return BadRequest("Số lượng điều chỉnh không hợp lệ");

                var newAvailable = book.SoLuongConLai + dto.AdjustmentQuantity;
                if (newAvailable < 0)
                    return BadRequest("Số lượng có sẵn không đủ để điều chỉnh");

                // Apply adjustment
                book.SoLuong = newTotal;
                book.SoLuongConLai = newAvailable;
                book.NgayCapNhat = DateTime.Now;

                // Log the adjustment (you might want to create an AdjustmentLog table)
                // For now, we'll just save the changes
                await _context.SaveChangesAsync();

                return Ok(new 
                { 
                    message = "Điều chỉnh số lượng thành công",
                    newTotalQuantity = book.SoLuong,
                    newAvailableQuantity = book.SoLuongConLai
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi điều chỉnh số lượng", error = ex.Message });
            }
        }

        // GET: api/InventoryManagement/low-stock
        [HttpGet("low-stock")]
        public async Task<ActionResult<object>> GetLowStockItems([FromQuery] int threshold = 5)
        {
            try
            {
                var lowStockItems = await _context.Saches
                    .Where(s => s.SoLuongConLai <= threshold && s.SoLuongConLai > 0)
                    .OrderBy(s => s.SoLuongConLai)
                    .Select(s => new
                    {
                        id = s.MaSach,
                        bookTitle = s.TenSach,
                        author = s.TacGia,
                        availableQuantity = s.SoLuongConLai,
                        totalQuantity = s.SoLuong ?? 0,
                        location = s.KeSach ?? "Chưa phân kệ",
                        alertLevel = s.SoLuongConLai == 0 ? "critical" : 
                                   s.SoLuongConLai <= 2 ? "critical" : "warning"
                    })
                    .ToListAsync();

                return Ok(new
                {
                    lowStockItems = lowStockItems,
                    totalCount = lowStockItems.Count,
                    threshold = threshold
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách sách sắp hết", error = ex.Message });
            }
        }

        // GET: api/InventoryManagement/statistics
        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetInventoryStatistics()
        {
            try
            {
                var stats = new
                {
                    totalBooks = await _context.Saches.SumAsync(s => s.SoLuong ?? 0),
                    availableBooks = await _context.Saches.SumAsync(s => s.SoLuongConLai),
                    uniqueTitles = await _context.Saches.CountAsync(),
                    outOfStockCount = await _context.Saches.CountAsync(s => s.SoLuongConLai == 0),
                    lowStockCount = await _context.Saches.CountAsync(s => s.SoLuongConLai > 0 && s.SoLuongConLai <= 5),
                    
                    // By category
                    categoryBreakdown = await _context.Saches
                        .GroupBy(s => s.TheLoai ?? "Không xác định")
                        .Select(g => new
                        {
                            category = g.Key,
                            totalBooks = g.Sum(s => s.SoLuong ?? 0),
                            availableBooks = g.Sum(s => s.SoLuongConLai),
                            uniqueTitles = g.Count()
                        })
                        .OrderByDescending(x => x.totalBooks)
                        .ToListAsync(),
                        
                    // By location
                    locationBreakdown = await _context.Saches
                        .GroupBy(s => s.KeSach ?? "Chưa phân kệ")
                        .Select(g => new
                        {
                            location = g.Key,
                            totalBooks = g.Sum(s => s.SoLuong ?? 0),
                            availableBooks = g.Sum(s => s.SoLuongConLai),
                            uniqueTitles = g.Count()
                        })
                        .OrderByDescending(x => x.totalBooks)
                        .ToListAsync()
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thống kê tồn kho", error = ex.Message });
            }
        }
    }

    // DTOs for requests
    public class UpdateLocationDto
    {
        public string Location { get; set; }
    }

    public class UpdateConditionDto
    {
        public string Condition { get; set; }
        public string? Notes { get; set; }
    }

    public class AdjustQuantityDto
    {
        public int AdjustmentQuantity { get; set; }
        public string Reason { get; set; }
        public string? Notes { get; set; }
    }
}