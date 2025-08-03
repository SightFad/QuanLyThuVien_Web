using LibraryApi.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryApi.Services
{
    public class BookReservationService
    {
        private readonly LibraryContext _context;

        public BookReservationService(LibraryContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Tạo mã đặt trước tự động
        /// </summary>
        public async Task<string> GenerateReservationCode()
        {
            var today = DateTime.Now.ToString("yyyyMMdd");
            var count = await _context.DatTruocSaches
                .Where(r => r.MaDatTruoc.StartsWith($"DT{today}"))
                .CountAsync();

            return $"DT{today}{(count + 1):D3}";
        }

        /// <summary>
        /// Thông báo sách có sẵn cho độc giả
        /// </summary>
        public async Task<object> NotifyBookAvailable(int reservationId)
        {
            var reservation = await _context.DatTruocSaches
                .Include(r => r.DocGia)
                .Include(r => r.Sach)
                .FirstOrDefaultAsync(r => r.Id == reservationId);

            if (reservation == null)
            {
                throw new ArgumentException("Không tìm thấy đặt trước");
            }

            // Kiểm tra xem sách có thực sự có sẵn không
            var book = await _context.Saches.FindAsync(reservation.MaSach);
            if (book == null || book.SoLuong <= 0)
            {
                throw new InvalidOperationException("Sách chưa có sẵn");
            }

            // Cập nhật trạng thái đặt trước
            reservation.TrangThai = "Đã thông báo";
            reservation.NgayXuLy = DateTime.Now;
            reservation.GhiChu = "Đã thông báo sách có sẵn cho độc giả";

            await _context.SaveChangesAsync();

            // TODO: Implement notification service
            // Gửi thông báo cho độc giả (email, SMS, push notification)
            Console.WriteLine($"Thông báo cho {reservation.DocGia?.HoTen}: Sách '{reservation.Sach?.TenSach}' đã có sẵn");

            return new
            {
                message = "Đã thông báo sách có sẵn cho độc giả",
                reservationId = reservation.Id,
                readerName = reservation.DocGia?.HoTen,
                bookName = reservation.Sach?.TenSach,
                notificationDate = DateTime.Now
            };
        }

        /// <summary>
        /// Xử lý hàng đợi đặt trước khi sách có sẵn
        /// </summary>
        public async Task<object> ProcessReservationQueue(int bookId)
        {
            var book = await _context.Saches.FindAsync(bookId);
            if (book == null)
            {
                throw new ArgumentException("Không tìm thấy sách");
            }

            if (book.SoLuong <= 0)
            {
                throw new InvalidOperationException("Sách chưa có sẵn");
            }

            // Lấy danh sách đặt trước theo thứ tự ưu tiên (FIFO)
            var pendingReservations = await _context.DatTruocSaches
                .Include(r => r.DocGia)
                .Where(r => r.MaSach == bookId && r.TrangThai == "Chờ xử lý")
                .OrderBy(r => r.NgayDatTruoc)
                .ToListAsync();

            var processedCount = 0;
            var availableQuantity = book.SoLuong;

            foreach (var reservation in pendingReservations)
            {
                if (availableQuantity <= 0)
                {
                    break; // Hết sách
                }

                // Thông báo cho độc giả đầu tiên trong hàng đợi
                await NotifyBookAvailable(reservation.Id);
                processedCount++;
                availableQuantity--;
            }

            return new
            {
                message = $"Đã xử lý {processedCount} đặt trước cho sách '{book.TenSach}'",
                bookId = bookId,
                bookName = book.TenSach,
                processedCount = processedCount,
                remainingQuantity = availableQuantity
            };
        }

        /// <summary>
        /// Kiểm tra và xử lý đặt trước quá hạn
        /// </summary>
        public async Task<object> ProcessExpiredReservations()
        {
            var expiredReservations = await _context.DatTruocSaches
                .Include(r => r.DocGia)
                .Include(r => r.Sach)
                .Where(r => r.HanLaySach < DateTime.Now && r.TrangThai == "Chờ xử lý")
                .ToListAsync();

            var processedCount = 0;

            foreach (var reservation in expiredReservations)
            {
                // Tự động hủy đặt trước quá hạn
                reservation.TrangThai = "Đã hủy";
                reservation.NgayXuLy = DateTime.Now;
                reservation.GhiChu = "Tự động hủy do quá hạn lấy sách";

                // TODO: Gửi thông báo hủy cho độc giả
                Console.WriteLine($"Hủy đặt trước quá hạn cho {reservation.DocGia?.HoTen}: {reservation.Sach?.TenSach}");

                processedCount++;
            }

            await _context.SaveChangesAsync();

            return new
            {
                message = $"Đã xử lý {processedCount} đặt trước quá hạn",
                processedCount = processedCount,
                processedDate = DateTime.Now
            };
        }

        /// <summary>
        /// Lấy thống kê đặt trước theo thời gian
        /// </summary>
        public async Task<object> GetReservationStatistics(DateTime? fromDate = null, DateTime? toDate = null)
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

            var totalReservations = await query.CountAsync();
            var pendingReservations = await query.CountAsync(r => r.TrangThai == "Chờ xử lý");
            var processedReservations = await query.CountAsync(r => r.TrangThai == "Đã xử lý");
            var cancelledReservations = await query.CountAsync(r => r.TrangThai == "Đã hủy");
            var expiredReservations = await query.CountAsync(r => r.HanLaySach < DateTime.Now && r.TrangThai == "Chờ xử lý");

            var reservationsByStatus = await query
                .GroupBy(r => r.TrangThai)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync();

            var reservationsByMonth = await query
                .GroupBy(r => new { r.NgayDatTruoc.Year, r.NgayDatTruoc.Month })
                .Select(g => new 
                { 
                    Year = g.Key.Year, 
                    Month = g.Key.Month, 
                    Count = g.Count()
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToListAsync();

            var topReservedBooks = await query
                .GroupBy(r => r.MaSach)
                .Select(g => new
                {
                    BookId = g.Key,
                    BookName = g.First().Sach.TenSach,
                    ReservationCount = g.Count()
                })
                .OrderByDescending(x => x.ReservationCount)
                .Take(10)
                .ToListAsync();

            return new
            {
                TotalReservations = totalReservations,
                PendingReservations = pendingReservations,
                ProcessedReservations = processedReservations,
                CancelledReservations = cancelledReservations,
                ExpiredReservations = expiredReservations,
                ReservationsByStatus = reservationsByStatus,
                ReservationsByMonth = reservationsByMonth,
                TopReservedBooks = topReservedBooks
            };
        }

        /// <summary>
        /// Tạo báo cáo đặt trước
        /// </summary>
        public async Task<object> GenerateReservationReport(DateTime fromDate, DateTime toDate)
        {
            var reservations = await _context.DatTruocSaches
                .Include(r => r.DocGia)
                .Include(r => r.Sach)
                .Where(r => r.NgayDatTruoc >= fromDate && r.NgayDatTruoc <= toDate)
                .OrderByDescending(r => r.NgayDatTruoc)
                .ToListAsync();

            var report = new
            {
                ReportPeriod = $"{fromDate:dd/MM/yyyy} - {toDate:dd/MM/yyyy}",
                GeneratedDate = DateTime.Now,
                TotalReservations = reservations.Count,
                ReservationsByStatus = reservations
                    .GroupBy(r => r.TrangThai)
                    .Select(g => new
                    {
                        Status = g.Key,
                        Count = g.Count(),
                        Percentage = Math.Round((double)g.Count() / reservations.Count * 100, 2)
                    })
                    .ToList(),
                TopReaders = reservations
                    .GroupBy(r => r.MaDocGia)
                    .Select(g => new
                    {
                        ReaderId = g.Key,
                        ReaderName = g.First().DocGia?.HoTen,
                        ReservationCount = g.Count()
                    })
                    .OrderByDescending(x => x.ReservationCount)
                    .Take(10)
                    .ToList(),
                TopBooks = reservations
                    .GroupBy(r => r.MaSach)
                    .Select(g => new
                    {
                        BookId = g.Key,
                        BookName = g.First().Sach?.TenSach,
                        ReservationCount = g.Count()
                    })
                    .OrderByDescending(x => x.ReservationCount)
                    .Take(10)
                    .ToList(),
                Reservations = reservations.Select(r => new
                {
                    r.MaDatTruoc,
                    ReaderName = r.DocGia?.HoTen,
                    BookName = r.Sach?.TenSach,
                    r.TrangThai,
                    r.NgayDatTruoc,
                    r.HanLaySach,
                    r.NgayXuLy,
                    r.GhiChu
                }).ToList()
            };

            return report;
        }

        /// <summary>
        /// Gửi nhắc nhở đặt trước sắp hết hạn
        /// </summary>
        public async Task<object> SendExpirationReminders()
        {
            var tomorrow = DateTime.Now.AddDays(1);
            var expiringReservations = await _context.DatTruocSaches
                .Include(r => r.DocGia)
                .Include(r => r.Sach)
                .Where(r => r.HanLaySach.Date == tomorrow.Date && r.TrangThai == "Chờ xử lý")
                .ToListAsync();

            var sentCount = 0;

            foreach (var reservation in expiringReservations)
            {
                // TODO: Implement notification service
                // Gửi nhắc nhở cho độc giả
                Console.WriteLine($"Nhắc nhở cho {reservation.DocGia?.HoTen}: Đặt trước sách '{reservation.Sach?.TenSach}' sắp hết hạn vào ngày mai");

                sentCount++;
            }

            return new
            {
                message = $"Đã gửi {sentCount} nhắc nhở hết hạn",
                sentCount = sentCount,
                reminderDate = DateTime.Now
            };
        }

        /// <summary>
        /// Kiểm tra tình trạng đặt trước của độc giả
        /// </summary>
        public async Task<object> CheckReaderReservationStatus(string readerId)
        {
            if (!int.TryParse(readerId, out int readerIdInt))
            {
                return new { error = "ID độc giả không hợp lệ" };
            }

            var reservations = await _context.DatTruocSaches
                .Include(r => r.Sach)
                .Where(r => r.MaDocGia == readerIdInt)
                .OrderByDescending(r => r.NgayDatTruoc)
                .ToListAsync();

            var status = new
            {
                TotalReservations = reservations.Count,
                PendingReservations = reservations.Count(r => r.TrangThai == "Chờ xử lý"),
                ProcessedReservations = reservations.Count(r => r.TrangThai == "Đã xử lý"),
                CancelledReservations = reservations.Count(r => r.TrangThai == "Đã hủy"),
                ExpiredReservations = reservations.Count(r => r.HanLaySach < DateTime.Now && r.TrangThai == "Chờ xử lý"),
                ActiveReservations = reservations.Where(r => r.TrangThai == "Chờ xử lý").ToList()
            };

            return status;
        }
    }
} 