using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using LibraryApi.Data;
using LibraryApi.Models;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace LibraryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class WarehouseDashboardController : ControllerBase
    {
        private readonly LibraryContext _context;

        public WarehouseDashboardController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/WarehouseDashboard/summary
        [HttpGet("summary")]
        public async Task<ActionResult<object>> GetWarehouseSummary()
        {
            try
            {
                var today = DateTime.Now.Date;

                // Basic book statistics
                var totalBooks = await _context.Saches.SumAsync(s => s.SoLuong ?? 0);
                var totalUniqueBooks = await _context.Saches.CountAsync();
                
                var booksInStock = await _context.Saches
                    .Where(s => s.SoLuongConLai > 0)
                    .SumAsync(s => s.SoLuongConLai);

                var booksOutOfStock = await _context.Saches
                    .CountAsync(s => s.SoLuongConLai == 0);

                // Pending orders (from PhieuNhapKho)
                var pendingOrders = await _context.PhieuNhapKhos
                    .CountAsync(p => p.TrangThai == "ChuaDuyet" || p.TrangThai == "DangXuLy");

                // Today deliveries (completed imports today)
                var todayDeliveries = await _context.PhieuNhapKhos
                    .CountAsync(p => p.NgayNhap.Date == today && p.TrangThai == "DaHoanThanh");

                // Damaged books (estimate based on status or create a proper tracking system)
                var damagedBooks = await _context.Saches
                    .CountAsync(s => s.TrangThai == "HuHong" || s.TrangThai == "CanKiemTra");

                // Recent activities
                var recentActivities = await _context.PhieuNhapKhos
                    .Include(p => p.ChiTietPhieuNhapKho)
                        .ThenInclude(ct => ct.Sach)
                    .OrderByDescending(p => p.NgayTao)
                    .Take(5)
                    .Select(p => new
                    {
                        id = p.Id,
                        type = "import",
                        description = $"Nhập {p.ChiTietPhieuNhapKho.Sum(ct => ct.SoLuong)} cuốn sách từ {p.NhaCungCap}",
                        time = GetTimeAgo(p.NgayTao),
                        status = p.TrangThai
                    })
                    .ToListAsync();

                // Stock alerts (low stock books)
                var lowStockBooks = await _context.Saches
                    .Where(s => s.SoLuongConLai <= 5 && s.SoLuongConLai > 0)
                    .OrderBy(s => s.SoLuongConLai)
                    .Take(10)
                    .Select(s => new
                    {
                        id = s.MaSach,
                        title = s.TenSach,
                        currentStock = s.SoLuongConLai,
                        alertLevel = s.SoLuongConLai == 0 ? "critical" : 
                                   s.SoLuongConLai <= 2 ? "critical" : 
                                   s.SoLuongConLai <= 5 ? "warning" : "normal"
                    })
                    .ToListAsync();

                // Out of stock books
                var outOfStockBooks = await _context.Saches
                    .Where(s => s.SoLuongConLai == 0)
                    .OrderBy(s => s.TenSach)
                    .Take(10)
                    .Select(s => new
                    {
                        id = s.MaSach,
                        title = s.TenSach,
                        author = s.TacGia,
                        category = s.TheLoai,
                        lastStock = s.SoLuong ?? 0
                    })
                    .ToListAsync();

                var summary = new
                {
                    stats = new
                    {
                        totalBooks = totalBooks,
                        totalUniqueBooks = totalUniqueBooks,
                        booksInStock = booksInStock,
                        booksOutOfStock = booksOutOfStock,
                        pendingOrders = pendingOrders,
                        todayDeliveries = todayDeliveries,
                        damagedBooks = damagedBooks
                    },
                    overview = new
                    {
                        stockRatio = totalBooks > 0 ? Math.Round((double)booksInStock / totalBooks * 100, 1) : 0,
                        lowStockCount = lowStockBooks.Count(),
                        qualityRatio = totalBooks > 0 ? Math.Round((double)(totalBooks - damagedBooks) / totalBooks * 100, 1) : 100
                    },
                    recentActivities = recentActivities,
                    alerts = new
                    {
                        lowStockBooks = lowStockBooks,
                        outOfStockBooks = outOfStockBooks
                    },
                    generatedAt = DateTime.Now
                };

                return Ok(summary);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thông tin warehouse dashboard", error = ex.Message });
            }
        }

        // GET: api/WarehouseDashboard/inventory-status
        [HttpGet("inventory-status")]
        public async Task<ActionResult<object>> GetInventoryStatus()
        {
            try
            {
                // Inventory by category
                var inventoryByCategory = await _context.Saches
                    .GroupBy(s => s.TheLoai ?? "Không xác định")
                    .Select(g => new
                    {
                        category = g.Key,
                        totalBooks = g.Sum(s => s.SoLuong ?? 0),
                        availableBooks = g.Sum(s => s.SoLuongConLai),
                        uniqueTitles = g.Count()
                    })
                    .OrderByDescending(x => x.totalBooks)
                    .ToListAsync();

                // Inventory by location
                var inventoryByLocation = await _context.Saches
                    .GroupBy(s => s.KeSach ?? "Chưa phân kệ")
                    .Select(g => new
                    {
                        location = g.Key,
                        totalBooks = g.Sum(s => s.SoLuong ?? 0),
                        availableBooks = g.Sum(s => s.SoLuongConLai),
                        uniqueTitles = g.Count()
                    })
                    .OrderByDescending(x => x.totalBooks)
                    .ToListAsync();

                // Monthly import trends
                var importTrends = await _context.PhieuNhapKhos
                    .Where(p => p.NgayNhap >= DateTime.Now.AddMonths(-6))
                    .GroupBy(p => new { p.NgayNhap.Year, p.NgayNhap.Month })
                    .Select(g => new
                    {
                        month = $"{g.Key.Year}-{g.Key.Month:D2}",
                        importCount = g.Count(),
                        totalQuantity = g.Sum(p => p.ChiTietPhieuNhapKho.Sum(ct => ct.SoLuong))
                    })
                    .OrderBy(x => x.month)
                    .ToListAsync();

                var status = new
                {
                    inventoryByCategory = inventoryByCategory,
                    inventoryByLocation = inventoryByLocation,
                    importTrends = importTrends,
                    generatedAt = DateTime.Now
                };

                return Ok(status);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy tình trạng kho", error = ex.Message });
            }
        }

        // Helper method to get time ago string
        private string GetTimeAgo(DateTime dateTime)
        {
            var timespan = DateTime.Now - dateTime;
            
            if (timespan.TotalMinutes < 1)
                return "Vừa xong";
            else if (timespan.TotalMinutes < 60)
                return $"{(int)timespan.TotalMinutes} phút trước";
            else if (timespan.TotalHours < 24)
                return $"{(int)timespan.TotalHours} giờ trước";
            else
                return $"{(int)timespan.TotalDays} ngày trước";
        }
    }
}