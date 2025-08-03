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
                var today = DateTime.Now.Date;
                var firstDayOfMonth = new DateTime(today.Year, today.Month, 1);
                var firstDayOfYear = new DateTime(today.Year, 1, 1);

                // Revenue calculations
                var totalRevenue = await _context.PhieuThus
                    .Where(pt => pt.TrangThai == "DaThu" && pt.NgayThu >= firstDayOfYear)
                    .SumAsync(pt => pt.SoTien);

                var monthlyRevenue = await _context.PhieuThus
                    .Where(pt => pt.TrangThai == "DaThu" && pt.NgayThu >= firstDayOfMonth)
                    .SumAsync(pt => pt.SoTien);

                // Fine calculations
                var pendingFines = await _context.PhieuThus
                    .Where(pt => pt.LoaiThu == "PhiPhat" && pt.TrangThai == "ChuaThu")
                    .SumAsync(pt => pt.SoTien);

                var overdueDate = today.AddDays(-30);
                var overdueFines = await _context.PhieuThus
                    .Where(pt => pt.LoaiThu == "PhiPhat" && 
                                pt.TrangThai == "ChuaThu" && 
                                pt.NgayTao < overdueDate)
                    .SumAsync(pt => pt.SoTien);

                // Transaction counts
                var todayTransactions = await _context.PhieuThus
                    .Where(pt => pt.NgayTao.Date == today)
                    .CountAsync();

                var monthlyTransactions = await _context.PhieuThus
                    .Where(pt => pt.NgayTao >= firstDayOfMonth)
                    .CountAsync();

                // Member statistics
                var totalMembers = await _context.DocGias.CountAsync();
                var activeMembers = await _context.DocGias
                    .Where(d => d.MemberStatus == "DaThanhToan")
                    .CountAsync();

                // Book statistics
                var totalBooks = await _context.Saches.CountAsync();
                var availableBooks = await _context.Saches
                    .Where(s => s.SoLuongConLai > 0)
                    .CountAsync();

                // Financial data (income vs expenses)
                var income = await _context.PhieuThus
                    .Where(pt => pt.TrangThai == "DaThu" && pt.NgayThu >= firstDayOfMonth)
                    .SumAsync(pt => pt.SoTien);

                // Mock expenses data (since we don't have expenses table yet)
                var expenses = income * 0.7m; // Assume 70% of income as expenses
                var profit = income - expenses;

                // Recent transactions
                var recentTransactions = await _context.PhieuThus
                    .Include(pt => pt.DocGia)
                    .OrderByDescending(pt => pt.NgayTao)
                    .Take(5)
                    .Select(pt => new
                    {
                        id = pt.MaPhieuThu,
                        type = pt.LoaiThu == "PhiPhat" ? "fine" : "income",
                        title = $"{pt.DocGia.HoTen} - {(pt.LoaiThu == "PhiPhat" ? "Tiền phạt" : "Phí thành viên")}",
                        amount = pt.SoTien,
                        time = GetTimeAgo(pt.NgayTao),
                        memberName = pt.DocGia.HoTen
                    })
                    .ToListAsync();

                var summary = new
                {
                    stats = new
                    {
                        totalRevenue = totalRevenue,
                        monthlyRevenue = monthlyRevenue,
                        pendingFines = pendingFines,
                        overdueFines = overdueFines,
                        todayTransactions = todayTransactions,
                        monthlyTransactions = monthlyTransactions,
                        totalMembers = totalMembers,
                        activeMembers = activeMembers,
                        totalBooks = totalBooks,
                        availableBooks = availableBooks
                    },
                    financialData = new
                    {
                        income = income,
                        expenses = expenses,
                        profit = profit
                    },
                    recentTransactions = recentTransactions,
                    generatedAt = DateTime.Now
                };

                return Ok(summary);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thông tin dashboard", error = ex.Message });
            }
        }

        // GET: api/AccountantDashboard/financial-overview?period=month
        [HttpGet("financial-overview")]
        public async Task<ActionResult<object>> GetFinancialOverview([FromQuery] string period = "month")
        {
            try
            {
                var (fromDate, toDate) = GetDateRangeFromPeriod(period);

                // Revenue by type
                var membershipFees = await _context.PhieuThus
                    .Where(pt => pt.LoaiThu == "PhiThanhVien" && 
                                pt.TrangThai == "DaThu" && 
                                pt.NgayThu >= fromDate && pt.NgayThu <= toDate)
                    .SumAsync(pt => pt.SoTien);

                var fineRevenue = await _context.PhieuThus
                    .Where(pt => pt.LoaiThu == "PhiPhat" && 
                                pt.TrangThai == "DaThu" && 
                                pt.NgayThu >= fromDate && pt.NgayThu <= toDate)
                    .SumAsync(pt => pt.SoTien);

                // Daily revenue trend
                var dailyRevenue = await _context.PhieuThus
                    .Where(pt => pt.TrangThai == "DaThu" && 
                                pt.NgayThu >= fromDate && pt.NgayThu <= toDate)
                    .GroupBy(pt => pt.NgayThu/*.Value*/.Date)
                    .Select(g => new
                    {
                        date = g.Key.ToString("yyyy-MM-dd"),
                        amount = g.Sum(pt => pt.SoTien)
                    })
                    .OrderBy(x => x.date)
                    .ToListAsync();

                // Top paying members
                var topMembers = await _context.PhieuThus
                    .Include(pt => pt.DocGia)
                    .Where(pt => pt.TrangThai == "DaThu" && 
                                pt.NgayThu >= fromDate && pt.NgayThu <= toDate)
                    .GroupBy(pt => new { pt.MaDG, pt.DocGia.HoTen })
                    .Select(g => new
                    {
                        memberName = g.Key.HoTen,
                        totalPaid = g.Sum(pt => pt.SoTien),
                        transactionCount = g.Count()
                    })
                    .OrderByDescending(x => x.totalPaid)
                    .Take(5)
                    .ToListAsync();

                var overview = new
                {
                    totalRevenue = membershipFees + fineRevenue,
                    membershipFees = membershipFees,
                    fineRevenue = fineRevenue,
                    dailyRevenue = dailyRevenue,
                    topMembers = topMembers,
                    period = $"{fromDate:dd/MM/yyyy} - {toDate:dd/MM/yyyy}",
                    generatedAt = DateTime.Now
                };

                return Ok(overview);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy tổng quan tài chính", error = ex.Message });
            }
        }

        // Helper method to get date range from period
        private (DateTime fromDate, DateTime toDate) GetDateRangeFromPeriod(string period)
        {
            var today = DateTime.Now.Date;
            
            return period?.ToLower() switch
            {
                "week" => (today.AddDays(-7), today),
                "month" => (today.AddDays(-30), today),
                "quarter" => (today.AddDays(-90), today),
                "year" => (today.AddDays(-365), today),
                _ => (today.AddDays(-30), today) // Default to month
            };
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