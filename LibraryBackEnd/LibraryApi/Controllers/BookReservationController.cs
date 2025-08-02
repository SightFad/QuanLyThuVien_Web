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
    public class BookReservationController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly BookReservationService _reservationService;

        public BookReservationController(LibraryContext context, BookReservationService reservationService)
        {
            _context = context;
            _reservationService = reservationService;
        }

        // GET: api/BookReservation
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DatTruocSach>>> GetReservations(
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? statusFilter = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.DatTruocSaches
                    .Include(r => r.DocGia)
                    .Include(r => r.Sach)
                    .AsQueryable();

                // Apply search filter
                if (!string.IsNullOrEmpty(searchTerm))
                {
                    query = query.Where(r => 
                        r.DocGia.HoTen.Contains(searchTerm) ||
                        r.Sach.TenSach.Contains(searchTerm) ||
                        r.MaDatTruoc.Contains(searchTerm)
                    );
                }

                // Apply status filter
                if (!string.IsNullOrEmpty(statusFilter) && statusFilter != "all")
                {
                    query = query.Where(r => r.TrangThai == statusFilter);
                }

                // Apply date range filter
                if (fromDate.HasValue)
                {
                    query = query.Where(r => r.NgayDatTruoc >= fromDate.Value);
                }
                if (toDate.HasValue)
                {
                    query = query.Where(r => r.NgayDatTruoc <= toDate.Value);
                }

                // Apply pagination
                var totalCount = await query.CountAsync();
                var reservations = await query
                    .OrderByDescending(r => r.NgayDatTruoc)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                Response.Headers["X-Total-Count"] = totalCount.ToString();
                Response.Headers["X-Page-Count"] = Math.Ceiling((double)totalCount / pageSize).ToString();

                return Ok(reservations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách đặt trước", error = ex.Message });
            }
        }

        // GET: api/BookReservation/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DatTruocSach>> GetReservation(int id)
        {
            try
            {
                var reservation = await _context.DatTruocSaches
                    .Include(r => r.DocGia)
                    .Include(r => r.Sach)
                    .FirstOrDefaultAsync(r => r.Id == id);

                if (reservation == null)
                {
                    return NotFound(new { message = "Không tìm thấy đặt trước" });
                }

                return Ok(reservation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thông tin đặt trước", error = ex.Message });
            }
        }

        // POST: api/BookReservation
        [HttpPost]
        public async Task<ActionResult<DatTruocSach>> CreateReservation(DatTruocSach reservation)
        {
            try
            {
                // Validate input
                if (reservation == null)
                {
                    return BadRequest(new { message = "Dữ liệu đặt trước không hợp lệ" });
                }

                // Check if reader exists
                var reader = await _context.DocGias.FindAsync(reservation.MaDocGia);
                if (reader == null)
                {
                    return BadRequest(new { message = "Reader không tồn tại" });
                }

                // Check if book exists
                var book = await _context.Saches.FindAsync(reservation.MaSach);
                if (book == null)
                {
                    return BadRequest(new { message = "Sách không tồn tại" });
                }

                // Check if book is available for reservation
                if (book.SoLuong > 0)
                {
                    return BadRequest(new { message = "Sách hiện có sẵn, không cần đặt trước" });
                }

                // Check if reader already has a reservation for this book
                var existingReservation = await _context.DatTruocSaches
                    .FirstOrDefaultAsync(r => r.MaDocGia == reservation.MaDocGia && 
                                            r.MaSach == reservation.MaSach && 
                                            r.TrangThai == "Chờ xử lý");
                
                if (existingReservation != null)
                {
                    return BadRequest(new { message = "Bạn đã đặt trước sách này rồi" });
                }

                // Generate reservation code
                reservation.MaDatTruoc = await _reservationService.GenerateReservationCode();
                reservation.NgayDatTruoc = DateTime.Now;
                reservation.TrangThai = "Chờ xử lý";
                reservation.HanLaySach = DateTime.Now.AddDays(3); // Default 3 days

                _context.DatTruocSaches.Add(reservation);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetReservation), new { id = reservation.Id }, reservation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tạo đặt trước", error = ex.Message });
            }
        }

        // PUT: api/BookReservation/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReservation(int id, DatTruocSach reservation)
        {
            try
            {
                if (id != reservation.Id)
                {
                    return BadRequest(new { message = "ID không khớp" });
                }

                var existingReservation = await _context.DatTruocSaches.FindAsync(id);
                if (existingReservation == null)
                {
                    return NotFound(new { message = "Không tìm thấy đặt trước" });
                }

                // Update properties
                existingReservation.TrangThai = reservation.TrangThai;
                existingReservation.GhiChu = reservation.GhiChu;
                existingReservation.NguoiXuLy = reservation.NguoiXuLy;
                existingReservation.NgayXuLy = reservation.TrangThai == "Đã xử lý" ? DateTime.Now : null;

                await _context.SaveChangesAsync();

                return Ok(existingReservation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật đặt trước", error = ex.Message });
            }
        }

        // DELETE: api/BookReservation/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            try
            {
                var reservation = await _context.DatTruocSaches.FindAsync(id);
                if (reservation == null)
                {
                    return NotFound(new { message = "Không tìm thấy đặt trước" });
                }

                _context.DatTruocSaches.Remove(reservation);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa đặt trước thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xóa đặt trước", error = ex.Message });
            }
        }

        // POST: api/BookReservation/notify-available
        [HttpPost("notify-available")]
        public async Task<ActionResult<object>> NotifyBookAvailable([FromBody] int reservationId)
        {
            try
            {
                var result = await _reservationService.NotifyBookAvailable(reservationId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi thông báo sách có sẵn", error = ex.Message });
            }
        }

        // POST: api/BookReservation/process-queue
        [HttpPost("process-queue")]
        public async Task<ActionResult<object>> ProcessReservationQueue([FromBody] int bookId)
        {
            try
            {
                var result = await _reservationService.ProcessReservationQueue(bookId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xử lý hàng đợi đặt trước", error = ex.Message });
            }
        }

        // GET: api/BookReservation/statistics
        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetReservationStatistics(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var query = _context.DatTruocSaches.AsQueryable();

                if (fromDate.HasValue)
                {
                    query = query.Where(r => r.NgayDatTruoc >= fromDate.Value);
                }
                if (toDate.HasValue)
                {
                    query = query.Where(r => r.NgayDatTruoc <= toDate.Value);
                }

                var statistics = new
                {
                    TotalReservations = await query.CountAsync(),
                    PendingReservations = await query.CountAsync(r => r.TrangThai == "Chờ xử lý"),
                    ProcessedReservations = await query.CountAsync(r => r.TrangThai == "Đã xử lý"),
                    CancelledReservations = await query.CountAsync(r => r.TrangThai == "Đã hủy"),
                    ExpiredReservations = await query.CountAsync(r => r.HanLaySach < DateTime.Now && r.TrangThai == "Chờ xử lý"),
                    ReservationsByStatus = await query
                        .GroupBy(r => r.TrangThai)
                        .Select(g => new { Status = g.Key, Count = g.Count() })
                        .ToListAsync(),
                    RecentReservations = await query
                        .OrderByDescending(r => r.NgayDatTruoc)
                        .Take(5)
                        .Select(r => new
                        {
                            r.Id,
                            r.MaDatTruoc,
                            r.NgayDatTruoc,
                            r.TrangThai,
                            r.HanLaySach
                        })
                        .ToListAsync()
                };

                return Ok(statistics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thống kê đặt trước", error = ex.Message });
            }
        }

        // GET: api/BookReservation/overdue
        [HttpGet("overdue")]
        public async Task<ActionResult<IEnumerable<DatTruocSach>>> GetOverdueReservations()
        {
            try
            {
                var overdueReservations = await _context.DatTruocSaches
                    .Include(r => r.DocGia)
                    .Include(r => r.Sach)
                    .Where(r => r.HanLaySach < DateTime.Now && r.TrangThai == "Chờ xử lý")
                    .OrderBy(r => r.HanLaySach)
                    .ToListAsync();

                return Ok(overdueReservations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách đặt trước quá hạn", error = ex.Message });
            }
        }

        // POST: api/BookReservation/bulk-process
        [HttpPost("bulk-process")]
        public async Task<ActionResult<object>> BulkProcessReservations([FromBody] List<int> reservationIds)
        {
            try
            {
                var reservations = await _context.DatTruocSaches
                    .Where(r => reservationIds.Contains(r.Id))
                    .ToListAsync();

                if (!reservations.Any())
                {
                    return BadRequest(new { message = "Không tìm thấy đặt trước nào" });
                }

                foreach (var reservation in reservations)
                {
                    reservation.TrangThai = "Đã xử lý";
                    reservation.NgayXuLy = DateTime.Now;
                }

                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = $"Đã xử lý {reservations.Count} đặt trước thành công",
                    processedCount = reservations.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xử lý hàng loạt đặt trước", error = ex.Message });
            }
        }

        // GET: api/BookReservation/export
        [HttpGet("export")]
        public async Task<ActionResult<object>> ExportReservations(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] string? format = "json")
        {
            try
            {
                var query = _context.DatTruocSaches
                    .Include(r => r.DocGia)
                    .Include(r => r.Sach)
                    .AsQueryable();

                if (fromDate.HasValue)
                {
                    query = query.Where(r => r.NgayDatTruoc >= fromDate.Value);
                }
                if (toDate.HasValue)
                {
                    query = query.Where(r => r.NgayDatTruoc <= toDate.Value);
                }

                var reservations = await query
                    .OrderByDescending(r => r.NgayDatTruoc)
                    .ToListAsync();

                var exportData = reservations.Select(r => new
                {
                    r.MaDatTruoc,
                    DocGia = r.DocGia?.HoTen,
                    Sach = r.Sach?.TenSach,
                    r.TrangThai,
                    r.NgayDatTruoc,
                    r.HanLaySach,
                    r.NgayXuLy,
                    r.GhiChu
                });

                return Ok(new
                {
                    TotalRecords = reservations.Count,
                    FromDate = fromDate,
                    ToDate = toDate,
                    ExportDate = DateTime.Now,
                    Data = exportData
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xuất dữ liệu đặt trước", error = ex.Message });
            }
        }
    }
} 