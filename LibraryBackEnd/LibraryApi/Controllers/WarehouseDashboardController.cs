/*
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryApi.Data;

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
                // Basic statistics
                var totalBooks = await _context.Saches.SumAsync(s => s.SoLuong ?? 0);
                var totalUniqueBooks = await _context.Saches.CountAsync();
                var booksInStock = await _context.Saches.SumAsync(s => s.SoLuongConLai ?? 0);
                var booksOutOfStock = await _context.Saches.CountAsync(s => s.SoLuongConLai == 0);
                var pendingOrders = await _context.PhieuDeXuatMuaSachs.CountAsync(p => p.TrangThai == "Chờ duyệt");
                var todayDeliveries = await _context.PhieuNhapKhos
                    .CountAsync(p => p.NgayTao.Date == DateTime.Today);
                var damagedBooks = await _context.Saches.CountAsync(s => s.TrangThai == "Hư hỏng");

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
                    .GroupBy(s => s.ViTriLuuTru ?? "Không xác định")
                    .Select(g => new
                    {
                        location = g.Key,
                        totalBooks = g.Sum(s => s.SoLuong ?? 0),
                        availableBooks = g.Sum(s => s.SoLuongConLai),
                        uniqueTitles = g.Count()
                    })
                    .OrderByDescending(x => x.totalBooks)
                    .ToListAsync();

                // Stock movement (last 30 days)
                var thirtyDaysAgo = DateTime.Now.AddDays(-30);
                var stockMovement = await _context.PhieuNhapKhos
                    .Where(p => p.NgayTao >= thirtyDaysAgo)
                    .GroupBy(p => p.NgayTao.Date)
                    .Select(g => new
                    {
                        date = g.Key.ToString("yyyy-MM-dd"),
                        imports = g.Sum(p => p.ChiTietPhieuNhapKho.Sum(ct => ct.SoLuong)),
                        count = g.Count()
                    })
                    .OrderBy(x => x.date)
                    .ToListAsync();

                var status = new
                {
                    byCategory = inventoryByCategory,
                    byLocation = inventoryByLocation,
                    stockMovement = stockMovement,
                    generatedAt = DateTime.Now
                };

                return Ok(status);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thông tin inventory status", error = ex.Message });
            }
        }

        // GET: api/WarehouseDashboard/supplier-performance
        [HttpGet("supplier-performance")]
        public async Task<ActionResult<object>> GetSupplierPerformance()
        {
            try
            {
                var supplierPerformance = await _context.PhieuNhapKhos
                    .GroupBy(p => p.NhaCungCap)
                    .Select(g => new
                    {
                        supplier = g.Key,
                        totalOrders = g.Count(),
                        totalBooks = g.Sum(p => p.ChiTietPhieuNhapKho.Sum(ct => ct.SoLuong)),
                        averageDeliveryTime = g.Average(p => (p.NgayTao - p.NgayDat).Days),
                        lastOrder = g.Max(p => p.NgayTao),
                        totalValue = g.Sum(p => p.ChiTietPhieuNhapKho.Sum(ct => ct.DonGia * ct.SoLuong))
                    })
                    .OrderByDescending(x => x.totalOrders)
                    .ToListAsync();

                return Ok(new
                {
                    suppliers = supplierPerformance,
                    generatedAt = DateTime.Now
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thông tin supplier performance", error = ex.Message });
            }
        }

        private string GetTimeAgo(DateTime dateTime)
        {
            var timeSpan = DateTime.Now - dateTime;
            if (timeSpan.TotalDays >= 1)
                return $"{(int)timeSpan.TotalDays} ngày trước";
            else if (timeSpan.TotalHours >= 1)
                return $"{(int)timeSpan.TotalHours} giờ trước";
            else if (timeSpan.TotalMinutes >= 1)
                return $"{(int)timeSpan.TotalMinutes} phút trước";
            else
                return "Vừa xong";
        }
    }
}
*/