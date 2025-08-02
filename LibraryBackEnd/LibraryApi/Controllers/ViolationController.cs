using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryApi.Data;
using LibraryApi.Models;
using LibraryApi.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ViolationController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly ViolationService _violationService;

        public ViolationController(LibraryContext context, ViolationService violationService)
        {
            _context = context;
            _violationService = violationService;
        }

        // GET: api/Violation
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BaoCaoViPham>>> GetViolations(
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? statusFilter = null,
            [FromQuery] string? levelFilter = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.BaoCaoViPhams
                    .Include(v => v.DocGia)
                    .Include(v => v.Sach)
                    .AsQueryable();

                // Apply search filter
                if (!string.IsNullOrEmpty(searchTerm))
                {
                    query = query.Where(v => 
                        v.DocGia.HoTen.Contains(searchTerm) ||
                        v.Sach.TenSach.Contains(searchTerm) ||
                        v.MaViPham.Contains(searchTerm)
                    );
                }

                // Apply status filter
                if (!string.IsNullOrEmpty(statusFilter) && statusFilter != "all")
                {
                    query = query.Where(v => v.TrangThai == statusFilter);
                }

                // Apply level filter
                if (!string.IsNullOrEmpty(levelFilter) && levelFilter != "all")
                {
                    query = query.Where(v => v.MucDoViPham == levelFilter);
                }

                // Apply date range filter
                if (fromDate.HasValue)
                {
                    query = query.Where(v => v.NgayViPham >= fromDate.Value);
                }
                if (toDate.HasValue)
                {
                    query = query.Where(v => v.NgayViPham <= toDate.Value);
                }

                // Apply pagination
                var totalCount = await query.CountAsync();
                var violations = await query
                    .OrderByDescending(v => v.NgayViPham)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                Response.Headers["X-Total-Count"] = totalCount.ToString();
                Response.Headers["X-Page-Count"] = Math.Ceiling((double)totalCount / pageSize).ToString();

                return Ok(violations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách vi phạm", error = ex.Message });
            }
        }

        // GET: api/Violation/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BaoCaoViPham>> GetViolation(int id)
        {
            try
            {
                var violation = await _context.BaoCaoViPhams
                    .Include(v => v.DocGia)
                    .Include(v => v.Sach)
                    .FirstOrDefaultAsync(v => v.Id == id);

                if (violation == null)
                {
                    return NotFound(new { message = "Không tìm thấy vi phạm" });
                }

                return Ok(violation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thông tin vi phạm", error = ex.Message });
            }
        }

        // POST: api/Violation
        [HttpPost]
        public async Task<ActionResult<BaoCaoViPham>> CreateViolation(BaoCaoViPham violation)
        {
            try
            {
                // Validate input
                if (violation == null)
                {
                    return BadRequest(new { message = "Dữ liệu vi phạm không hợp lệ" });
                }

                // Check if reader exists
                var reader = await _context.DocGias.FindAsync(violation.MaDocGia);
                if (reader == null)
                {
                    return BadRequest(new { message = "Reader không tồn tại" });
                }

                // Check if book exists
                var book = await _context.Saches.FindAsync(violation.MaSach);
                if (book == null)
                {
                    return BadRequest(new { message = "Sách không tồn tại" });
                }

                // Generate violation code
                violation.MaViPham = await _violationService.GenerateViolationCode();
                violation.NgayViPham = DateTime.Now;
                violation.TrangThai = "Chờ xử lý";

                // Calculate fine based on violation level
                violation.SoTienPhat = _violationService.CalculateFine(violation.MucDoViPham, violation.SoNgayTre);

                _context.BaoCaoViPhams.Add(violation);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetViolation), new { id = violation.Id }, violation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tạo vi phạm", error = ex.Message });
            }
        }

        // PUT: api/Violation/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateViolation(int id, BaoCaoViPham violation)
        {
            try
            {
                if (id != violation.Id)
                {
                    return BadRequest(new { message = "ID không khớp" });
                }

                var existingViolation = await _context.BaoCaoViPhams.FindAsync(id);
                if (existingViolation == null)
                {
                    return NotFound(new { message = "Không tìm thấy vi phạm" });
                }

                // Update properties
                existingViolation.MucDoViPham = violation.MucDoViPham;
                existingViolation.SoNgayTre = violation.SoNgayTre;
                existingViolation.MoTaViPham = violation.MoTaViPham;
                existingViolation.TrangThai = violation.TrangThai;
                existingViolation.GhiChu = violation.GhiChu;
                existingViolation.NgayXuLy = violation.TrangThai == "Đã xử lý" ? DateTime.Now : null;
                existingViolation.NguoiXuLy = violation.NguoiXuLy;

                // Recalculate fine if violation level or days changed
                existingViolation.SoTienPhat = _violationService.CalculateFine(
                    existingViolation.MucDoViPham, 
                    existingViolation.SoNgayTre
                );

                await _context.SaveChangesAsync();

                return Ok(existingViolation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật vi phạm", error = ex.Message });
            }
        }

        // DELETE: api/Violation/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteViolation(int id)
        {
            try
            {
                var violation = await _context.BaoCaoViPhams.FindAsync(id);
                if (violation == null)
                {
                    return NotFound(new { message = "Không tìm thấy vi phạm" });
                }

                _context.BaoCaoViPhams.Remove(violation);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa vi phạm thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xóa vi phạm", error = ex.Message });
            }
        }

        // GET: api/Violation/statistics
        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetViolationStatistics(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var query = _context.BaoCaoViPhams.AsQueryable();

                if (fromDate.HasValue)
                {
                    query = query.Where(v => v.NgayViPham >= fromDate.Value);
                }
                if (toDate.HasValue)
                {
                    query = query.Where(v => v.NgayViPham <= toDate.Value);
                }

                var statistics = new
                {
                    TotalViolations = await query.CountAsync(),
                    PendingViolations = await query.CountAsync(v => v.TrangThai == "Chờ xử lý"),
                    ProcessedViolations = await query.CountAsync(v => v.TrangThai == "Đã xử lý"),
                    TotalFines = await query.SumAsync(v => v.SoTienPhat ?? 0),
                    ViolationsByLevel = await query
                        .GroupBy(v => v.MucDoViPham)
                        .Select(g => new { Level = g.Key, Count = g.Count() })
                        .ToListAsync(),
                    ViolationsByStatus = await query
                        .GroupBy(v => v.TrangThai)
                        .Select(g => new { Status = g.Key, Count = g.Count() })
                        .ToListAsync(),
                    RecentViolations = await query
                        .OrderByDescending(v => v.NgayViPham)
                        .Take(5)
                        .Select(v => new
                        {
                            v.Id,
                            v.MaViPham,
                            v.NgayViPham,
                            v.MucDoViPham,
                            v.TrangThai,
                            v.SoTienPhat
                        })
                        .ToListAsync()
                };

                return Ok(statistics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thống kê vi phạm", error = ex.Message });
            }
        }

        // POST: api/Violation/bulk-process
        [HttpPost("bulk-process")]
        public async Task<ActionResult<object>> BulkProcessViolations([FromBody] List<int> violationIds)
        {
            try
            {
                var violations = await _context.BaoCaoViPhams
                    .Where(v => violationIds.Contains(v.Id))
                    .ToListAsync();

                if (!violations.Any())
                {
                    return BadRequest(new { message = "Không tìm thấy vi phạm nào" });
                }

                foreach (var violation in violations)
                {
                    violation.TrangThai = "Đã xử lý";
                    violation.NgayXuLy = DateTime.Now;
                }

                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = $"Đã xử lý {violations.Count} vi phạm thành công",
                    processedCount = violations.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xử lý hàng loạt vi phạm", error = ex.Message });
            }
        }

        // GET: api/Violation/export
        [HttpGet("export")]
        public async Task<ActionResult<object>> ExportViolations(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] string? format = "json")
        {
            try
            {
                var query = _context.BaoCaoViPhams
                    .Include(v => v.DocGia)
                    .Include(v => v.Sach)
                    .AsQueryable();

                if (fromDate.HasValue)
                {
                    query = query.Where(v => v.NgayViPham >= fromDate.Value);
                }
                if (toDate.HasValue)
                {
                    query = query.Where(v => v.NgayViPham <= toDate.Value);
                }

                var violations = await query
                    .OrderByDescending(v => v.NgayViPham)
                    .ToListAsync();

                var exportData = violations.Select(v => new
                {
                    v.MaViPham,
                    DocGia = v.DocGia?.HoTen,
                    Sach = v.Sach?.TenSach,
                    v.MucDoViPham,
                    v.SoNgayTre,
                    v.SoTienPhat,
                    v.TrangThai,
                    v.NgayViPham,
                    v.NgayXuLy,
                    v.MoTaViPham
                });

                return Ok(new
                {
                    TotalRecords = violations.Count,
                    FromDate = fromDate,
                    ToDate = toDate,
                    ExportDate = DateTime.Now,
                    Data = exportData
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xuất dữ liệu vi phạm", error = ex.Message });
            }
        }
    }
} 