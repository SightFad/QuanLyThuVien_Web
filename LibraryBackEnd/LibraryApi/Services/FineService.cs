using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LibraryApi.Data;
using LibraryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryApi.Services
{
    public class FineService
    {
        private readonly LibraryContext _context;

        public FineService(LibraryContext context)
        {
            _context = context;
        }

        // Tính toán phạt tiền trễ hạn
        public decimal CalculateOverdueFine(DateTime dueDate, DateTime returnDate, int readerId)
        {
            if (returnDate <= dueDate) return 0;

            var overdueDays = (returnDate - dueDate).Days;
            var reader = _context.DocGias.FirstOrDefault(d => d.MaDG == readerId);
            
            if (reader == null) return 0;

            // Mức phạt cơ bản: 10,000 VND/ngày
            decimal baseFine = 10000;
            
            // Tăng mức phạt theo cấp bậc Reader
            decimal multiplier = reader.CapBac switch
            {
                "Sinh viên" => 1.0m,
                "Giảng viên" => 1.5m,
                "Cán bộ" => 1.2m,
                "Khác" => 1.0m,
                _ => 1.0m
            };

            return overdueDays * baseFine * multiplier;
        }

        // Tính toán phạt tiền sách hư hỏng
        public decimal CalculateDamagedBookFine(int bookId, string damageLevel, int readerId)
        {
            var book = _context.Saches.FirstOrDefault(s => s.MaSach == bookId);
            var reader = _context.DocGias.FirstOrDefault(d => d.MaDG == readerId);
            
            if (book == null || reader == null) return 0;

            // Mức phạt cơ bản theo giá sách
            decimal baseFine = book.GiaSach ?? 100000;
            
            // Hệ số theo mức độ hư hỏng
            decimal damageMultiplier = damageLevel switch
            {
                "Nhẹ" => 0.3m,    // 30% giá sách
                "Trung bình" => 0.6m, // 60% giá sách
                "Nặng" => 1.0m,   // 100% giá sách
                _ => 0.5m
            };

            // Hệ số theo cấp bậc Reader
            decimal readerMultiplier = reader.CapBac switch
            {
                "Sinh viên" => 0.8m,
                "Giảng viên" => 1.2m,
                "Cán bộ" => 1.0m,
                "Khác" => 1.0m,
                _ => 1.0m
            };

            return baseFine * damageMultiplier * readerMultiplier;
        }

        // Tính toán phạt tiền sách mất
        public decimal CalculateLostBookFine(int bookId, int readerId)
        {
            var book = _context.Saches.FirstOrDefault(s => s.MaSach == bookId);
            var reader = _context.DocGias.FirstOrDefault(d => d.MaDG == readerId);
            
            if (book == null || reader == null) return 0;

            // Mức phạt cơ bản: 200% giá sách
            decimal baseFine = (book.GiaSach ?? 100000) * 2;
            
            // Hệ số theo cấp bậc Reader
            decimal readerMultiplier = reader.CapBac switch
            {
                "Sinh viên" => 1.0m,
                "Giảng viên" => 1.5m,
                "Cán bộ" => 1.2m,
                "Khác" => 1.0m,
                _ => 1.0m
            };

            return baseFine * readerMultiplier;
        }

        // Kiểm tra điều kiện khóa tài khoản
        public async Task<AccountLockResult> CheckAccountLockConditions(int readerId)
        {
            var reader = await _context.DocGias
                .Include(d => d.PhieuMus)
                .Include(d => d.PhieuThus.Where(pt => pt.LoaiThu == "PhiPhat"))
                .FirstOrDefaultAsync(d => d.MaDG == readerId);

            if (reader == null)
                return new AccountLockResult { ShouldLock = false, Reason = "Không tìm thấy Reader" };

            var result = new AccountLockResult();

            // Kiểm tra số lần vi phạm
            var violationCount = await _context.BaoCaoViPhams
                .Where(b => b.MaDocGia == reader.MaDG && b.TrangThai == "Đã xử lý")
                .CountAsync();

            // Kiểm tra số tiền phạt chưa thanh toán
            var unpaidFines = await _context.PhieuThus
                .Where(pt => pt.MaDG == readerId && pt.LoaiThu == "PhiPhat" && pt.TrangThai == "ChuaThu")
                .SumAsync(pt => pt.SoTien);

            // Kiểm tra sách trả trễ
            var overdueBooks = await _context.PhieuMus
                .Where(pm => pm.MaDG == readerId && pm.HanTra < DateTime.Now && pm.TrangThai == "DangMuon")
                .CountAsync();

            // Quy tắc khóa tài khoản
            if (violationCount >= 5)
            {
                result.ShouldLock = true;
                result.Reason = $"Vi phạm {violationCount} lần - Khóa tài khoản 30 ngày";
                result.LockDays = 30;
            }
            else if (unpaidFines >= 500000) // 500,000 VND
            {
                result.ShouldLock = true;
                result.Reason = $"Nợ phạt {unpaidFines:N0} VND - Khóa tài khoản cho đến khi thanh toán";
                result.LockDays = -1; // Khóa vĩnh viễn cho đến khi thanh toán
            }
            else if (overdueBooks >= 3)
            {
                result.ShouldLock = true;
                result.Reason = $"Có {overdueBooks} sách trả trễ - Khóa tài khoản 15 ngày";
                result.LockDays = 15;
            }

            return result;
        }

        // Tạo phiếu thu phạt tiền
        public async Task<PhieuThu> CreateFineReceipt(CreateFineReceiptDto dto)
        {
            var fineReceipt = new PhieuThu
            {
                NgayThu = DateTime.Now,
                MaDG = dto.MaDG,
                LoaiThu = "PhiPhat",
                SoTien = dto.SoTien,
                HinhThucThanhToan = dto.HinhThucThanhToan,
                GhiChu = dto.GhiChu,
                TrangThai = "ChuaThu",
                NguoiThu = dto.NguoiThu,
                LoaiViPham = dto.LoaiViPham,
                MaSach = dto.MaSach,
                TenSach = dto.TenSach,
                SoNgayTre = dto.SoNgayTre,
                MaPhieuMuon = dto.MaPhieuMuon,
                MaBaoCaoViPham = dto.MaBaoCaoViPham,
                MaGiaoDich = dto.MaGiaoDich,
                NgayTao = DateTime.Now
            };

            _context.PhieuThus.Add(fineReceipt);
            await _context.SaveChangesAsync();

            return fineReceipt;
        }

        // Xử lý thanh toán phạt tiền
        public async Task<bool> ProcessFinePayment(int maPhieuThu, string nguoiThu)
        {
            var fineReceipt = await _context.PhieuThus.FindAsync(maPhieuThu);
            if (fineReceipt == null) return false;

            fineReceipt.TrangThai = "DaThu";
            fineReceipt.NguoiThu = nguoiThu;
            fineReceipt.NgayCapNhat = DateTime.Now;

            // Cập nhật trạng thái báo cáo vi phạm nếu có
            if (fineReceipt.MaBaoCaoViPham.HasValue)
            {
                var violationReport = await _context.BaoCaoViPhams.FindAsync(fineReceipt.MaBaoCaoViPham.Value);
                if (violationReport != null)
                {
                    violationReport.TrangThai = "Đã phạt";
                    violationReport.UpdatedAt = DateTime.Now;
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        // Lấy thống kê phạt tiền
        public async Task<FineStatisticsDto> GetFineStatistics(DateTime? fromDate = null, DateTime? toDate = null)
        {
            var query = _context.PhieuThus.Where(pt => pt.LoaiThu == "PhiPhat");

            if (fromDate.HasValue)
                query = query.Where(pt => pt.NgayThu >= fromDate.Value);

            if (toDate.HasValue)
                query = query.Where(pt => pt.NgayThu <= toDate.Value);

            var fines = await query.ToListAsync();

            return new FineStatisticsDto
            {
                TotalFines = fines.Count,
                TotalAmount = fines.Sum(f => f.SoTien),
                PaidAmount = fines.Where(f => f.TrangThai == "DaThu").Sum(f => f.SoTien),
                UnpaidAmount = fines.Where(f => f.TrangThai == "ChuaThu").Sum(f => f.SoTien),
                OverdueFines = fines.Count(f => f.LoaiViPham == "Trả trễ"),
                DamagedFines = fines.Count(f => f.LoaiViPham == "Hư hỏng"),
                LostFines = fines.Count(f => f.LoaiViPham == "Mất"),
                TopViolators = await GetTopViolators(fromDate, toDate)
            };
        }

        // Lấy danh sách Reader vi phạm nhiều nhất
        private async Task<List<TopViolatorDto>> GetTopViolators(DateTime? fromDate, DateTime? toDate)
        {
            var query = _context.PhieuThus
                .Where(pt => pt.LoaiThu == "PhiPhat")
                .GroupBy(pt => new { pt.MaDG, pt.DocGia.HoTen })
                .Select(g => new TopViolatorDto
                {
                    MaDG = g.Key.MaDG,
                    TenDG = g.Key.HoTen,
                    ViolationCount = g.Count(),
                    TotalFineAmount = g.Sum(pt => pt.SoTien),
                    UnpaidAmount = g.Where(pt => pt.TrangThai == "ChuaThu").Sum(pt => pt.SoTien)
                })
                .OrderByDescending(v => v.ViolationCount)
                .Take(10);

            return await query.ToListAsync();
        }
    }

    public class AccountLockResult
    {
        public bool ShouldLock { get; set; }
        public string Reason { get; set; } = string.Empty;
        public int LockDays { get; set; } // -1 = khóa vĩnh viễn
    }

    public class CreateFineReceiptDto
    {
        public int MaDG { get; set; }
        public decimal SoTien { get; set; }
        public string HinhThucThanhToan { get; set; } = string.Empty;
        public string GhiChu { get; set; } = string.Empty;
        public string NguoiThu { get; set; } = string.Empty;
        public string LoaiViPham { get; set; } = string.Empty;
        public int? MaSach { get; set; }
        public string TenSach { get; set; } = string.Empty;
        public int? SoNgayTre { get; set; }
        public int? MaPhieuMuon { get; set; }
        public int? MaBaoCaoViPham { get; set; }
        public string MaGiaoDich { get; set; } = string.Empty;
    }

    public class FineStatisticsDto
    {
        public int TotalFines { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal UnpaidAmount { get; set; }
        public int OverdueFines { get; set; }
        public int DamagedFines { get; set; }
        public int LostFines { get; set; }
        public List<TopViolatorDto> TopViolators { get; set; } = new List<TopViolatorDto>();
    }

    public class TopViolatorDto
    {
        public int MaDG { get; set; }
        public string TenDG { get; set; } = string.Empty;
        public int ViolationCount { get; set; }
        public decimal TotalFineAmount { get; set; }
        public decimal UnpaidAmount { get; set; }
    }
} 