using LibraryApi.Data;
using LibraryApi.Models;
using LibraryApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "RequireReader")]
    public class ReservationController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly ReservationService _reservationService;

        public ReservationController(LibraryContext context, ReservationService reservationService)
        {
            _context = context;
            _reservationService = reservationService;
        }

        // POST: api/Reservation/borrow - Đặt mượn sách (khi sách có sẵn)
        [HttpPost("borrow")]
        public async Task<IActionResult> CreateBorrowTicket([FromBody] CreateReservationBorrowRequest request)
        {
            var result = await _reservationService.CreateBorrowTicket(request.DocGiaId, request.SachId);
            if (!result.Success)
                return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message, borrowTicket = result.BorrowTicket });
        }

        // POST: api/Reservation - Đặt trước sách (khi sách không có sẵn)
        [HttpPost]
        public async Task<IActionResult> CreateReservation([FromBody] CreateReservationRequest request)
        {
            var result = await _reservationService.CreateReservation(request.DocGiaId, request.SachId);
            if (!result.Success)
                return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message, reservation = result.Reservation });
        }

        // GET: api/Reservation - Lấy danh sách đặt trước của Reader
        [HttpGet]
        public async Task<IActionResult> GetMyReservations([FromQuery] int docGiaId)
        {
            var reservations = await _context.PhieuDatTruocs
                .Where(r => r.MaDG == docGiaId)
                .Include(r => r.Sach)
                .OrderByDescending(r => r.NgayDat)
                .ToListAsync();
            return Ok(reservations);
        }

        // GET: api/Reservation/queue/{sachId} - Lấy thông tin hàng đợi cho sách
        [HttpGet("queue/{sachId}")]
        public async Task<IActionResult> GetQueueInfo(int sachId, [FromQuery] int docGiaId)
        {
            var queueInfo = await _reservationService.GetQueuePosition(docGiaId, sachId);
            return Ok(new { position = queueInfo.Position, total = queueInfo.Total });
        }

        // DELETE: api/Reservation/{id} - Hủy đặt trước
        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelReservation(int id, [FromQuery] int docGiaId)
        {
            var result = await _reservationService.CancelReservation(id, docGiaId);
            if (!result.Success)
                return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message });
        }

        // POST: api/Reservation/process-availability/{sachId} - Xử lý khi sách có sẵn lại
        [HttpPost("process-availability/{sachId}")]
        [Authorize(Policy = "RequireLibrarian")]
        public async Task<IActionResult> ProcessBookAvailability(int sachId)
        {
            await _reservationService.ProcessBookAvailability(sachId);
            return Ok(new { message = "Đã xử lý hàng đợi cho sách" });
        }

        // POST: api/Reservation/auto-cancel - Tự động hủy đặt trước quá hạn
        [HttpPost("auto-cancel")]
        [AllowAnonymous]
        public async Task<IActionResult> AutoCancelExpired()
        {
            await _reservationService.AutoCancelExpiredReservations();
            return Ok(new { message = "Đã tự động hủy các đặt trước quá hạn" });
        }

        // GET: api/Reservation/check-conditions - Kiểm tra điều kiện đặt mượn
        [HttpGet("check-conditions")]
        public async Task<IActionResult> CheckBorrowConditions([FromQuery] int docGiaId, [FromQuery] int sachId)
        {
            var result = await _reservationService.CheckBorrowConditions(docGiaId, sachId);
            return Ok(new { success = result.Success, message = result.Message });
        }

        // GET: api/Reservation/check-reservation-conditions - Kiểm tra điều kiện đặt trước
        [HttpGet("check-reservation-conditions")]
        public async Task<IActionResult> CheckReservationConditions([FromQuery] int docGiaId, [FromQuery] int sachId)
        {
            var result = await _reservationService.CheckReservationConditions(docGiaId, sachId);
            return Ok(new { success = result.Success, message = result.Message });
        }
    }

    public class CreateReservationRequest
    {
        public int DocGiaId { get; set; }
        public int SachId { get; set; }
    }

    public class CreateReservationBorrowRequest
    {
        public int DocGiaId { get; set; }
        public int SachId { get; set; }
    }
} 