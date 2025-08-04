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
    public class AdminDashboardController : ControllerBase
    {
        private readonly LibraryContext _context;

        public AdminDashboardController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/AdminDashboard/summary
        [HttpGet("summary")]
        public async Task<ActionResult<object>> GetAdminSummary()
        {
            try
            {
                // System overview
                var totalUsers = await _context.NguoiDungs.CountAsync();
                var totalReaders = await _context.DocGias.CountAsync();
                var totalBooks = await _context.Saches.SumAsync(s => s.SoLuong ?? 0);
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
                    .Where(p => p.NgayTraThucTe < DateTime.Now && p.TrangThai == "Đang mượn")
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
                        role = g.Key,
                        count = g.Count()
                    })
                    .ToListAsync();

                // Reader statistics
                var readersByType = await _context.DocGias
                    .GroupBy(d => d.LoaiDocGia)
                    .Select(g => new
                    {
                        type = g.Key,
                        count = g.Count(),
                        active = g.Count(d => d.TrangThai == "Hoạt động")
                    })
                    .ToListAsync();

                // Book statistics
                var booksByCategory = await _context.Saches
                    .GroupBy(s => s.TheLoai ?? "Không xác định")
                    .Select(g => new
                    {
                        category = g.Key,
                        totalBooks = g.Sum(s => s.SoLuong ?? 0),
                        uniqueTitles = g.Count(),
                        availableBooks = g.Sum(s => s.SoLuongConLai ?? 0)
                    })
                    .OrderByDescending(x => x.totalBooks)
                    .Take(10)
                    .ToListAsync();

                // Recent activities
                var recentActivities = await _context.PhieuMuons
                    .Include(p => p.DocGia)
                    .Include(p => p.CT_PhieuMuon)
                        .ThenInclude(ct => ct.Sach)
                    .OrderByDescending(p => p.NgayMuon)
                    .Take(10)
                    .Select(p => new
                    {
                        id = p.MaPhieuMuon,
                        type = "borrow",
                        user = p.DocGia.HoTen,
                        books = p.CT_PhieuMuon.Count(),
                        date = p.NgayMuon,
                        status = p.TrangThai
                    })
                    .ToListAsync();

                // System health
                var systemHealth = new
                {
                    databaseStatus = "Online",
                    apiStatus = "Healthy",
                    lastBackup = DateTime.Now.AddDays(-1),
                    uptime = "99.9%",
                    activeConnections = 15
                };

                // Financial overview
                var totalFines = await _context.PhieuThus
                    .Where(p => p.LoaiThu == "Phạt")
                    .SumAsync(p => p.SoTien);
                var totalMemberships = await _context.PhieuThus
                    .Where(p => p.LoaiThu == "Phí thành viên")
                    .SumAsync(p => p.SoTien);

                var summary = new
                {
                    overview = new
                    {
                        totalUsers = totalUsers,
                        totalReaders = totalReaders,
                        totalBooks = totalBooks,
                        totalBorrows = totalBorrows,
                        activeBorrows = activeBorrows,
                        overdueBorrows = overdueBorrows,
                        //pendingReservations = pendingReservations
                    },
                    statistics = new
                    {
                        usersByRole = usersByRole,
                        readersByType = readersByType,
                        booksByCategory = booksByCategory
                    },
                    activities = recentActivities,
                    system = systemHealth,
                    financial = new
                    {
<<<<<<< HEAD
                        totalRevenue = totalRevenue,
                        monthlyRevenue = monthlyRevenue,
                        pendingFines = pendingFines,
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
=======
                        totalFines = totalFines,
                        totalMemberships = totalMemberships,
                        totalRevenue = totalFines + totalMemberships
                return Ok(summary);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thông tin admin dashboard", error = ex.Message });
            }
        }

        // GET: api/AdminDashboard/system-health
        [HttpGet("system-health")]
        public async Task<ActionResult<object>> GetSystemHealth()
        {
            try
            {
                // Database health checks
                var dbConnection = await _context.Database.CanConnectAsync();
                var totalTables = await _context.Database.SqlQueryRaw<int>("SELECT COUNT(*) FROM sqlite_master WHERE type='table'").FirstOrDefaultAsync();

                // Performance metrics
                var slowQueries = await _context.PhieuMuons
                    .Include(p => p.DocGia)
                    .Include(p => p.CT_PhieuMuon)
                    .Take(100)
                    .ToListAsync();

                // Error logs (simulated)
                var errorLogs = new[]
                {
                    new { timestamp = DateTime.Now.AddHours(-2), level = "WARNING", message = "High memory usage detected" },
                    new { timestamp = DateTime.Now.AddHours(-4), level = "INFO", message = "Database backup completed" },
                    new { timestamp = DateTime.Now.AddHours(-6), level = "ERROR", message = "Failed to connect to external service" }
                };

                // Resource usage
                var resourceUsage = new
                {
                    cpuUsage = 45.2,
                    memoryUsage = 67.8,
                    diskUsage = 23.4,
                    networkUsage = 12.1
                };

                var health = new
                {
                    status = dbConnection ? "Healthy" : "Unhealthy",
                    database = new
                    {
                        connection = dbConnection,
                        totalTables = totalTables,
                        lastCheck = DateTime.Now
                    },
                    performance = new
                    {
                        averageQueryTime = 0.15,
                        activeConnections = 8,
                        cacheHitRate = 94.2
                    },
                    errors = errorLogs,
                    resources = resourceUsage,
                    generatedAt = DateTime.Now
                };

                return Ok(health);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi kiểm tra system health", error = ex.Message });
            }
        }

        // GET: api/AdminDashboard/analytics
        [HttpGet("analytics")]
        public async Task<ActionResult<object>> GetAnalytics()
        {
            try
            {
                var today = DateTime.Today;
                var lastMonth = today.AddMonths(-1);

                // User growth
                var userGrowth = await _context.NguoiDungs
                    .Where(u => u.NgayTao >= lastMonth)
                    .GroupBy(u => u.NgayTao.Date)
                    .Select(g => new
                    {
                        date = g.Key.ToString("yyyy-MM-dd"),
                        newUsers = g.Count()
                    })
                    .OrderBy(x => x.date)
                    .ToListAsync();

                // Book borrowing trends
                var borrowingTrends = await _context.PhieuMuons
                    .Where(p => p.NgayMuon >= lastMonth)
                    .GroupBy(p => p.NgayMuon.Date)
                    .Select(g => new
                    {
                        date = g.Key.ToString("yyyy-MM-dd"),
                        borrows = g.Count(),
                        books = g.Sum(p => p.CT_PhieuMuon.Count)
                    })
                    .OrderBy(x => x.date)
                    .ToListAsync();

                // Popular books
                var popularBooks = await _context.PhieuMuons
                    .Include(p => p.CT_PhieuMuon)
                        .ThenInclude(ct => ct.Sach)
                    .Where(p => p.NgayMuon >= lastMonth)
                    .SelectMany(p => p.CT_PhieuMuon)
                    .GroupBy(ct => ct.Sach.TenSach)
                    .Select(g => new
                    {
                        title = g.Key,
                        borrowCount = g.Count(),
                        author = g.First().Sach.TacGia
                    })
                    .OrderByDescending(x => x.borrowCount)
                    .Take(10)
                    .ToListAsync();

                // Revenue trends
<<<<<<< HEAD
                var revenueByDay = await _context.PhieuThus
                    .Where(pt => pt.TrangThai == "DaThu" && pt.NgayThu >= fromDate && pt.NgayThu <= toDate)
                    .GroupBy(pt => pt.NgayThu/*.Value*/.Date)
=======
                var revenueTrends = await _context.PhieuThus
                    .Where(p => p.NgayThu >= lastMonth)
                    .GroupBy(p => p.NgayThu.Date)
>>>>>>> 4b160949cbe52802dd0341c0f20efc0627217453
                    .Select(g => new
                    {
                        date = g.Key.ToString("yyyy-MM-dd"),
                        revenue = g.Sum(p => p.SoTien),
                        transactions = g.Count()
                    })
                    .OrderBy(x => x.date)
                    .ToListAsync();

                var analytics = new
                {
                    userGrowth = userGrowth,
                    borrowingTrends = borrowingTrends,
                    popularBooks = popularBooks,
                    revenueTrends = revenueTrends,
                    generatedAt = DateTime.Now
                };

                return Ok(analytics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy analytics", error = ex.Message });
            }
        }
<<<<<<< HEAD

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
=======
>>>>>>> 4b160949cbe52802dd0341c0f20efc0627217453
    }
}
*/