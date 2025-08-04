
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    public class StockReportsController : ControllerBase
    {
        private readonly LibraryContext _context;

        public StockReportsController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/StockReports
        [HttpGet]
        public async Task<ActionResult<object>> GetStockReports(
            [FromQuery] string type = "all",
            [FromQuery] string status = "all",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                // For now, we'll create mock reports since there's no dedicated reports table
                // In a real system, you'd have a StockReports table
                var reports = new List<object>();

                // Generate dynamic reports based on current stock status
                var lowStockBooks = await _context.Saches
                    .Where(s => s.SoLuong.HasValue && s.SoLuong.Value <= 5 && s.SoLuong.Value > 0)
                    .ToListAsync();

                var outOfStockBooks = await _context.Saches
                    .Where(s => s.SoLuong.HasValue && s.SoLuong.Value == 0)
                    .ToListAsync();

                var damagedBooks = await _context.Saches
                    .Where(s => s.TrangThai == "HuHong" || s.TrangThai == "CanKiemTra")
                    .ToListAsync();

                // Create low stock report
                if (lowStockBooks.Any() && (type == "all" || type == "low-stock"))
                {
                    reports.Add(new
                    {
                        id = 1,
                        reportNumber = $"BC-LS-{DateTime.Now:yyyyMMdd}",
                        title = $"Báo cáo sách sắp hết - {DateTime.Now:dd/MM/yyyy}",
                        type = "low-stock",
                        priority = "high",
                        status = "active",
                        reportedBy = "Hệ thống",
                        reportDate = DateTime.Now.ToString("yyyy-MM-dd"),
                        affectedBooks = lowStockBooks.Count,
                        estimatedLoss = 0,
                        description = $"{lowStockBooks.Count} đầu sách sắp hết, cần bổ sung gấp",
                        actions = "Cần đặt hàng bổ sung",
                        details = lowStockBooks.Select(b => new
                        {
                            bookId = b.MaSach,
                            bookTitle = b.TenSach,
                            currentStock = b.SoLuong.HasValue ? b.SoLuong.Value : 0,
                            location = b.KeSach
                        }).ToList()
                    });
                }

                // Create out of stock report
                if (outOfStockBooks.Any() && (type == "all" || type == "out-of-stock"))
                {
                    reports.Add(new
                    {
                        id = 2,
                        reportNumber = $"BC-OS-{DateTime.Now:yyyyMMdd}",
                        title = $"Báo cáo sách hết hàng - {DateTime.Now:dd/MM/yyyy}",
                        type = "out-of-stock",
                        priority = "critical",
                        status = "active",
                        reportedBy = "Hệ thống",
                        reportDate = DateTime.Now.ToString("yyyy-MM-dd"),
                        affectedBooks = outOfStockBooks.Count,
                        estimatedLoss = 0,
                        description = $"{outOfStockBooks.Count} đầu sách đã hết hàng, cần nhập ngay",
                        actions = "Cần nhập hàng khẩn cấp",
                        details = outOfStockBooks.Select(b => new
                        {
                            bookId = b.MaSach,
                            bookTitle = b.TenSach,
                            lastStock = b.SoLuong ?? 0,
                            location = b.KeSach
                        }).ToList()
                    });
                }

                // Create damaged books report
                if (damagedBooks.Any() && (type == "all" || type == "damaged"))
                {
                    reports.Add(new
                    {
                        id = 3,
                        reportNumber = $"BC-DM-{DateTime.Now:yyyyMMdd}",
                        title = $"Báo cáo sách hư hỏng - {DateTime.Now:dd/MM/yyyy}",
                        type = "damaged",
                        priority = "medium",
                        status = "investigating",
                        reportedBy = "Hệ thống",
                        reportDate = DateTime.Now.ToString("yyyy-MM-dd"),
                        affectedBooks = damagedBooks.Count,
                        estimatedLoss = damagedBooks.Sum(b => b.GiaSach ?? 0),
                        description = $"{damagedBooks.Count} cuốn sách bị hư hỏng, cần xử lý",
                        actions = "Đánh giá và quyết định sửa chữa hoặc loại bỏ",
                        details = damagedBooks.Select(b => new
                        {
                            bookId = b.MaSach,
                            bookTitle = b.TenSach,
                            condition = b.TrangThai,
                            estimatedValue = b.GiaSach ?? 0,
                            location = b.KeSach
                        }).ToList()
                    });
                }

                // Apply status filter
                if (status != "all")
                {
                    reports = reports.Where(r => ((dynamic)r).status == status).ToList();
                }

                // Apply pagination
                var totalCount = reports.Count;
                var paginatedReports = reports.Skip((page - 1) * pageSize).Take(pageSize).ToList();

                // Calculate summary statistics
                var totalAffectedBooks = reports.Sum(r => ((dynamic)r).affectedBooks);
                var totalEstimatedLoss = reports.Sum(r => ((dynamic)r).estimatedLoss);

                var result = new
                {
                    reports = paginatedReports,
                    pagination = new
                    {
                        page = page,
                        pageSize = pageSize,
                        totalCount = totalCount,
                        totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                    },
                    summary = new
                    {
                        totalReports = totalCount,
                        totalAffectedBooks = totalAffectedBooks,
                        totalEstimatedLoss = totalEstimatedLoss,
                        reportsByType = new
                        {
                            lowStock = reports.Count(r => ((dynamic)r).type == "low-stock"),
                            outOfStock = reports.Count(r => ((dynamic)r).type == "out-of-stock"),
                            damaged = reports.Count(r => ((dynamic)r).type == "damaged")
                        }
                    }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy báo cáo kho", error = ex.Message });
            }
        }

        // GET: api/StockReports/statistics
        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetStockStatistics()
        {
            try
            {
                var today = DateTime.Now.Date;
                var thisMonth = new DateTime(today.Year, today.Month, 1);
                var lastMonth = thisMonth.AddMonths(-1);

                var stats = new
                {
                    currentStock = new
                    {
                        totalBooks = await _context.Saches.SumAsync(s => s.SoLuong ?? 0),
                        availableBooks = await _context.Saches.SumAsync(s => s.SoLuong.HasValue ? s.SoLuong.Value : 0),
                        uniqueTitles = await _context.Saches.CountAsync()
                    },
                    alerts = new
                    {
                        lowStockCount = await _context.Saches.CountAsync(s => s.SoLuong.HasValue && s.SoLuong.Value > 0 && s.SoLuong.Value <= 5),
                        outOfStockCount = await _context.Saches.CountAsync(s => s.SoLuong.HasValue && s.SoLuong.Value == 0),
                        damagedCount = await _context.Saches.CountAsync(s => s.TrangThai == "HuHong" || s.TrangThai == "CanKiemTra")
                    },
                    monthlyActivity = new
                    {
                        thisMonth = new
                        {
                            importsCount = await _context.PhieuNhapKhos.CountAsync(p => p.NgayNhap >= thisMonth),
                            totalImported = await _context.ChiTietPhieuNhapKhos
                                .Include(ct => ct.PhieuNhapKho)
                                .Where(ct => ct.PhieuNhapKho.NgayNhap >= thisMonth)
                                .SumAsync(ct => ct.SoLuong)
                        },
                        lastMonth = new
                        {
                            importsCount = await _context.PhieuNhapKhos.CountAsync(p => p.NgayNhap >= lastMonth && p.NgayNhap < thisMonth),
                            totalImported = await _context.ChiTietPhieuNhapKhos
                                .Include(ct => ct.PhieuNhapKho)
                                .Where(ct => ct.PhieuNhapKho.NgayNhap >= lastMonth && ct.PhieuNhapKho.NgayNhap < thisMonth)
                                .SumAsync(ct => ct.SoLuong)
                        }
                    },
                    topCategories = await _context.Saches
                        .GroupBy(s => s.TheLoai ?? "Không xác định")
                        .Select(g => new
                        {
                            category = g.Key,
                            totalBooks = g.Sum(s => s.SoLuong ?? 0),
                            availableBooks = g.Sum(s => s.SoLuong.HasValue ? s.SoLuong.Value : 0),
                            lowStockItems = g.Count(s => s.SoLuong.HasValue && s.SoLuong.Value > 0 && s.SoLuong.Value <= 5)
                        })
                        .OrderByDescending(x => x.totalBooks)
                        .Take(5)
                        .ToListAsync(),
                    generatedAt = DateTime.Now
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thống kê kho", error = ex.Message });
            }
        }

        // GET: api/StockReports/low-stock-details
        [HttpGet("low-stock-details")]
        public async Task<ActionResult<object>> GetLowStockDetails([FromQuery] int threshold = 5)
        {
            try
            {
                var lowStockBooks = await _context.Saches
                    .Where(s => s.SoLuong.HasValue && s.SoLuong.Value <= threshold && s.SoLuong.Value > 0)
                    .OrderBy(s => s.SoLuong.Value)
                    .Select(s => new
                    {
                        id = s.MaSach,
                        bookTitle = s.TenSach,
                        author = s.TacGia,
                        category = s.TheLoai,
                        currentStock = s.SoLuongConLai,
                        totalStock = s.SoLuong ?? 0,
                        location = s.KeSach ?? "Chưa phân kệ",
                        price = s.GiaSach ?? 0,
                        alertLevel = s.SoLuongConLai == 0 ? "critical" : 
                                   s.SoLuongConLai <= 2 ? "critical" : "warning",
                        recommendedOrder = Math.Max(10 - (byte)s.SoLuongConLai, 5) // Simple recommendation
                    })
                    .ToListAsync();

                var totalValue = lowStockBooks.Sum(b => b.price * b.recommendedOrder);

                return Ok(new
                {
                    lowStockBooks = lowStockBooks,
                    summary = new
                    {
                        totalItems = lowStockBooks.Count,
                        criticalItems = lowStockBooks.Count(b => b.alertLevel == "critical"),
                        warningItems = lowStockBooks.Count(b => b.alertLevel == "warning"),
                        totalRecommendedOrder = lowStockBooks.Sum(b => b.recommendedOrder),
                        estimatedOrderValue = totalValue
                    },
                    threshold = threshold
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy chi tiết sách sắp hết", error = ex.Message });
            }
        }

        // GET: api/StockReports/damaged-books
        [HttpGet("damaged-books")]
        public async Task<ActionResult<object>> GetDamagedBooksReport()
        {
            try
            {
                var damagedBooks = await _context.Saches
                    .Where(s => s.TrangThai == "HuHong" || s.TrangThai == "CanKiemTra")
                    .Select(s => new
                    {
                        id = s.MaSach,
                        bookTitle = s.TenSach,
                        author = s.TacGia,
                        category = s.TheLoai,
                        condition = s.TrangThai,
                        quantity = s.SoLuong ?? 0,
                        availableQuantity = s.SoLuongConLai,
                        location = s.KeSach ?? "Chưa phân kệ",
                        estimatedValue = s.GiaSach ?? 0,
                        //lastUpdated = s.NgayCapNhat?.ToString("yyyy-MM-dd")
                    })
                    .OrderBy(s => s.bookTitle)
                    .ToListAsync();

                var totalValue = damagedBooks.Sum(b => b.estimatedValue * b.quantity);

                return Ok(new
                {
                    damagedBooks = damagedBooks,
                    summary = new
                    {
                        totalDamagedBooks = damagedBooks.Sum(b => b.quantity),
                        totalDamagedTitles = damagedBooks.Count,
                        totalEstimatedLoss = totalValue,
                        byCondition = damagedBooks.GroupBy(b => b.condition)
                            .Select(g => new
                            {
                                condition = g.Key,
                                count = g.Count(),
                                totalQuantity = g.Sum(b => b.quantity)
                            })
                            .ToList()
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy báo cáo sách hư hỏng", error = ex.Message });
            }
        }

        // GET: api/StockReports/import-history
        [HttpGet("import-history")]
        public async Task<ActionResult<object>> GetImportHistory([FromQuery] int months = 6)
        {
            try
            {
                var fromDate = DateTime.Now.AddMonths(-months);

                var importHistory = await _context.PhieuNhapKhos
                    .Include(p => p.ChiTietPhieuNhapKho)
                        .ThenInclude(ct => ct.MaSach)
                    .Where(p => p.NgayNhap >= fromDate)
                    .OrderByDescending(p => p.NgayNhap)
                    .Select(p => new
                    {
                        id = p.Id,
                        importCode = p.MaPhieu,
                        importDate = p.NgayNhap.ToString("yyyy-MM-dd"),
                        supplier = p.NhaCungCap,
                        totalItems = p.ChiTietPhieuNhapKho.Count,
                        totalQuantity = p.ChiTietPhieuNhapKho.Sum(ct => ct.SoLuong),
                        totalValue = p.ChiTietPhieuNhapKho.Sum(ct => ct.SoLuong * ct.DonGia),
                        status = p.TrangThai,
                        books = p.ChiTietPhieuNhapKho.Select(ct => new
                        {
                            bookTitle = ct.TenSach,
                            quantity = ct.SoLuong,
                            unitPrice = ct.DonGia,
                            totalPrice = ct.SoLuong * ct.DonGia
                        }).ToList()
                    })
                    .ToListAsync();

                var monthlyTrends = importHistory
                    .GroupBy(i => i.importDate.Substring(0, 7)) // Group by YYYY-MM
                    .Select(g => new
                    {
                        month = g.Key,
                        importsCount = g.Count(),
                        totalQuantity = g.Sum(i => i.totalQuantity),
                        totalValue = g.Sum(i => i.totalValue)
                    })
                    .OrderBy(x => x.month)
                    .ToList();

                return Ok(new
                {
                    importHistory = importHistory,
                    summary = new
                    {
                        totalImports = importHistory.Count,
                        totalQuantityImported = importHistory.Sum(i => i.totalQuantity),
                        totalValueImported = importHistory.Sum(i => i.totalValue),
                        averageImportValue = importHistory.Count > 0 ? importHistory.Average(i => i.totalValue) : 0
                    },
                    monthlyTrends = monthlyTrends,
                    period = $"{fromDate:yyyy-MM-dd} to {DateTime.Now:yyyy-MM-dd}"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy lịch sử nhập kho", error = ex.Message });
            }
        }
    }
}
