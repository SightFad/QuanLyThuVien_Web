using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using LibraryApi.Data;
using LibraryApi.Models;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace LibraryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(LibraryContext context, ILogger<DashboardController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("summary")]
        public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
        {
            try
            {
                var now = DateTime.Now;

                var totalBooks = await _context.Saches.CountAsync();
                var totalReaders = await _context.DocGias.CountAsync();
                
                // Books currently borrowed (have PhieuMuon but no corresponding PhieuTra)
                var booksBorrowed = await _context.CT_PhieuMuons
                    .Where(ct => ct.PhieuMuon != null && 
                                ct.PhieuMuon.NgayTraDuKien != null && 
                                ct.PhieuMuon.NgayTraDuKien >= now &&
                                !_context.PhieuTras.Any(pt => pt.MaPhieuMuon == ct.PhieuMuon.MaPhieuMuon))
                    .CountAsync();
                
                // Books overdue (have PhieuMuon but no corresponding PhieuTra and past due date)
                var booksOverdue = await _context.CT_PhieuMuons
                    .Where(ct => ct.PhieuMuon != null && 
                                ct.PhieuMuon.NgayTraDuKien != null && 
                                ct.PhieuMuon.NgayTraDuKien < now &&
                                !_context.PhieuTras.Any(pt => pt.MaPhieuMuon == ct.PhieuMuon.MaPhieuMuon))
                    .CountAsync();

                var summary = new DashboardSummaryDto
                {
                    TotalBooks = totalBooks,
                    TotalReaders = totalReaders,
                    BooksBorrowed = booksBorrowed,
                    BooksOverdue = booksOverdue
                };

                _logger.LogInformation($"Dashboard summary generated at {DateTime.Now}");
                return Ok(summary);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error generating dashboard summary: {ex.Message}");
                return StatusCode(500, "An error occurred while generating the dashboard summary");
            }
        }
    }
} 