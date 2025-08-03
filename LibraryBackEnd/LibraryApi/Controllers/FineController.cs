using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LibraryApi.Data;
using LibraryApi.Models;
using LibraryApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FineController : ControllerBase
    {
        private readonly FineService _fineService;
        private readonly LibraryContext _context;

        public FineController(FineService fineService, LibraryContext context)
        {
            _fineService = fineService;
            _context = context;
        }

        // GET: api/Fine/statistics
        [HttpGet("statistics")]
        public async Task<ActionResult<FineStatisticsDto>> GetStatistics([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
        {
            try
            {
                var statistics = await _fineService.GetFineStatistics(fromDate, toDate);
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thống kê phạt tiền", error = ex.Message });
            }
        }

        // GET: api/Fine/all
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<PhieuThuDto>>> GetAllFines([FromQuery] string status = null, [FromQuery] string violationType = null)
        {
            try
            {
                var query = _context.PhieuThus
                    .Where(pt => pt.LoaiThu == "PhiPhat")
                    .Include(pt => pt.DocGia)
                    .Include(pt => pt.Sach)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(status))
                    query = query.Where(pt => pt.TrangThai == status);

                if (!string.IsNullOrEmpty(violationType))
                    query = query.Where(pt => pt.LoaiViPham == violationType);

                var fines = await query
                    .OrderByDescending(pt => pt.NgayTao)
                    .ToListAsync();

                var finesDto = fines.Select(f => new PhieuThuDto
                {
                    MaPhieuThu = f.MaPhieuThu,
                    NgayThu = f.NgayThu,
                    MaDG = f.MaDG,
                    TenDG = f.DocGia?.HoTen,
                    LoaiThu = f.LoaiThu,
                    SoTien = f.SoTien,
                    HinhThucThanhToan = f.HinhThucThanhToan,
                    GhiChu = f.GhiChu,
                    TrangThai = f.TrangThai,
                    NguoiThu = f.NguoiThu,
                    LoaiViPham = f.LoaiViPham,
                    MaSach = f.MaSach,
                    TenSach = f.TenSach,
                    SoNgayTre = f.SoNgayTre,
                    MaPhieuMuon = f.MaPhieuMuon,
                    MaBaoCaoViPham = f.MaBaoCaoViPham,
                    MaGiaoDich = f.MaGiaoDich,
                    NgayTao = f.NgayTao,
                    NgayCapNhat = f.NgayCapNhat
                });

                return Ok(finesDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách phạt tiền", error = ex.Message });
            }
        }

        // GET: api/Fine/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<PhieuThuDto>> GetFineById(int id)
        {
            try
            {
                var fine = await _context.PhieuThus
                    .Include(pt => pt.DocGia)
                    .Include(pt => pt.Sach)
                    .Include(pt => pt.PhieuMuon)
                    .Include(pt => pt.BaoCaoViPham)
                    .FirstOrDefaultAsync(pt => pt.MaPhieuThu == id && pt.LoaiThu == "PhiPhat");

                if (fine == null)
                    return NotFound(new { message = "Không tìm thấy phiếu phạt tiền" });

                var fineDto = new PhieuThuDto
                {
                    MaPhieuThu = fine.MaPhieuThu,
                    NgayThu = fine.NgayThu,
                    MaDG = fine.MaDG,
                    TenDG = fine.DocGia?.HoTen,
                    LoaiThu = fine.LoaiThu,
                    SoTien = fine.SoTien,
                    HinhThucThanhToan = fine.HinhThucThanhToan,
                    GhiChu = fine.GhiChu,
                    TrangThai = fine.TrangThai,
                    NguoiThu = fine.NguoiThu,
                    LoaiViPham = fine.LoaiViPham,
                    MaSach = fine.MaSach,
                    TenSach = fine.TenSach,
                    SoNgayTre = fine.SoNgayTre,
                    MaPhieuMuon = fine.MaPhieuMuon,
                    MaBaoCaoViPham = fine.MaBaoCaoViPham,
                    MaGiaoDich = fine.MaGiaoDich,
                    NgayTao = fine.NgayTao,
                    NgayCapNhat = fine.NgayCapNhat
                };

                return Ok(fineDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thông tin phiếu phạt tiền", error = ex.Message });
            }
        }

        // POST: api/Fine/calculate-overdue
        [HttpPost("calculate-overdue")]
        public async Task<ActionResult<FineCalculationResult>> CalculateOverdueFine([FromBody] OverdueFineRequest request)
        {
            try
            {
                var fineAmount = _fineService.CalculateOverdueFine(request.DueDate, request.ReturnDate, request.ReaderId);
                
                return Ok(new FineCalculationResult
                {
                    FineAmount = fineAmount,
                    OverdueDays = (request.ReturnDate - request.DueDate).Days,
                    ViolationType = "Trả trễ"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tính toán phạt tiền trễ hạn", error = ex.Message });
            }
        }

        // POST: api/Fine/calculate-damaged
        [HttpPost("calculate-damaged")]
        public ActionResult<FineCalculationResult> CalculateDamagedFine([FromBody] DamagedFineRequest request)
        {
            try
            {
                var fineAmount = _fineService.CalculateDamagedBookFine(request.BookId, request.DamageLevel, request.ReaderId);
                
                return Ok(new FineCalculationResult
                {
                    FineAmount = fineAmount,
                    ViolationType = "Hư hỏng",
                    DamageLevel = request.DamageLevel
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tính toán phạt tiền sách hư hỏng", error = ex.Message });
            }
        }

        // POST: api/Fine/calculate-lost
        [HttpPost("calculate-lost")]
        public ActionResult<FineCalculationResult> CalculateLostFine([FromBody] LostFineRequest request)
        {
            try
            {
                var fineAmount = _fineService.CalculateLostBookFine(request.BookId, request.ReaderId);
                
                return Ok(new FineCalculationResult
                {
                    FineAmount = fineAmount,
                    ViolationType = "Mất"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tính toán phạt tiền sách mất", error = ex.Message });
            }
        }

        // POST: api/Fine/create
        [HttpPost("create")]
        public async Task<ActionResult<PhieuThuDto>> CreateFine([FromBody] CreateFineReceiptDto request)
        {
            try
            {
                var fineReceipt = await _fineService.CreateFineReceipt(request);
                
                var fineDto = new PhieuThuDto
                {
                    MaPhieuThu = fineReceipt.MaPhieuThu,
                    NgayThu = fineReceipt.NgayThu,
                    MaDG = fineReceipt.MaDG,
                    LoaiThu = fineReceipt.LoaiThu,
                    SoTien = fineReceipt.SoTien,
                    HinhThucThanhToan = fineReceipt.HinhThucThanhToan,
                    GhiChu = fineReceipt.GhiChu,
                    TrangThai = fineReceipt.TrangThai,
                    NguoiThu = fineReceipt.NguoiThu,
                    LoaiViPham = fineReceipt.LoaiViPham,
                    MaSach = fineReceipt.MaSach,
                    TenSach = fineReceipt.TenSach,
                    SoNgayTre = fineReceipt.SoNgayTre,
                    MaPhieuMuon = fineReceipt.MaPhieuMuon,
                    MaBaoCaoViPham = fineReceipt.MaBaoCaoViPham,
                    MaGiaoDich = fineReceipt.MaGiaoDich,
                    NgayTao = fineReceipt.NgayTao
                };

                return CreatedAtAction(nameof(GetFineById), new { id = fineReceipt.MaPhieuThu }, fineDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tạo phiếu phạt tiền", error = ex.Message });
            }
        }

        // PUT: api/Fine/{id}/pay
        [HttpPut("{id}/pay")]
        public async Task<ActionResult> ProcessPayment(int id, [FromBody] PaymentRequest request)
        {
            try
            {
                var success = await _fineService.ProcessFinePayment(id, request.NguoiThu);
                
                if (!success)
                    return NotFound(new { message = "Không tìm thấy phiếu phạt tiền" });

                return Ok(new { message = "Thanh toán phạt tiền thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xử lý thanh toán", error = ex.Message });
            }
        }

        // GET: api/Fine/reader/{readerId}
        [HttpGet("reader/{readerId}")]
        public async Task<ActionResult<IEnumerable<PhieuThuDto>>> GetReaderFines(int readerId)
        {
            try
            {
                var fines = await _context.PhieuThus
                    .Where(pt => pt.MaDG == readerId && pt.LoaiThu == "PhiPhat")
                    .Include(pt => pt.DocGia)
                    .Include(pt => pt.Sach)
                    .OrderByDescending(pt => pt.NgayTao)
                    .ToListAsync();

                var finesDto = fines.Select(f => new PhieuThuDto
                {
                    MaPhieuThu = f.MaPhieuThu,
                    NgayThu = f.NgayThu,
                    MaDG = f.MaDG,
                    TenDG = f.DocGia?.HoTen,
                    LoaiThu = f.LoaiThu,
                    SoTien = f.SoTien,
                    HinhThucThanhToan = f.HinhThucThanhToan,
                    GhiChu = f.GhiChu,
                    TrangThai = f.TrangThai,
                    NguoiThu = f.NguoiThu,
                    LoaiViPham = f.LoaiViPham,
                    MaSach = f.MaSach,
                    TenSach = f.TenSach,
                    SoNgayTre = f.SoNgayTre,
                    MaPhieuMuon = f.MaPhieuMuon,
                    MaBaoCaoViPham = f.MaBaoCaoViPham,
                    MaGiaoDich = f.MaGiaoDich,
                    NgayTao = f.NgayTao,
                    NgayCapNhat = f.NgayCapNhat
                });

                return Ok(finesDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách phạt tiền của Reader", error = ex.Message });
            }
        }

        // GET: api/Fine/check-account-lock/{readerId}
        [HttpGet("check-account-lock/{readerId}")]
        public async Task<ActionResult<AccountLockResult>> CheckAccountLock(int readerId)
        {
            try
            {
                var lockResult = await _fineService.CheckAccountLockConditions(readerId);
                return Ok(lockResult);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi kiểm tra điều kiện khóa tài khoản", error = ex.Message });
            }
        }
    }

    public class PhieuThuDto
    {
        public int MaPhieuThu { get; set; }
        public DateTime NgayThu { get; set; }
        public int MaDG { get; set; }
        public string TenDG { get; set; } = string.Empty;
        public string LoaiThu { get; set; } = string.Empty;
        public decimal SoTien { get; set; }
        public string HinhThucThanhToan { get; set; } = string.Empty;
        public string GhiChu { get; set; } = string.Empty;
        public string TrangThai { get; set; } = string.Empty;
        public string NguoiThu { get; set; } = string.Empty;
        public string LoaiViPham { get; set; } = string.Empty;
        public int? MaSach { get; set; }
        public string TenSach { get; set; } = string.Empty;
        public int? SoNgayTre { get; set; }
        public int? MaPhieuMuon { get; set; }
        public int? MaBaoCaoViPham { get; set; }
        public string MaGiaoDich { get; set; } = string.Empty;
        public DateTime NgayTao { get; set; }
        public DateTime? NgayCapNhat { get; set; }
    }

    public class OverdueFineRequest
    {
        public DateTime DueDate { get; set; }
        public DateTime ReturnDate { get; set; }
        public int ReaderId { get; set; }
    }

    public class DamagedFineRequest
    {
        public int BookId { get; set; }
        public string DamageLevel { get; set; } = string.Empty; // "Nhẹ", "Trung bình", "Nặng"
        public int ReaderId { get; set; }
    }

    public class LostFineRequest
    {
        public int BookId { get; set; }
        public int ReaderId { get; set; }
    }

    public class FineCalculationResult
    {
        public decimal FineAmount { get; set; }
        public int? OverdueDays { get; set; }
        public string ViolationType { get; set; } = string.Empty;
        public string DamageLevel { get; set; } = string.Empty;
    }

    public class PaymentRequest
    {
        public string NguoiThu { get; set; } = string.Empty;
    }
} 