using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
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
    public class DashboardController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(LibraryContext context, ILogger<DashboardController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("test")]
        [AllowAnonymous]
        public ActionResult<string> Test()
        {
            return Ok("Dashboard controller is working!");
        }

        [HttpGet("summary")]
        public async Task<ActionResult<object>> GetSummary()
        {
            try
            {
                // Debug authorization
                var authHeader = Request.Headers["Authorization"].FirstOrDefault();
                _logger.LogInformation($"Authorization header: {authHeader}");
                
                var user = User;
                _logger.LogInformation($"User authenticated: {user.Identity?.IsAuthenticated}");
                _logger.LogInformation($"User claims: {string.Join(", ", user.Claims.Select(c => $"{c.Type}={c.Value}"))}");
                
                var totalBooks = await _context.Saches.CountAsync();
                var totalMembers = await _context.DocGias.CountAsync();
                var totalUsers = await _context.NguoiDungs.CountAsync();

                // Tính sách đang mượn
                var booksBorrowed = await _context.PhieuMuons
                    .Where(p => p.TrangThai == "borrowed")
                    .CountAsync();

                // Tính sách quá hạn
                var today = DateTime.Today;
                var overdueBooks = await _context.PhieuMuons
                    .Where(p => p.TrangThai == "borrowed" && p.HanTra < today)
                    .CountAsync();

                // Tính phiếu mượn hôm nay
                var todayBorrows = await _context.PhieuMuons
                    .Where(p => p.NgayMuon.Date == today)
                    .CountAsync();

                // Tính phiếu trả đang chờ
                var pendingReturns = await _context.PhieuMuons
                    .Where(p => p.TrangThai == "borrowed" && p.HanTra >= today)
                    .CountAsync();

                // Tính tăng trưởng tháng này
                var thisMonth = DateTime.Today.AddDays(-30);
                var lastMonth = DateTime.Today.AddDays(-60);

                var thisMonthBorrows = await _context.PhieuMuons
                    .Where(p => p.NgayMuon >= thisMonth)
                    .CountAsync();

                var lastMonthBorrows = await _context.PhieuMuons
                    .Where(p => p.NgayMuon >= lastMonth && p.NgayMuon < thisMonth)
                    .CountAsync();

                var borrowGrowth = lastMonthBorrows > 0 
                    ? ((double)(thisMonthBorrows - lastMonthBorrows) / lastMonthBorrows) * 100 
                    : 0;

                var thisMonthMembers = await _context.DocGias
                    .Where(d => d.NgayDangKy >= thisMonth)
                    .CountAsync();

                var lastMonthMembers = await _context.DocGias
                    .Where(d => d.NgayDangKy >= lastMonth && d.NgayDangKy < thisMonth)
                    .CountAsync();

                var memberGrowth = lastMonthMembers > 0 
                    ? ((double)(thisMonthMembers - lastMonthMembers) / lastMonthMembers) * 100 
                    : 0;

                var thisMonthBooks = await _context.Saches
                    .Where(s => s.NgayNhap >= thisMonth)
                    .CountAsync();

                var lastMonthBooks = await _context.Saches
                    .Where(s => s.NgayNhap >= lastMonth && s.NgayNhap < thisMonth)
                    .CountAsync();

                var bookGrowth = lastMonthBooks > 0 
                    ? ((double)(thisMonthBooks - lastMonthBooks) / lastMonthBooks) * 100 
                    : 0;

                return Ok(new
                {
                    totalBooks,
                    totalMembers,
                    totalUsers,
                    booksBorrowed,
                    overdueBooks,
                    todayBorrows,
                    pendingReturns,
                    monthlyGrowth = new
                    {
                        books = Math.Round(bookGrowth, 1),
                        members = Math.Round(memberGrowth, 1),
                        borrows = Math.Round(borrowGrowth, 1),
                        revenue = 0.0 // Chưa có dữ liệu doanh thu
                    },
                    revenue = new
                    {
                        monthly = 0,
                        weekly = 0,
                        daily = 0
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error generating dashboard summary: {ex.Message}");
                return StatusCode(500, new { message = "Lỗi khi lấy dữ liệu dashboard", error = ex.Message });
            }
        }

        [HttpGet("recent-activities")]
        public async Task<ActionResult<IEnumerable<object>>> GetRecentActivities()
        {
            try
            {
                var recentBorrows = await _context.PhieuMuons
                    .Include(p => p.DocGia)
                    .Include(p => p.CT_PhieuMuons)
                        .ThenInclude(ct => ct.Sach)
                    .OrderByDescending(p => p.NgayMuon)
                    .Take(10)
                    .SelectMany(p => p.CT_PhieuMuons.Select(ct => new
                    {
                        id = p.MaPhieuMuon,
                        type = "borrow",
                        user = p.DocGia.HoTen,
                        book = ct.Sach.TenSach,
                        time = p.NgayMuon,
                        status = p.TrangThai
                    }))
                    .ToListAsync();

                return Ok(recentBorrows);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting recent activities: {ex.Message}");
                return StatusCode(500, new { message = "Lỗi khi lấy hoạt động gần đây", error = ex.Message });
            }
        }

        [HttpGet("popular-books")]
        public async Task<ActionResult<IEnumerable<object>>> GetPopularBooks()
        {
            try
            {
                var popularBooks = await _context.CT_PhieuMuons
                    .Include(ct => ct.Sach)
                    .GroupBy(ct => ct.Sach)
                    .Select(g => new
                    {
                        id = g.Key.MaSach,
                        title = g.Key.TenSach,
                        author = g.Key.TacGia,
                        borrows = g.Count(),
                        cover = g.Key.AnhBia
                    })
                    .OrderByDescending(b => b.borrows)
                    .Take(5)
                    .ToListAsync();

                return Ok(popularBooks);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting popular books: {ex.Message}");
                return StatusCode(500, new { message = "Lỗi khi lấy sách phổ biến", error = ex.Message });
            }
        }
    }
} 