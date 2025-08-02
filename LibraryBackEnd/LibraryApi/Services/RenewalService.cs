using LibraryApi.Data;
using LibraryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryApi.Services
{
    public class RenewalService
    {
        private readonly LibraryContext _context;
        private readonly DocGiaService _docGiaService;

        public RenewalService(LibraryContext context, DocGiaService docGiaService)
        {
            _context = context;
            _docGiaService = docGiaService;
        }

        // Kiểm tra điều kiện gia hạn sách
        public async Task<(bool Success, string Message)> CheckRenewalConditions(int maPhieuMuon, int maSach, int maDG)
        {
            // Kiểm tra phiếu mượn có tồn tại và đang mượn không
            var phieuMuon = await _context.PhieuMuons
                .Include(p => p.CT_PhieuMuons)
                .FirstOrDefaultAsync(p => p.MaPhieuMuon == maPhieuMuon && p.MaDG == maDG);

            if (phieuMuon == null)
            {
                return (false, "Phiếu mượn không tồn tại");
            }

            if (phieuMuon.TrangThai != "borrowed")
            {
                return (false, "Phiếu mượn không ở trạng thái đang mượn");
            }

            // Kiểm tra sách có trong phiếu mượn không
            var chiTietMuon = phieuMuon.CT_PhieuMuons.FirstOrDefault(ct => ct.MaSach == maSach);
            if (chiTietMuon == null)
            {
                return (false, "Sách không có trong phiếu mượn này");
            }

            // Kiểm tra sách có bị trễ hạn không
            if (phieuMuon.HanTra < DateTime.Now)
            {
                return (false, "Không thể gia hạn sách đã quá hạn trả");
            }

            // Kiểm tra sách có người đặt trước không
            var coDatTruoc = await _context.PhieuDatTruocs
                .AnyAsync(dt => dt.MaSach == maSach && dt.TrangThai == "pending");
            if (coDatTruoc)
            {
                return (false, "Không thể gia hạn sách có người đặt trước");
            }

            // Kiểm tra số lần gia hạn đã dùng
            var soLanGiaHan = await _context.PhieuGiaHans
                .CountAsync(gh => gh.MaPhieuMuon == maPhieuMuon && gh.MaSach == maSach && gh.TrangThai == "DaDuyet");

            var docGia = await _context.DocGias.FindAsync(maDG);
            if (docGia == null)
            {
                return (false, "Reader không tồn tại");
            }

            if (soLanGiaHan >= docGia.SoLanGiaHanToiDa)
            {
                return (false, $"Đã gia hạn tối đa {docGia.SoLanGiaHanToiDa} lần cho sách này");
            }

            return (true, "OK");
        }

        // Tạo yêu cầu gia hạn
        public async Task<(bool Success, string Message, PhieuGiaHan? PhieuGiaHan)> CreateRenewalRequest(CreatePhieuGiaHanDto dto)
        {
            var checkResult = await CheckRenewalConditions(dto.MaPhieuMuon, dto.MaSach, dto.MaDG);
            if (!checkResult.Success)
            {
                return (false, checkResult.Message, null);
            }

            var phieuMuon = await _context.PhieuMuons.FindAsync(dto.MaPhieuMuon);
            var docGia = await _context.DocGias.FindAsync(dto.MaDG);

            if (phieuMuon == null || docGia == null)
            {
                return (false, "Thông tin phiếu mượn hoặc Reader không hợp lệ", null);
            }

            // Tính số lần gia hạn đã dùng
            var soLanGiaHan = await _context.PhieuGiaHans
                .CountAsync(gh => gh.MaPhieuMuon == dto.MaPhieuMuon && gh.MaSach == dto.MaSach && gh.TrangThai == "DaDuyet");

            var phieuGiaHan = new PhieuGiaHan
            {
                MaPhieuMuon = dto.MaPhieuMuon,
                MaSach = dto.MaSach,
                MaDG = dto.MaDG,
                NgayGiaHan = DateTime.Now,
                NgayHetHanCu = phieuMuon.HanTra,
                NgayHetHanMoi = phieuMuon.HanTra.AddDays(docGia.SoNgayGiaHan),
                SoNgayGiaHan = docGia.SoNgayGiaHan,
                LanGiaHan = soLanGiaHan + 1,
                TrangThai = "ChoDuyet",
                GhiChu = dto.GhiChu,
                NgayTao = DateTime.Now
            };

            _context.PhieuGiaHans.Add(phieuGiaHan);
            await _context.SaveChangesAsync();

            return (true, "Tạo yêu cầu gia hạn thành công", phieuGiaHan);
        }

        // Duyệt yêu cầu gia hạn
        public async Task<(bool Success, string Message)> ApproveRenewal(int maGiaHan, string nguoiDuyet, string? ghiChu = null)
        {
            var phieuGiaHan = await _context.PhieuGiaHans
                .Include(gh => gh.PhieuMuon)
                .FirstOrDefaultAsync(gh => gh.MaGiaHan == maGiaHan);

            if (phieuGiaHan == null)
            {
                return (false, "Phiếu gia hạn không tồn tại");
            }

            if (phieuGiaHan.TrangThai != "ChoDuyet")
            {
                return (false, "Phiếu gia hạn không ở trạng thái chờ duyệt");
            }

            // Cập nhật trạng thái phiếu gia hạn
            phieuGiaHan.TrangThai = "DaDuyet";
            phieuGiaHan.NguoiDuyet = nguoiDuyet;
            phieuGiaHan.NgayDuyet = DateTime.Now;
            phieuGiaHan.GhiChu = ghiChu ?? phieuGiaHan.GhiChu;
            phieuGiaHan.NgayCapNhat = DateTime.Now;

            // Cập nhật hạn trả trong phiếu mượn
            if (phieuGiaHan.PhieuMuon != null)
            {
                phieuGiaHan.PhieuMuon.HanTra = phieuGiaHan.NgayHetHanMoi;
                phieuGiaHan.PhieuMuon.NgayCapNhat = DateTime.Now;
            }

            await _context.SaveChangesAsync();

            return (true, "Duyệt gia hạn thành công");
        }

        // Từ chối yêu cầu gia hạn
        public async Task<(bool Success, string Message)> RejectRenewal(int maGiaHan, string nguoiDuyet, string lyDoTuChoi)
        {
            var phieuGiaHan = await _context.PhieuGiaHans
                .FirstOrDefaultAsync(gh => gh.MaGiaHan == maGiaHan);

            if (phieuGiaHan == null)
            {
                return (false, "Phiếu gia hạn không tồn tại");
            }

            if (phieuGiaHan.TrangThai != "ChoDuyet")
            {
                return (false, "Phiếu gia hạn không ở trạng thái chờ duyệt");
            }

            phieuGiaHan.TrangThai = "TuChoi";
            phieuGiaHan.NguoiDuyet = nguoiDuyet;
            phieuGiaHan.NgayDuyet = DateTime.Now;
            phieuGiaHan.LyDoTuChoi = lyDoTuChoi;
            phieuGiaHan.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();

            return (true, "Từ chối gia hạn thành công");
        }

        // Lấy danh sách yêu cầu gia hạn
        public async Task<List<PhieuGiaHanDto>> GetRenewalRequests(string? trangThai = null)
        {
            var query = _context.PhieuGiaHans
                .Include(gh => gh.Sach)
                .Include(gh => gh.DocGia)
                .AsQueryable();

            if (!string.IsNullOrEmpty(trangThai))
            {
                query = query.Where(gh => gh.TrangThai == trangThai);
            }

            var phieuGiaHans = await query
                .OrderByDescending(gh => gh.NgayTao)
                .ToListAsync();

            return phieuGiaHans.Select(gh => new PhieuGiaHanDto
            {
                MaGiaHan = gh.MaGiaHan,
                MaPhieuMuon = gh.MaPhieuMuon,
                MaSach = gh.MaSach,
                MaDG = gh.MaDG,
                NgayGiaHan = gh.NgayGiaHan,
                NgayHetHanCu = gh.NgayHetHanCu,
                NgayHetHanMoi = gh.NgayHetHanMoi,
                SoNgayGiaHan = gh.SoNgayGiaHan,
                LanGiaHan = gh.LanGiaHan,
                TrangThai = gh.TrangThai,
                LyDoTuChoi = gh.LyDoTuChoi,
                NguoiDuyet = gh.NguoiDuyet,
                NgayDuyet = gh.NgayDuyet,
                GhiChu = gh.GhiChu,
                NgayTao = gh.NgayTao,
                NgayCapNhat = gh.NgayCapNhat,
                TenSach = gh.Sach?.TenSach ?? "",
                TenDocGia = gh.DocGia?.HoTen ?? ""
            }).ToList();
        }

        // Lấy yêu cầu gia hạn theo Reader
        public async Task<List<PhieuGiaHanDto>> GetRenewalRequestsByReader(int maDG)
        {
            var phieuGiaHans = await _context.PhieuGiaHans
                .Include(gh => gh.Sach)
                .Include(gh => gh.DocGia)
                .Where(gh => gh.MaDG == maDG)
                .OrderByDescending(gh => gh.NgayTao)
                .ToListAsync();

            return phieuGiaHans.Select(gh => new PhieuGiaHanDto
            {
                MaGiaHan = gh.MaGiaHan,
                MaPhieuMuon = gh.MaPhieuMuon,
                MaSach = gh.MaSach,
                MaDG = gh.MaDG,
                NgayGiaHan = gh.NgayGiaHan,
                NgayHetHanCu = gh.NgayHetHanCu,
                NgayHetHanMoi = gh.NgayHetHanMoi,
                SoNgayGiaHan = gh.SoNgayGiaHan,
                LanGiaHan = gh.LanGiaHan,
                TrangThai = gh.TrangThai,
                LyDoTuChoi = gh.LyDoTuChoi,
                NguoiDuyet = gh.NguoiDuyet,
                NgayDuyet = gh.NgayDuyet,
                GhiChu = gh.GhiChu,
                NgayTao = gh.NgayTao,
                NgayCapNhat = gh.NgayCapNhat,
                TenSach = gh.Sach?.TenSach ?? "",
                TenDocGia = gh.DocGia?.HoTen ?? ""
            }).ToList();
        }
    }
} 