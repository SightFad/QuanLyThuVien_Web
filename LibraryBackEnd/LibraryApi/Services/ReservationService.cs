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

        public async Task<(bool Success, string Message)> CheckReservationConditions(int maDG, int maSach)
        {
            var docGia = await _context.DocGias.FindAsync(maDG);
            if (docGia == null)
                return (false, "Độc giả không tồn tại");
            // Có thể bổ sung kiểm tra khác nếu cần
            var count = await _context.PhieuDatTruocs.CountAsync(r => r.MaDG == maDG && r.TrangThai == "Đang chờ");
            if (count >= 3)
                return (false, "Chỉ được đặt trước tối đa 3 cuốn");
            var exist = await _context.PhieuDatTruocs.AnyAsync(r => r.MaDG == maDG && r.MaSach == maSach && r.TrangThai == "Đang chờ");
            if (exist)
                return (false, "Bạn đã đặt trước cuốn này rồi");
            return (true, "OK");
        }

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
            return (true, "Đặt trước thành công", reservation);
        }

        public async Task AutoCancelExpiredReservations()
        {
            var now = DateTime.Now;
            var expired = await _context.PhieuDatTruocs
                .Where(r => r.TrangThai == "Đang chờ" && r.NgayDat < now.AddHours(-24))
                .ToListAsync();
            foreach (var r in expired)
            {
                r.TrangThai = "Đã hủy";
            }
            await _context.SaveChangesAsync();
        }
    }
} 