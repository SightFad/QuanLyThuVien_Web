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
    public class FinancialTransactionsController : ControllerBase
    {
        private readonly LibraryContext _context;

        public FinancialTransactionsController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/FinancialTransactions
        [HttpGet]
        public async Task<ActionResult<object>> GetTransactions(
            [FromQuery] string search = "",
            [FromQuery] string type = "all",
            [FromQuery] string status = "all",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.PhieuThus
                    .Include(pt => pt.DocGia)
                    .AsQueryable();

                // Apply search filter
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(pt => 
                        pt.DocGia.HoTen.Contains(search) ||
                        //pt.LyDo.Contains(search) ||
                        pt.GhiChu.Contains(search));
                }

                // Apply type filter
                if (type != "all")
                {
                    query = query.Where(pt => pt.LoaiThu == type);
                }

                // Apply status filter
                if (status != "all")
                {
                    query = query.Where(pt => pt.TrangThai == status);
                }

                // Get total count for pagination
                var totalCount = await query.CountAsync();

                // Apply pagination
                var transactions = await query
                    .OrderByDescending(pt => pt.NgayTao)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(pt => new
                    {
                        id = pt.MaPhieuThu,
                        date = pt.NgayTao.ToString("yyyy-MM-dd"),
                        type = pt.LoaiThu,
                        memberName = pt.DocGia.HoTen,
                        memberId = pt.MaDG,
                        amount = pt.SoTien,
                        //paymentMethod = pt.PhuongThucThu ?? "cash", // Default to cash if null
                        //status = pt.TrangThai,
                        //description = pt.LyDo ?? pt.GhiChu ?? "Không có mô tả",
                        //paidDate = pt.NgayThu?.ToString("yyyy-MM-dd"),
                        collector = pt.NguoiThu
                    })
                    .ToListAsync();

                // Calculate summary statistics
                var totalRevenue = await _context.PhieuThus
                    .Where(pt => pt.TrangThai == "DaThu")
                    .SumAsync(pt => pt.SoTien);

                var pendingAmount = await _context.PhieuThus
                    .Where(pt => pt.TrangThai == "ChuaThu")
                    .SumAsync(pt => pt.SoTien);

                var result = new
                {
                    transactions = transactions,
                    pagination = new
                    {
                        page = page,
                        pageSize = pageSize,
                        totalCount = totalCount,
                        totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                    },
                    summary = new
                    {
                        totalRevenue = totalRevenue,
                        pendingAmount = pendingAmount,
                        totalTransactions = await _context.PhieuThus.CountAsync()
                    }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách giao dịch", error = ex.Message });
            }
        }

        // GET: api/FinancialTransactions/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetTransaction(int id)
        {
            try
            {
                var transaction = await _context.PhieuThus
                    .Include(pt => pt.DocGia)
                    .Include(pt => pt.BaoCaoViPham)
                    .Where(pt => pt.MaPhieuThu == id)
                    .Select(pt => new
                    {
                        id = pt.MaPhieuThu,
                        date = pt.NgayTao.ToString("yyyy-MM-dd"),
                        type = pt.LoaiThu,
                        memberName = pt.DocGia.HoTen,
                        memberId = pt.MaDG,
                        memberEmail = pt.DocGia.Email,
                        memberPhone = pt.DocGia.SDT,
                        amount = pt.SoTien,
                        //paymentMethod = pt.PhuongThucThu ?? "cash",
                        status = pt.TrangThai,
                        //description = pt.LyDo ?? pt.GhiChu ?? "Không có mô tả",
                        paidDate = pt.NgayThu/*?*/.ToString("yyyy-MM-dd"),
                        collector = pt.NguoiThu,
                        violationId = pt.MaBaoCaoViPham,
                        violationInfo = pt.BaoCaoViPham != null ? new
                        {
                            id = pt.BaoCaoViPham.Id,
                            violationCode = pt.BaoCaoViPham.MaViPham,
                            violationType = pt.BaoCaoViPham.MucDoViPham,
                            notes = pt.BaoCaoViPham.GhiChu
                        } : null
                    })
                    .FirstOrDefaultAsync();

                if (transaction == null)
                    return NotFound("Không tìm thấy giao dịch");

                return Ok(transaction);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy chi tiết giao dịch", error = ex.Message });
            }
        }

        // POST: api/FinancialTransactions
        [HttpPost]
        public async Task<ActionResult<object>> CreateTransaction([FromBody] CreateTransactionDto dto)
        {
            try
            {
                // Validate member exists
                var member = await _context.DocGias.FindAsync(dto.MemberId);
                if (member == null)
                    return BadRequest("Không tìm thấy thành viên");

                var transaction = new PhieuThu
                {
                    MaDG = dto.MemberId,
                    LoaiThu = dto.Type,
                    SoTien = dto.Amount,
                    //PhuongThucThu = dto.PaymentMethod,
                    TrangThai = dto.Status ?? "ChuaThu",
                    //LyDo = dto.Description,
                    GhiChu = dto.Notes,
                    NgayTao = DateTime.Now,
                    //NgayThu = dto.Status == "DaThu" ? DateTime.Now : null,
                    NguoiThu = dto.Status == "DaThu" ? dto.Collector : null,
                    MaBaoCaoViPham = dto.ViolationId
                };

                _context.PhieuThus.Add(transaction);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTransaction), 
                    new { id = transaction.MaPhieuThu }, 
                    new { id = transaction.MaPhieuThu, message = "Tạo giao dịch thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tạo giao dịch", error = ex.Message });
            }
        }

        // PUT: api/FinancialTransactions/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTransaction(int id, [FromBody] UpdateTransactionDto dto)
        {
            try
            {
                var transaction = await _context.PhieuThus.FindAsync(id);
                if (transaction == null)
                    return NotFound("Không tìm thấy giao dịch");

                //// Update fields
                //if (!string.IsNullOrEmpty(dto.PaymentMethod))
                //    transaction.PhuongThucThu = dto.PaymentMethod;
                
                if (!string.IsNullOrEmpty(dto.Status))
                {
                    transaction.TrangThai = dto.Status;
                    if (dto.Status == "DaThu" && transaction.NgayThu == null)
                    {
                        transaction.NgayThu = DateTime.Now;
                        transaction.NguoiThu = dto.Collector;
                    }
                }

                if (dto.Amount.HasValue)
                    transaction.SoTien = dto.Amount.Value;

                if (!string.IsNullOrEmpty(dto.Notes))
                    transaction.GhiChu = dto.Notes;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật giao dịch thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật giao dịch", error = ex.Message });
            }
        }

        // POST: api/FinancialTransactions/{id}/process-payment
        [HttpPost("{id}/process-payment")]
        public async Task<ActionResult> ProcessPayment(int id, [FromBody] ProcessPaymentDto dto)
        {
            try
            {
                var transaction = await _context.PhieuThus.FindAsync(id);
                if (transaction == null)
                    return NotFound("Không tìm thấy giao dịch");

                if (transaction.TrangThai == "DaThu")
                    return BadRequest("Giao dịch đã được thanh toán");

                transaction.TrangThai = "DaThu";
                transaction.NgayThu = DateTime.Now;
                transaction.NguoiThu = dto.Collector;
                //transaction.PhuongThucThu = dto.PaymentMethod;

                if (!string.IsNullOrEmpty(dto.Notes))
                    transaction.GhiChu = dto.Notes;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Xử lý thanh toán thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xử lý thanh toán", error = ex.Message });
            }
        }

        // GET: api/FinancialTransactions/statistics
        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetStatistics([FromQuery] string period = "month")
        {
            try
            {
                var (fromDate, toDate) = GetDateRangeFromPeriod(period);

                var stats = new
                {
                    totalRevenue = await _context.PhieuThus
                        .Where(pt => pt.TrangThai == "DaThu" && pt.NgayThu >= fromDate && pt.NgayThu <= toDate)
                        .SumAsync(pt => pt.SoTien),
                    
                    pendingAmount = await _context.PhieuThus
                        .Where(pt => pt.TrangThai == "ChuaThu")
                        .SumAsync(pt => pt.SoTien),
                    
                    transactionCount = await _context.PhieuThus
                        .Where(pt => pt.NgayTao >= fromDate && pt.NgayTao <= toDate)
                        .CountAsync(),
                    
                    membershipRevenue = await _context.PhieuThus
                        .Where(pt => pt.LoaiThu == "PhiThanhVien" && pt.TrangThai == "DaThu" && 
                                    pt.NgayThu >= fromDate && pt.NgayThu <= toDate)
                        .SumAsync(pt => pt.SoTien),
                    
                    fineRevenue = await _context.PhieuThus
                        .Where(pt => pt.LoaiThu == "PhiPhat" && pt.TrangThai == "DaThu" && 
                                    pt.NgayThu >= fromDate && pt.NgayThu <= toDate)
                        .SumAsync(pt => pt.SoTien),
                    
                    period = $"{fromDate:dd/MM/yyyy} - {toDate:dd/MM/yyyy}"
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thống kê", error = ex.Message });
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
    }

    // DTOs for requests
    public class CreateTransactionDto
    {
        public int MemberId { get; set; }
        public string Type { get; set; } // PhiThanhVien, PhiPhat, etc.
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; }
        public string? Status { get; set; }
        public string Description { get; set; }
        public string? Notes { get; set; }
        public string? Collector { get; set; }
        public int? ViolationId { get; set; }
    }

    public class UpdateTransactionDto
    {
        public string? PaymentMethod { get; set; }
        public string? Status { get; set; }
        public decimal? Amount { get; set; }
        public string? Notes { get; set; }
        public string? Collector { get; set; }
    }

    public class ProcessPaymentDto
    {
        public string PaymentMethod { get; set; }
        public string Collector { get; set; }
        public string? Notes { get; set; }
    }
}