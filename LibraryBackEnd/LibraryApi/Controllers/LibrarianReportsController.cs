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
    public class LibrarianReportsController : ControllerBase
    {
        private readonly LibraryContext _context;

        public LibrarianReportsController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/LibrarianReports/overview?period=month
        [HttpGet("overview")]
        public async Task<ActionResult<object>> GetOverviewReport([FromQuery] string period = "month")
        {
            try
            {
                var (fromDate, toDate) = GetDateRangeFromPeriod(period);

                // Basic statistics
                var totalBooks = await _context.Saches.CountAsync();
                var totalReaders = await _context.DocGias.CountAsync();
                
                var totalBorrows = await _context.PhieuMuons
                    .Where(p => p.NgayMuon >= fromDate && p.NgayMuon <= toDate)
                    .CountAsync();

                var totalReturns = await _context.PhieuMuons
                    .Where(p => p.NgayTra.HasValue && p.NgayTra >= fromDate && p.NgayTra <= toDate)
                    .CountAsync();

                var overdueBooks = await _context.PhieuMuons
                    .Where(p => p.TrangThai == "borrowed" && p.HanTra < DateTime.Now)
                    .CountAsync();

                var totalFines = await _context.PhieuThus
                    .Where(pt => pt.LoaiThu == "PhiPhat" && pt.NgayThu >= fromDate && pt.NgayThu <= toDate)
                    .SumAsync(pt => pt.SoTien);

                // Popular books (most borrowed)
                var popularBooks = await _context.CT_PhieuMuons
                    .Include(ct => ct.Sach)
                    .Include(ct => ct.PhieuMuon)
                    .Where(ct => ct.PhieuMuon.NgayMuon >= fromDate && ct.PhieuMuon.NgayMuon <= toDate)
                    .GroupBy(ct => new { ct.MaSach, ct.Sach.TenSach })
                    .Select(g => new
                    {
                        title = g.Key.TenSach,
                        borrows = g.Count()
                    })
                    .OrderByDescending(x => x.borrows)
                    .Take(5)
                    .ToListAsync();

                // Category statistics
                var categoryStats = await _context.CT_PhieuMuons
                    .Include(ct => ct.Sach)
                    .Include(ct => ct.PhieuMuon)
                    .Where(ct => ct.PhieuMuon.NgayMuon >= fromDate && ct.PhieuMuon.NgayMuon <= toDate)
                    .GroupBy(ct => ct.Sach.TheLoai ?? "Không xác định")
                    .Select(g => new
                    {
                        category = g.Key,
                        count = g.Count()
                    })
                    .OrderByDescending(x => x.count)
                    .Take(5)
                    .ToListAsync();

                var result = new
                {
                    totalBooks = totalBooks,
                    totalReaders = totalReaders,
                    totalBorrows = totalBorrows,
                    totalReturns = totalReturns,
                    overdueBooks = overdueBooks,
                    totalFines = totalFines,
                    popularBooks = popularBooks,
                    categoryStats = categoryStats,
                    reportPeriod = $"{fromDate:dd/MM/yyyy} - {toDate:dd/MM/yyyy}",
                    generatedAt = DateTime.Now
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tạo báo cáo tổng quan", error = ex.Message });
            }
        }

        // GET: api/LibrarianReports/borrowing?period=month
        [HttpGet("borrowing")]
        public async Task<ActionResult<object>> GetBorrowingReport([FromQuery] string period = "month")
        {
            try
            {
                var (fromDate, toDate) = GetDateRangeFromPeriod(period);

                // Daily borrowing statistics
                var dailyStats = new List<object>();
                for (var date = fromDate.Date; date <= toDate.Date; date = date.AddDays(1))
                {
                    var nextDay = date.AddDays(1);
                    
                    var borrows = await _context.PhieuMuons
                        .Where(p => p.NgayMuon >= date && p.NgayMuon < nextDay)
                        .CountAsync();

                    var returns = await _context.PhieuMuons
                        .Where(p => p.NgayTra.HasValue && p.NgayTra >= date && p.NgayTra < nextDay)
                        .CountAsync();

                    dailyStats.Add(new
                    {
                        date = date.ToString("yyyy-MM-dd"),
                        borrows = borrows,
                        returns = returns
                    });
                }

                // Top readers (most active borrowers)
                var readerStats = await _context.PhieuMuons
                    .Include(p => p.DocGia)
                    .Where(p => p.NgayMuon >= fromDate && p.NgayMuon <= toDate)
                    .GroupBy(p => new { p.MaDG, p.DocGia.HoTen })
                    .Select(g => new
                    {
                        reader = g.Key.HoTen,
                        borrows = g.Count(),
                        returns = g.Count(p => p.NgayTra.HasValue)
                    })
                    .OrderByDescending(x => x.borrows)
                    .Take(5)
                    .ToListAsync();

                // Borrowing trends
                var weeklyTrends = await _context.PhieuMuons
                    .Where(p => p.NgayMuon >= fromDate && p.NgayMuon <= toDate)
                    .GroupBy(p => new { 
                        Year = p.NgayMuon.Year, 
                        Week = (p.NgayMuon.DayOfYear - 1) / 7 + 1 
                    })
                    .Select(g => new
                    {
                        week = $"Tuần {g.Key.Week}/{g.Key.Year}",
                        count = g.Count()
                    })
                    .OrderBy(x => x.week)
                    .ToListAsync();

                var result = new
                {
                    dailyStats = dailyStats,
                    readerStats = readerStats,
                    weeklyTrends = weeklyTrends,
                    totalBorrows = dailyStats.Sum(d => (int)((dynamic)d).borrows),
                    totalReturns = dailyStats.Sum(d => (int)((dynamic)d).returns),
                    reportPeriod = $"{fromDate:dd/MM/yyyy} - {toDate:dd/MM/yyyy}",
                    generatedAt = DateTime.Now
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tạo báo cáo mượn trả", error = ex.Message });
            }
        }

        // GET: api/LibrarianReports/overdue
        [HttpGet("overdue")]
        public async Task<ActionResult<object>> GetOverdueReport()
        {
            try
            {
                var today = DateTime.Now.Date;

                // List of overdue books
                var overdueBooks = await _context.PhieuMuons
                    .Include(p => p.DocGia)
                    .Include(p => p.CT_PhieuMuons)
                        .ThenInclude(ct => ct.Sach)
                    .Where(p => p.TrangThai == "borrowed" && p.HanTra < today)
                    .SelectMany(p => p.CT_PhieuMuons.Select(ct => new
                    {
                        reader = p.DocGia.HoTen,
                        readerId = p.MaDG,
                        book = ct.Sach.TenSach,
                        bookId = ct.MaSach,
                        dueDate = p.HanTra.ToString("yyyy-MM-dd"),
                        borrowDate = p.NgayMuon.ToString("yyyy-MM-dd"),
                        daysOverdue = (int)(today - p.HanTra).TotalDays,
                        fine = CalculateOverdueFine(p.HanTra, today),
                        phieuMuonId = p.MaPhieuMuon
                    }))
                    .OrderByDescending(x => x.daysOverdue)
                    .ToListAsync();

                // Summary statistics
                var totalOverdue = overdueBooks.Count();
                var totalFines = overdueBooks.Sum(x => x.fine);

                // Overdue by days ranges
                var overdueRanges = new
                {
                    oneToThreeDays = overdueBooks.Count(x => x.daysOverdue >= 1 && x.daysOverdue <= 3),
                    fourToSevenDays = overdueBooks.Count(x => x.daysOverdue >= 4 && x.daysOverdue <= 7),
                    moreThanSevenDays = overdueBooks.Count(x => x.daysOverdue > 7)
                };

                // Top overdue readers
                var topOverdueReaders = overdueBooks
                    .GroupBy(x => new { x.reader, x.readerId })
                    .Select(g => new
                    {
                        reader = g.Key.reader,
                        readerId = g.Key.readerId,
                        overdueCount = g.Count(),
                        totalFine = g.Sum(x => x.fine)
                    })
                    .OrderByDescending(x => x.overdueCount)
                    .Take(5)
                    .ToList();

                var result = new
                {
                    overdueBooks = overdueBooks,
                    totalOverdue = totalOverdue,
                    totalFines = totalFines,
                    overdueRanges = overdueRanges,
                    topOverdueReaders = topOverdueReaders,
                    reportDate = today.ToString("dd/MM/yyyy"),
                    generatedAt = DateTime.Now
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tạo báo cáo quá hạn", error = ex.Message });
            }
        }

        // GET: api/LibrarianReports/summary?period=month
        [HttpGet("summary")]
        public async Task<ActionResult<object>> GetReportsSummary([FromQuery] string period = "month")
        {
            try
            {
                var (fromDate, toDate) = GetDateRangeFromPeriod(period);

                var overview = await GetOverviewReport(period);
                var borrowing = await GetBorrowingReport(period);
                var overdue = await GetOverdueReport();

                if (overview.Result is OkObjectResult overviewResult &&
                    borrowing.Result is OkObjectResult borrowingResult &&
                    overdue.Result is OkObjectResult overdueResult)
                {
                    return Ok(new
                    {
                        overview = overviewResult.Value,
                        borrowing = borrowingResult.Value,
                        overdue = overdueResult.Value,
                        reportPeriod = $"{fromDate:dd/MM/yyyy} - {toDate:dd/MM/yyyy}",
                        generatedAt = DateTime.Now
                    });
                }

                return StatusCode(500, "Error generating summary report");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tạo báo cáo tổng hợp", error = ex.Message });
            }
        }

        // Helper method to calculate overdue fine
        private decimal CalculateOverdueFine(DateTime dueDate, DateTime currentDate)
        {
            var daysOverdue = (int)(currentDate - dueDate).TotalDays;
            if (daysOverdue <= 0) return 0;

            // Simple fine calculation: 5000 VND per day overdue
            const decimal finePerDay = 5000;
            return daysOverdue * finePerDay;
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
    }
}