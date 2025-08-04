/*
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    public class AccountantDashboardController : ControllerBase
    {
        private readonly LibraryContext _context;

        public AccountantDashboardController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/AccountantDashboard/summary
        [HttpGet("summary")]
        public async Task<ActionResult<object>> GetAccountantSummary()
        {
            try
            {
                var today = DateTime.Today;
                var thisMonth = new DateTime(today.Year, today.Month, 1);
                var lastMonth = thisMonth.AddMonths(-1);

                // Financial overview
                var totalRevenue = await _context.PhieuThus
                    .Where(p => p.TrangThai == "Đã thu")
                    .SumAsync(p => p.SoTien);

                var monthlyRevenue = await _context.PhieuThus
                    .Where(p => p.TrangThai == "Đã thu" && p.NgayThu >= thisMonth)
                    .SumAsync(p => p.SoTien);

                var lastMonthRevenue = await _context.PhieuThus
                    .Where(p => p.TrangThai == "Đã thu" && p.NgayThu >= lastMonth && p.NgayThu < thisMonth)
                    .SumAsync(p => p.SoTien);

                // Transaction counts
                var totalTransactions = await _context.PhieuThus.CountAsync();
                var monthlyTransactions = await _context.PhieuThus
                    .Where(p => p.NgayThu >= thisMonth)
                    .CountAsync();

                // Revenue by type
                var revenueByType = await _context.PhieuThus
                    .Where(p => p.TrangThai == "Đã thu")
                    .GroupBy(p => p.LoaiThu)
                    .Select(g => new
                    {
                        type = g.Key,
                        amount = g.Sum(p => p.SoTien),
                        count = g.Count()
                    })
                    .ToListAsync();

                // Pending collections
                var pendingCollections = await _context.PhieuThus
                    .Where(p => p.TrangThai == "Chưa thu")
                    .SumAsync(p => p.SoTien);

                var pendingTransactions = await _context.PhieuThus
                    .Where(p => p.TrangThai == "Chưa thu")
                    .CountAsync();

                // Recent transactions
                var recentTransactions = await _context.PhieuThus
                    .Include(p => p.DocGia)
                    .OrderByDescending(p => p.NgayThu)
                    .Take(10)
                    .Select(p => new
                    {
                        id = p.MaPhieuThu,
                        type = p.LoaiThu,
                        amount = p.SoTien,
                        status = p.TrangThai,
                        date = p.NgayThu,
                        collector = p.NguoiThu,
                        description = p.GhiChu
                    })
                    .ToListAsync();

                // Monthly trends
                var monthlyTrends = await _context.PhieuThus
                    .Where(p => p.NgayThu >= lastMonth)
                    .GroupBy(p => new { p.NgayThu.Year, p.NgayThu.Month })
                    .Select(g => new
                    {
                        month = $"{g.Key.Year}-{g.Key.Month:D2}",
                        revenue = g.Sum(p => p.SoTien),
                        transactions = g.Count()
                    })
                    .OrderBy(x => x.month)
                    .ToListAsync();

                var summary = new
                {
                    overview = new
                    {
                        totalRevenue = totalRevenue,
                        monthlyRevenue = monthlyRevenue,
                        lastMonthRevenue = lastMonthRevenue,
                        revenueGrowth = lastMonthRevenue > 0 ? Math.Round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100, 1) : 0,
                        totalTransactions = totalTransactions,
                        monthlyTransactions = monthlyTransactions,
                        pendingCollections = pendingCollections,
                        pendingTransactions = pendingTransactions
                    },
                    revenueByType = revenueByType,
                    recentTransactions = recentTransactions,
                    monthlyTrends = monthlyTrends,
                    generatedAt = DateTime.Now
                };

                return Ok(summary);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thông tin accountant dashboard", error = ex.Message });
            }
        }

        // GET: api/AccountantDashboard/revenue-analysis
        [HttpGet("revenue-analysis")]
        public async Task<ActionResult<object>> GetRevenueAnalysis()
        {
            try
            {
                var today = DateTime.Today;
                var lastMonth = today.AddMonths(-1);

                // Revenue by day (last 30 days)
                var dailyRevenue = await _context.PhieuThus
                    .Where(pt => pt.TrangThai == "DaThu" && 
                                pt.NgayThu >= fromDate && pt.NgayThu <= toDate)
                    .GroupBy(pt => pt.NgayThu/*.Value*/.Date)
                    .Select(g => new
                    {
                        date = g.Key.ToString("yyyy-MM-dd"),
                        revenue = g.Sum(p => p.SoTien),
                        transactions = g.Count()
                    })
                    .OrderBy(x => x.date)
                    .ToListAsync();

                // Revenue by payment method
                var revenueByPaymentMethod = await _context.PhieuThus
                    .Where(p => p.TrangThai == "Đã thu")
                    .GroupBy(p => p.HinhThucThanhToan)
                    .Select(g => new
                    {
                        method = g.Key,
                        amount = g.Sum(p => p.SoTien),
                        count = g.Count(),
                        percentage = 0.0 // Will be calculated in frontend
                    })
                    .ToListAsync();

                // Top revenue sources
                var topRevenueSources = await _context.PhieuThus
                    .Where(p => p.TrangThai == "Đã thu")
                    .GroupBy(p => p.LoaiThu)
                    .Select(g => new
                    {
                        source = g.Key,
                        amount = g.Sum(p => p.SoTien),
                        count = g.Count()
                    })
                    .OrderByDescending(x => x.amount)
                    .Take(5)
                    .ToListAsync();

                var analysis = new
                {
                    dailyRevenue = dailyRevenue,
                    revenueByPaymentMethod = revenueByPaymentMethod,
                    topRevenueSources = topRevenueSources,
                    generatedAt = DateTime.Now
                };

                return Ok(analysis);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy phân tích doanh thu", error = ex.Message });
            }
        }
    }
}
*/