using LibraryApi.Data;
using LibraryApi.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryApi.Services
{
    public class ViolationService
    {
        private readonly LibraryContext _context;

        public ViolationService(LibraryContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Tạo mã vi phạm tự động
        /// </summary>
        public async Task<string> GenerateViolationCode()
        {
            var today = DateTime.Now.ToString("yyyyMMdd");
            var count = await _context.BaoCaoViPhams
                .Where(v => v.MaViPham.StartsWith($"VP{today}"))
                .CountAsync();

            return $"VP{today}{(count + 1):D3}";
        }

        /// <summary>
        /// Tính toán tiền phạt dựa trên mức độ vi phạm và số ngày trễ
        /// </summary>
        public decimal CalculateFine(string violationLevel, int? lateDays = 0)
        {
            var baseFine = violationLevel switch
            {
                "Nhẹ" => 50000m,
                "Trung bình" => 100000m,
                "Nặng" => 200000m,
                "Rất nặng" => 500000m,
                _ => 50000m
            };

            // Tính thêm phí trễ hạn
            var lateFine = (lateDays ?? 0) * 10000m;

            return baseFine + lateFine;
        }

        /// <summary>
        /// Phân loại mức độ vi phạm dựa trên số ngày trễ và tình trạng sách
        /// </summary>
        public string ClassifyViolationLevel(int lateDays, bool isBookDamaged = false)
        {
            if (isBookDamaged)
            {
                return lateDays switch
                {
                    <= 7 => "Trung bình",
                    <= 14 => "Nặng",
                    _ => "Rất nặng"
                };
            }

            return lateDays switch
            {
                <= 3 => "Nhẹ",
                <= 7 => "Trung bình",
                <= 14 => "Nặng",
                _ => "Rất nặng"
            };
        }

        /// <summary>
        /// Kiểm tra vi phạm quá hạn tự động
        /// </summary>
        public async Task CheckOverdueViolations()
        {
            var overdueBorrows = await _context.PhieuMuons
                .Include(p => p.DocGia)
                .Where(p => p.HanTra < DateTime.Now && p.NgayTra == null)
                .ToListAsync();

            foreach (var borrow in overdueBorrows)
            {
                var lateDays = (DateTime.Now - borrow.HanTra).Days;
                
                // Lấy chi tiết sách mượn
                var chiTietMuon = await _context.CT_PhieuMuons
                    .Where(ct => ct.MaPhieuMuon == borrow.MaPhieuMuon)
                    .ToListAsync();

                foreach (var ct in chiTietMuon)
                {
                    // Kiểm tra xem đã có vi phạm cho sách này chưa
                    var existingViolation = await _context.BaoCaoViPhams
                        .FirstOrDefaultAsync(v => v.MaPhieuMuon == borrow.MaPhieuMuon && v.MaSach == ct.MaSach);

                    if (existingViolation == null)
                    {
                        // Tạo vi phạm mới
                        var violation = new BaoCaoViPham
                        {
                            MaViPham = await GenerateViolationCode(),
                            MaDocGia = borrow.MaDG,
                            MaSach = ct.MaSach,
                            MaPhieuMuon = borrow.MaPhieuMuon,
                            MucDoViPham = ClassifyViolationLevel(lateDays),
                            SoNgayTre = lateDays,
                            MoTaViPham = $"Trễ hạn trả sách {lateDays} ngày",
                            NgayViPham = DateTime.Now,
                            TrangThai = "Chờ xử lý",
                            SoTienPhat = CalculateFine(ClassifyViolationLevel(lateDays), lateDays)
                        };

                        _context.BaoCaoViPhams.Add(violation);
                    }
                    else
                    {
                        // Cập nhật vi phạm hiện có
                        existingViolation.SoNgayTre = lateDays;
                        existingViolation.MucDoViPham = ClassifyViolationLevel(lateDays);
                        existingViolation.SoTienPhat = CalculateFine(ClassifyViolationLevel(lateDays), lateDays);
                        existingViolation.MoTaViPham = $"Trễ hạn trả sách {lateDays} ngày";
                    }
                }
            }

            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Gửi thông báo vi phạm cho Reader
        /// </summary>
        public async Task SendViolationNotification(int violationId)
        {
            var violation = await _context.BaoCaoViPhams
                .Include(v => v.DocGia)
                .Include(v => v.Sach)
                .FirstOrDefaultAsync(v => v.Id == violationId);

            if (violation != null)
            {
                // TODO: Implement notification service
                // Có thể gửi email, SMS hoặc push notification
                Console.WriteLine($"Thông báo vi phạm cho {violation.DocGia?.HoTen}: {violation.MoTaViPham}");
            }
        }

        /// <summary>
        /// Xử lý vi phạm
        /// </summary>
        public async Task ProcessViolation(int violationId, string processor, string notes = null)
        {
            var violation = await _context.BaoCaoViPhams.FindAsync(violationId);
            
            if (violation != null)
            {
                violation.TrangThai = "Đã xử lý";
                violation.NgayXuLy = DateTime.Now;
                violation.NguoiXuLy = processor;
                violation.GhiChu = notes;

                await _context.SaveChangesAsync();
            }
        }

        /// <summary>
        /// Lấy thống kê vi phạm theo thời gian
        /// </summary>
        public async Task<object> GetViolationStatistics(DateTime? fromDate = null, DateTime? toDate = null)
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

            var totalViolations = await query.CountAsync();
            var totalFines = await query.SumAsync(v => v.SoTienPhat ?? 0);
            var pendingViolations = await query.CountAsync(v => v.TrangThai == "Chờ xử lý");
            var processedViolations = await query.CountAsync(v => v.TrangThai == "Đã xử lý");

            var violationsByLevel = await query
                .GroupBy(v => v.MucDoViPham)
                .Select(g => new { Level = g.Key, Count = g.Count(), TotalFine = g.Sum(v => v.SoTienPhat ?? 0) })
                .ToListAsync();

            var violationsByMonth = await query
                .GroupBy(v => new { v.NgayViPham.Year, v.NgayViPham.Month })
                .Select(g => new 
                { 
                    Year = g.Key.Year, 
                    Month = g.Key.Month, 
                    Count = g.Count(),
                    TotalFine = g.Sum(v => v.SoTienPhat ?? 0)
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToListAsync();

            return new
            {
                TotalViolations = totalViolations,
                TotalFines = totalFines,
                PendingViolations = pendingViolations,
                ProcessedViolations = processedViolations,
                ViolationsByLevel = violationsByLevel,
                ViolationsByMonth = violationsByMonth
            };
        }

        /// <summary>
        /// Tạo báo cáo vi phạm
        /// </summary>
        public async Task<object> GenerateViolationReport(DateTime fromDate, DateTime toDate)
        {
            var violations = await _context.BaoCaoViPhams
                .Include(v => v.DocGia)
                .Include(v => v.Sach)
                .Where(v => v.NgayViPham >= fromDate && v.NgayViPham <= toDate)
                .OrderByDescending(v => v.NgayViPham)
                .ToListAsync();

            var report = new
            {
                ReportPeriod = $"{fromDate:dd/MM/yyyy} - {toDate:dd/MM/yyyy}",
                GeneratedDate = DateTime.Now,
                TotalViolations = violations.Count,
                TotalFines = violations.Sum(v => v.SoTienPhat ?? 0),
                ViolationsByLevel = violations
                    .GroupBy(v => v.MucDoViPham)
                    .Select(g => new
                    {
                        Level = g.Key,
                        Count = g.Count(),
                        TotalFine = g.Sum(v => v.SoTienPhat ?? 0),
                        Percentage = Math.Round((double)g.Count() / violations.Count * 100, 2)
                    })
                    .ToList(),
                TopViolators = violations
                    .GroupBy(v => v.MaDocGia)
                    .Select(g => new
                    {
                        ReaderId = g.Key,
                        ReaderName = g.First().DocGia?.HoTen,
                        ViolationCount = g.Count(),
                        TotalFine = g.Sum(v => v.SoTienPhat ?? 0)
                    })
                    .OrderByDescending(x => x.ViolationCount)
                    .Take(10)
                    .ToList(),
                Violations = violations.Select(v => new
                {
                    v.MaViPham,
                    ReaderName = v.DocGia?.HoTen,
                    BookName = v.Sach?.TenSach,
                    v.MucDoViPham,
                    v.SoNgayTre,
                    v.SoTienPhat,
                    v.TrangThai,
                    v.NgayViPham,
                    v.NgayXuLy
                }).ToList()
            };

            return report;
        }
    }
} 