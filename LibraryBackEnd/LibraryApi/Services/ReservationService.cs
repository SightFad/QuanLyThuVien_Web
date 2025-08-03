using LibraryApi.Data;
using LibraryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryApi.Services
{
    public class ReservationService
    {
        private readonly LibraryContext _context;
        public ReservationService(LibraryContext context)
        {
            _context = context;
        }

        // Kiểm tra điều kiện đặt mượn sách
        public async Task<(bool Success, string Message)> CheckBorrowConditions(int maDG, int maSach)
        {
            var docGia = await _context.DocGias.FindAsync(maDG);
            if (docGia == null)
                return (false, "Reader không tồn tại");

            // Kiểm tra sách quá hạn chưa trả
            var overdueBooks = await _context.PhieuMuons
                .Where(pm => pm.MaDG == maDG && pm.TrangThai == "overdue")
                .CountAsync();
            
            if (overdueBooks > 0)
                return (false, "Bạn có sách quá hạn chưa trả. Vui lòng trả sách trước khi mượn sách mới.");

            // Kiểm tra giới hạn sách đang mượn (tối đa 5 sách)
            var currentBorrows = await _context.PhieuMuons
                .Where(pm => pm.MaDG == maDG && pm.TrangThai == "borrowed")
                .CountAsync();
            
            if (currentBorrows >= 5)
                return (false, "Bạn đã mượn tối đa 5 sách. Vui lòng trả sách trước khi mượn sách mới.");

            // Kiểm tra giới hạn đặt trước (tối đa 3 sách)
            var currentReservations = await _context.PhieuDatTruocs
                .Where(r => r.MaDG == maDG && r.TrangThai == "Đang chờ")
                .CountAsync();
            
            if (currentReservations >= 3)
                return (false, "Bạn đã đặt trước tối đa 3 sách. Vui lòng hủy đặt trước trước khi đặt sách mới.");

            // Kiểm tra đã đặt trước sách này chưa
            var existingReservation = await _context.PhieuDatTruocs
                .AnyAsync(r => r.MaDG == maDG && r.MaSach == maSach && r.TrangThai == "Đang chờ");
            
            if (existingReservation)
                return (false, "Bạn đã đặt trước cuốn sách này rồi.");

            // Kiểm tra đã mượn sách này chưa
            var existingBorrow = await _context.PhieuMuons
                .AnyAsync(pm => pm.MaDG == maDG && pm.TrangThai == "borrowed" &&
                               pm.CT_PhieuMuons.Any(ct => ct.MaSach == maSach));
            
            if (existingBorrow)
                return (false, "Bạn đã mượn cuốn sách này rồi.");

            return (true, "OK");
        }

        // Kiểm tra điều kiện đặt trước
        public async Task<(bool Success, string Message)> CheckReservationConditions(int maDG, int maSach)
        {
            var docGia = await _context.DocGias.FindAsync(maDG);
            if (docGia == null)
                return (false, "Reader không tồn tại");

            // Kiểm tra sách quá hạn chưa trả
            var overdueBooks = await _context.PhieuMuons
                .Where(pm => pm.MaDG == maDG && pm.TrangThai == "overdue")
                .CountAsync();
            
            if (overdueBooks > 0)
                return (false, "Bạn có sách quá hạn chưa trả. Vui lòng trả sách trước khi đặt trước.");

            // Kiểm tra giới hạn đặt trước (tối đa 3 sách)
            var count = await _context.PhieuDatTruocs
                .CountAsync(r => r.MaDG == maDG && r.TrangThai == "Đang chờ");
            
            if (count >= 3)
                return (false, "Chỉ được đặt trước tối đa 3 cuốn");

            // Kiểm tra đã đặt trước sách này chưa
            var exist = await _context.PhieuDatTruocs
                .AnyAsync(r => r.MaDG == maDG && r.MaSach == maSach && r.TrangThai == "Đang chờ");
            
            if (exist)
                return (false, "Bạn đã đặt trước cuốn này rồi");

            return (true, "OK");
        }

        // Tạo phiếu đặt mượn sách (khi sách có sẵn)
        public async Task<(bool Success, string Message, PhieuMuon? BorrowTicket)> CreateBorrowTicket(int maDG, int maSach)
        {
            var check = await CheckBorrowConditions(maDG, maSach);
            if (!check.Success)
                return (false, check.Message, null);

            // Kiểm tra sách có sẵn không
            var sach = await _context.Saches.FindAsync(maSach);
            if (sach == null)
                return (false, "Sách không tồn tại", null);

            if (sach.SoLuong <= 0)
                return (false, "Sách hiện không có sẵn. Vui lòng đặt trước.", null);

            // Tạo phiếu mượn
            var phieuMuon = new PhieuMuon
            {
                MaDG = maDG,
                NgayMuon = DateTime.Now,
                HanTra = DateTime.Now.AddDays(14), // Mượn 14 ngày
                TrangThai = "borrowed",
                NguoiLap = "Hệ thống",
                GhiChu = "Đặt mượn qua web",
                NgayTao = DateTime.Now
            };

            _context.PhieuMuons.Add(phieuMuon);
            await _context.SaveChangesAsync();

            // Tạo chi tiết phiếu mượn
            var chiTietPhieuMuon = new CT_PhieuMuon
            {
                MaPhieuMuon = phieuMuon.MaPhieuMuon,
                MaSach = maSach
            };

            _context.CT_PhieuMuons.Add(chiTietPhieuMuon);

            // Giảm số lượng sách
            sach.SoLuong -= 1;

            await _context.SaveChangesAsync();

            return (true, "Đặt mượn sách thành công! Bạn có 24 giờ để đến thư viện lấy sách.", phieuMuon);
        }

        // Tạo đặt trước (khi sách không có sẵn)
        public async Task<(bool Success, string Message, PhieuDatTruoc? Reservation)> CreateReservation(int maDG, int maSach)
        {
            var check = await CheckReservationConditions(maDG, maSach);
            if (!check.Success)
                return (false, check.Message, null);

            var now = DateTime.Now;
            var reservation = new PhieuDatTruoc
            {
                MaDG = maDG,
                MaSach = maSach,
                NgayDat = now,
                TrangThai = "Đang chờ"
            };
            _context.PhieuDatTruocs.Add(reservation);
            await _context.SaveChangesAsync();

            // Lấy vị trí trong hàng đợi
            var queuePosition = await _context.PhieuDatTruocs
                .Where(r => r.MaSach == maSach && r.TrangThai == "Đang chờ")
                .OrderBy(r => r.NgayDat)
                .ToListAsync();

            var position = queuePosition.FindIndex(r => r.MaPhieuDat == reservation.MaPhieuDat) + 1;

            return (true, $"Đặt trước thành công! Bạn đang ở vị trí {position} trong hàng đợi.", reservation);
        }

        // Xử lý khi sách có sẵn lại
        public async Task ProcessBookAvailability(int maSach)
        {
            var sach = await _context.Saches.FindAsync(maSach);
            if (sach == null || sach.SoLuong <= 0) return;

            // Lấy danh sách đặt trước theo thứ tự
            var reservations = await _context.PhieuDatTruocs
                .Where(r => r.MaSach == maSach && r.TrangThai == "Đang chờ")
                .OrderBy(r => r.NgayDat)
                .Include(r => r.DocGia)
                .ToListAsync();

            foreach (var reservation in reservations)
            {
                // Kiểm tra lại điều kiện mượn
                var check = await CheckBorrowConditions(reservation.MaDG, maSach);
                if (check.Success && sach.SoLuong > 0)
                {
                    // Tạo phiếu mượn cho người đầu tiên trong hàng đợi
                    var borrowResult = await CreateBorrowTicket(reservation.MaDG, maSach);
                    if (borrowResult.Success)
                    {
                        // Cập nhật trạng thái đặt trước
                        reservation.TrangThai = "Đã xử lý";
                        await _context.SaveChangesAsync();
                        break; // Chỉ xử lý 1 người đầu tiên
                    }
                }
            }
        }

        // Hủy đặt trước
        public async Task<(bool Success, string Message)> CancelReservation(int reservationId, int maDG)
        {
            var reservation = await _context.PhieuDatTruocs
                .FirstOrDefaultAsync(r => r.MaPhieuDat == reservationId && r.MaDG == maDG);

            if (reservation == null)
                return (false, "Không tìm thấy đặt trước");

            if (reservation.TrangThai != "Đang chờ")
                return (false, "Không thể hủy đặt trước đã xử lý");

            _context.PhieuDatTruocs.Remove(reservation);
            await _context.SaveChangesAsync();

            return (true, "Hủy đặt trước thành công");
        }

        // Tự động hủy đặt trước quá hạn (24 giờ)
        public async Task AutoCancelExpiredReservations()
        {
            var expiredTime = DateTime.Now.AddHours(-24);
            var expiredReservations = await _context.PhieuDatTruocs
                .Where(r => r.TrangThai == "Đang chờ" && r.NgayDat < expiredTime)
                .ToListAsync();

            foreach (var reservation in expiredReservations)
            {
                reservation.TrangThai = "Quá hạn";
            }

            await _context.SaveChangesAsync();
        }

        // Lấy thông tin hàng đợi cho sách
        public async Task<(int Position, int Total)> GetQueuePosition(int maDG, int maSach)
        {
            var reservation = await _context.PhieuDatTruocs
                .FirstOrDefaultAsync(r => r.MaDG == maDG && r.MaSach == maSach && r.TrangThai == "Đang chờ");

            if (reservation == null)
                return (0, 0);

            var allReservations = await _context.PhieuDatTruocs
                .Where(r => r.MaSach == maSach && r.TrangThai == "Đang chờ")
                .OrderBy(r => r.NgayDat)
                .ToListAsync();

            var position = allReservations.FindIndex(r => r.MaPhieuDat == reservation.MaPhieuDat) + 1;
            return (position, allReservations.Count);
        }
    }
} 