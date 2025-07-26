using LibraryApi.Data;
using LibraryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryApi.Services
{
    public class BorrowService
    {
        private readonly LibraryContext _context;
        public BorrowService(LibraryContext context)
        {
            _context = context;
        }

        public async Task<(bool Success, string Message)> CheckBorrowConditions(int maDG, List<int> maSachList)
        {
            var docGia = await _context.DocGias.FindAsync(maDG);
            if (docGia == null)
                return (false, "Độc giả không tồn tại");
            if (docGia.MemberStatus != "DaThanhToan")
                return (false, "Chỉ thành viên đã thanh toán mới được mượn sách. Vui lòng đăng ký và thanh toán gói thành viên tại quầy thủ thư.");
            // Có thể bổ sung kiểm tra khác nếu cần
            foreach (var maSach in maSachList)
            {
                var sach = await _context.Saches.FindAsync(maSach);
                if (sach == null)
                    return (false, $"Sách ID {maSach} không tồn tại");
                if (sach.SoLuong == null || sach.SoLuong <= 0)
                    return (false, $"Sách '{sach.TenSach}' đã hết, không thể mượn");
            }
            return (true, "OK");
        }

        public async Task<(bool Success, string Message, PhieuMuon? PhieuMuon)> CreateBorrow(int maDG, List<int> maSachList, int soNgayMuon = 14, string? ghiChu = null)
        {
            var check = await CheckBorrowConditions(maDG, maSachList);
            if (!check.Success)
                return (false, check.Message, null);
            var now = DateTime.Now;
            var ngayTraDuKien = now.AddDays(soNgayMuon);
            var phieu = new PhieuMuon
            {
                MaDG = maDG,
                NgayMuon = now,
                NgayTraDuKien = ngayTraDuKien,
                NguoiLap = "",
                CT_PhieuMuons = new List<CT_PhieuMuon>()
            };
            foreach (var maSach in maSachList)
            {
                var sach = await _context.Saches.FindAsync(maSach);
                if (sach == null || sach.SoLuong == null || sach.SoLuong <= 0)
                    continue;
                phieu.CT_PhieuMuons.Add(new CT_PhieuMuon
                {
                    MaSach = maSach,
                    Sach = sach
                });
                sach.SoLuong--;
            }
            _context.PhieuMuons.Add(phieu);
            await _context.SaveChangesAsync();
            return (true, "Tạo phiếu mượn thành công", phieu);
        }

        public async Task<(bool Success, string Message)> ReturnBook(int maPhieuMuon, int maSach)
        {
            var chitiet = await _context.CT_PhieuMuons
                .FirstOrDefaultAsync(ct => ct.MaPhieuMuon == maPhieuMuon && ct.MaSach == maSach);
            if (chitiet == null)
                return (false, "Không tìm thấy chi tiết phiếu mượn");
            // Logic trả sách chỉ cập nhật số lượng sách, không cập nhật trạng thái trên CT_PhieuMuon
            var sach = await _context.Saches.FindAsync(maSach);
            if (sach != null && sach.SoLuong != null)
                sach.SoLuong++;
            await _context.SaveChangesAsync();
            return (true, "Trả sách thành công");
        }

        // Đã loại bỏ hàm RenewBook và mọi truy cập ct.Id, ct.TrangThai, ct.NgayHenTra, ct.GhiChu trên CT_PhieuMuon
    }
} 