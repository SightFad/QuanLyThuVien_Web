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
    [Authorize(Policy = "RequireLibrarian")]
    public class BorrowController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly BorrowService _borrowService;

        public BorrowController(LibraryContext context, BorrowService borrowService)
        {
            _context = context;
            _borrowService = borrowService;
        }

        // POST: api/Borrow
        [HttpPost]
        public async Task<IActionResult> CreateBorrow([FromBody] CreateBorrowRequest request)
        {
            var result = await _borrowService.CreateBorrow(request.DocGiaId, request.SachIds, request.SoNgayMuon, request.GhiChu);
            if (!result.Success)
                return BadRequest(new { message = result.Message });
            return Ok(result.PhieuMuon);
        }

        // GET: api/Borrow
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var borrows = await _context.PhieuMuons
                .Include(p => p.DocGia)
                .Include(p => p.CT_PhieuMuons)
                .ThenInclude(ct => ct.Sach)
                .OrderByDescending(p => p.NgayMuon)
                .ToListAsync();
            return Ok(borrows);
        }

        // GET: api/Borrow/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var phieu = await _context.PhieuMuons
                .Include(p => p.DocGia)
                .Include(p => p.CT_PhieuMuons)
                .ThenInclude(ct => ct.Sach)
                .FirstOrDefaultAsync(p => p.MaPhieuMuon == id);
            if (phieu == null)
                return NotFound();
            return Ok(phieu);
        }

        // POST: api/Borrow/return
        [HttpPost("return")]
        public async Task<IActionResult> ReturnBook([FromBody] ReturnBookRequest request)
        {
            var result = await _borrowService.ReturnBook(request.MaPhieuMuon, request.MaSach);
            if (!result.Success)
                return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message });
        }

        // Đã xóa toàn bộ endpoint và logic liên quan đến renew (gia hạn sách)
    }

    public class CreateBorrowRequest
    {
        public int DocGiaId { get; set; }
        public List<int> SachIds { get; set; } = new List<int>();
        public int SoNgayMuon { get; set; } = 14;
        public string? GhiChu { get; set; }
    }

    public class ReturnBookRequest
    {
        public int MaPhieuMuon { get; set; }
        public int MaSach { get; set; }
    }
} 