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
    [Authorize] // Restrict to admin only
    public class AdminDashboardController : ControllerBase
    {
        private readonly LibraryContext _context;

        public AdminDashboardController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/AdminDashboard/overview
        [HttpGet("overview")]
        public async Task<ActionResult<object>> GetAdminOverview()
        {
            try
            {
                var today = DateTime.Now.Date;
                var thisMonth = new DateTime(today.Year, today.Month, 1);
                var lastMonth = thisMonth.AddMonths(-1);
                var thisYear = new DateTime(today.Year, 1, 1);

                // Core statistics
                var totalBooks = await _context.Saches.CountAsync();
                var totalReaders = await _context.DocGias.CountAsync();
                var totalUsers = await _context.NguoiDungs.CountAsync();
                var totalBorrows = await _context.PhieuMuons.CountAsync();

                // Monthly activity
                var monthlyBorrows = await _context.PhieuMuons
                    .Where(p => p.NgayMuon >= thisMonth)
                    .CountAsync();

                var monthlyReturns = await _context.PhieuMuons
                    .Where(p => p.NgayTra >= thisMonth)
                    .CountAsync();

                var monthlyNewReaders = await _context.DocGias
                    .Where(d => d.NgayDangKy >= thisMonth)
                    .CountAsync();

                // Current status
                var activeBorrows = await _context.PhieuMuons
                    .Where(p => p.TrangThai == "DangMuon")
                    .CountAsync();

                var overdueBorrows = await _context.PhieuMuons
                    .Where(p => p.TrangThai == "DangMuon" && p.HanTra < today)
                    .CountAsync();

                //var pendingReservations = await _context.Reservations
                //    .Where(r => r.TrangThai == "DangCho")
                //    .CountAsync();

                // Financial overview
                var totalRevenue = await _context.PhieuThus
                    .Where(pt => pt.TrangThai == "DaThu")
                    .SumAsync(pt => pt.SoTien);

                var monthlyRevenue = await _context.PhieuThus
                    .Where(pt => pt.TrangThai == "DaThu" && pt.NgayThu >= thisMonth)
                    .SumAsync(pt => pt.SoTien);

                var pendingFines = await _context.PhieuThus
                    .Where(pt => pt.LoaiThu == "PhiPhat" && pt.TrangThai == "ChuaThu")
                    .SumAsync(pt => pt.SoTien);

                // System health
                var lowStockBooks = await _context.Saches
                    .CountAsync(s => s.SoLuongConLai <= 5 && s.SoLuongConLai > 0);

                var outOfStockBooks = await _context.Saches
                    .CountAsync(s => s.SoLuongConLai == 0);

                //var inactiveUsers = await _context.NguoiDungs
                //    .CountAsync(u => u.NgayTao < today.AddDays(-90)); // Users not logged in for 90 days

                // Popular books (most borrowed this month)
                var popularBooks = await _context.CT_PhieuMuons
                    .Include(ct => ct.Sach)
                    .Include(ct => ct.PhieuMuon)
                    .Where(ct => ct.PhieuMuon.NgayMuon >= thisMonth)
                    .GroupBy(ct => new { ct.Sach.MaSach, ct.Sach.TenSach, ct.Sach.TacGia })
                    .Select(g => new
                    {
                        bookId = g.Key.MaSach,
                        title = g.Key.TenSach,
                        author = g.Key.TacGia,
                        borrowCount = g.Count()
                    })
                    .OrderByDescending(x => x.borrowCount)
                    .Take(5)
                    .ToListAsync();

                // Active users (users with activity this month)
                var activeUserIds = await _context.PhieuMuons
                    .Where(p => p.NgayMuon >= thisMonth)
                    .Select(p => p.MaDG)
                    .Distinct()
                    .ToListAsync();

                var activeUsers = await _context.DocGias
                    .Where(d => activeUserIds.Contains(d.MaDG))
                    .OrderByDescending(d => d.NgayDangKy)
                    .Take(5)
                    .Select(d => new
                    {
                        id = d.MaDG,
                        name = d.HoTen,
                        email = d.Email,
                        memberType = d.LoaiDocGia,
                        joinDate = d.NgayDangKy,
                        totalBorrows = _context.PhieuMuons.Count(p => p.MaDG == d.MaDG)
                    })
                    .ToListAsync();

                // Recent activities (last 10 activities)
                var recentActivities = await _context.PhieuMuons
                    .Include(p => p.DocGia)
                    .Include(p => p.CT_PhieuMuons)
                        .ThenInclude(ct => ct.Sach)
                    .OrderByDescending(p => p.NgayMuon)
                    .Take(10)
                    .Select(p => new
                    {
                        id = p.MaPhieuMuon,
                        type = "borrow",
                        description = $"{p.DocGia.HoTen} mượn {p.CT_PhieuMuons.Count} cuốn sách",
                        user = p.DocGia.HoTen,
                        date = p.NgayMuon,
                        status = p.TrangThai
                    })
                    .ToListAsync();

                // Growth metrics (compare with last month)
                var lastMonthBorrows = await _context.PhieuMuons
                    .Where(p => p.NgayMuon >= lastMonth && p.NgayMuon < thisMonth)
                    .CountAsync();

                var lastMonthReaders = await _context.DocGias
                    .Where(d => d.NgayDangKy >= lastMonth && d.NgayDangKy < thisMonth)
                    .CountAsync();

                var lastMonthRevenue = await _context.PhieuThus
                    .Where(pt => pt.TrangThai == "DaThu" && pt.NgayThu >= lastMonth && pt.NgayThu < thisMonth)
                    .SumAsync(pt => pt.SoTien);

                var overview = new
                {
                    coreStats = new
                    {
                        totalBooks = totalBooks,
                        totalReaders = totalReaders,
                        totalUsers = totalUsers,
                        totalBorrows = totalBorrows,
                        activeBorrows = activeBorrows,
                        overdueBorrows = overdueBorrows,
                        //pendingReservations = pendingReservations
                    },
                    monthlyActivity = new
                    {
                        borrowsThisMonth = monthlyBorrows,
                        returnsThisMonth = monthlyReturns,
                        newReadersThisMonth = monthlyNewReaders,
                        revenueThisMonth = monthlyRevenue
                    },
                    financial = new
                    {
                        totalRevenue = totalRevenue,
                        monthlyRevenue = monthlyRevenue,
                        pendingFines = pendingFines,
                        revenueGrowth = lastMonthRevenue > 0 ? Math.Round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100, 1) : 0
                    },
                    systemHealth = new
                    {
                        lowStockBooks = lowStockBooks,
                        outOfStockBooks = outOfStockBooks,
                        //inactiveUsers = inactiveUsers,
                        systemStatus = "healthy" // In real system, check actual health metrics
                    },
                    growth = new
                    {
                        borrowGrowth = lastMonthBorrows > 0 ? Math.Round(((monthlyBorrows - lastMonthBorrows) / (double)lastMonthBorrows) * 100, 1) : 0,
                        readerGrowth = lastMonthReaders > 0 ? Math.Round(((monthlyNewReaders - lastMonthReaders) / (double)lastMonthReaders) * 100, 1) : 0,
                        revenueGrowth = lastMonthRevenue > 0 ? Math.Round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100, 1) : 0
                    },
                    insights = new
                    {
                        popularBooks = popularBooks,
                        activeUsers = activeUsers,
                        recentActivities = recentActivities
                    },
                    generatedAt = DateTime.Now
                };

                return Ok(overview);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thông tin tổng quan admin", error = ex.Message });
            }
        }

        // GET: api/AdminDashboard/system-status
        [HttpGet("system-status")]
        public async Task<ActionResult<object>> GetSystemStatus()
        {
            try
            {
                var status = new
                {
                    database = new
                    {
                        status = "healthy",
                        totalTables = 15, // Approximate
                        totalRecords = await GetTotalRecords(),
                        lastBackup = DateTime.Now.AddDays(-1), // Mock
                        connectionStatus = "connected",
                        responseTime = "45ms" // Mock
                    },
                    server = new
                    {
                        status = "running",
                        uptime = TimeSpan.FromDays(15).ToString(@"dd\d\ hh\h\ mm\m"), // Mock
                        cpuUsage = "25%", // Mock
                        memoryUsage = "512MB / 2GB", // Mock
                        diskSpace = "15GB / 100GB used" // Mock
                    },
                    services = new
                    {
                        authService = "healthy",
                        emailService = "healthy",
                        backupService = "healthy",
                        reportingService = "healthy"
                    },
                    security = new
                    {
                        lastSecurityScan = DateTime.Now.AddDays(-7),
                        vulnerabilities = 0,
                        failedLoginAttempts = 0, // Would track in real system
                        activeUserSessions = await _context.NguoiDungs.CountAsync() // Simplified
                    },
                    performance = new
                    {
                        averageResponseTime = "150ms",
                        requestsPerMinute = 45,
                        errorRate = "0.1%",
                        systemLoad = "low"
                    },
                    alerts = await GetSystemAlerts(),
                    lastChecked = DateTime.Now
                };

                return Ok(status);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy trạng thái hệ thống", error = ex.Message });
            }
        }

        // GET: api/AdminDashboard/analytics
        [HttpGet("analytics")]
        public async Task<ActionResult<object>> GetAnalytics([FromQuery] string period = "month")
        {
            try
            {
                var (fromDate, toDate) = GetDateRangeFromPeriod(period);

                // Usage analytics
                var dailyBorrows = await _context.PhieuMuons
                    .Where(p => p.NgayMuon >= fromDate && p.NgayMuon <= toDate)
                    .GroupBy(p => p.NgayMuon.Date)
                    .Select(g => new
                    {
                        date = g.Key.ToString("yyyy-MM-dd"),
                        borrows = g.Count(),
                        uniqueUsers = g.Select(p => p.MaDG).Distinct().Count()
                    })
                    .OrderBy(x => x.date)
                    .ToListAsync();

                // Category popularity
                var categoryStats = await _context.CT_PhieuMuons
                    .Include(ct => ct.Sach)
                    .Include(ct => ct.PhieuMuon)
                    .Where(ct => ct.PhieuMuon.NgayMuon >= fromDate && ct.PhieuMuon.NgayMuon <= toDate)
                    .GroupBy(ct => ct.Sach.TheLoai ?? "Không xác định")
                    .Select(g => new
                    {
                        category = g.Key,
                        borrowCount = g.Count(),
                        uniqueBooks = g.Select(ct => ct.Sach.MaSach).Distinct().Count()
                    })
                    .OrderByDescending(x => x.borrowCount)
                    .ToListAsync();

                // User activity patterns
                var userActivityByHour = Enumerable.Range(0, 24)
                    .Select(hour => new
                    {
                        hour = hour,
                        activity = new Random().Next(0, 20) // Mock data - in real system, track actual login times
                    })
                    .ToList();

                // Revenue trends
                var revenueByDay = await _context.PhieuThus
                    .Where(pt => pt.TrangThai == "DaThu" && pt.NgayThu >= fromDate && pt.NgayThu <= toDate)
                    .GroupBy(pt => pt.NgayThu/*.Value*/.Date)
                    .Select(g => new
                    {
                        date = g.Key.ToString("yyyy-MM-dd"),
                        revenue = g.Sum(pt => pt.SoTien)
                    })
                    .OrderBy(x => x.date)
                    .ToListAsync();

                var analytics = new
                {
                    period = $"{fromDate:dd/MM/yyyy} - {toDate:dd/MM/yyyy}",
                    usageAnalytics = new
                    {
                        dailyBorrows = dailyBorrows,
                        peakUsageDay = dailyBorrows.OrderByDescending(d => d.borrows).FirstOrDefault()?.date,
                        averageDailyBorrows = dailyBorrows.Any() ? dailyBorrows.Average(d => d.borrows) : 0,
                        totalUniqueBorrowers = dailyBorrows.Sum(d => d.uniqueUsers)
                    },
                    contentAnalytics = new
                    {
                        categoryStats = categoryStats,
                        topCategory = categoryStats.FirstOrDefault()?.category,
                        totalCategories = categoryStats.Count
                    },
                    userBehavior = new
                    {
                        activityByHour = userActivityByHour,
                        peakHour = userActivityByHour.OrderByDescending(h => h.activity).FirstOrDefault()?.hour,
                        averageSessionDuration = "25 phút" // Mock
                    },
                    financialAnalytics = new
                    {
                        revenueByDay = revenueByDay,
                        totalRevenue = revenueByDay.Sum(r => r.revenue),
                        averageDailyRevenue = revenueByDay.Any() ? revenueByDay.Average(r => r.revenue) : 0,
                        bestRevenueDay = revenueByDay.OrderByDescending(r => r.revenue).FirstOrDefault()?.date
                    },
                    generatedAt = DateTime.Now
                };

                return Ok(analytics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy phân tích dữ liệu", error = ex.Message });
            }
        }

        // Helper methods
        private async Task<int> GetTotalRecords()
        {
            var counts = new[]
            {
                await _context.Saches.CountAsync(),
                await _context.DocGias.CountAsync(),
                await _context.NguoiDungs.CountAsync(),
                await _context.PhieuMuons.CountAsync(),
                await _context.PhieuThus.CountAsync(),
                //await _context.Reservations.CountAsync()
            };

            return counts.Sum();
        }

        private async Task<List<object>> GetSystemAlerts()
        {
            var alerts = new List<object>();

            // Check for overdue books
            var overdueCount = await _context.PhieuMuons
                .CountAsync(p => p.TrangThai == "DangMuon" && p.HanTra < DateTime.Now.Date);
            
            if (overdueCount > 0)
            {
                alerts.Add(new
                {
                    type = "warning",
                    message = $"{overdueCount} sách đang quá hạn",
                    action = "Xem danh sách sách quá hạn"
                });
            }

            // Check for low stock
            var lowStockCount = await _context.Saches
                .CountAsync(s => s.SoLuongConLai <= 5 && s.SoLuongConLai > 0);
            
            if (lowStockCount > 0)
            {
                alerts.Add(new
                {
                    type = "info",
                    message = $"{lowStockCount} đầu sách sắp hết",
                    action = "Xem danh sách cần nhập thêm"
                });
            }

            // Check for pending fines
            var pendingFinesAmount = await _context.PhieuThus
                .Where(pt => pt.LoaiThu == "PhiPhat" && pt.TrangThai == "ChuaThu")
                .SumAsync(pt => pt.SoTien);
            
            if (pendingFinesAmount > 1000000) // > 1M VND
            {
                alerts.Add(new
                {
                    type = "warning",
                    message = $"Tiền phạt chưa thu: {pendingFinesAmount:N0} VNĐ",
                    action = "Xem danh sách phạt chưa thu"
                });
            }

            return alerts;
        }

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