using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using LibraryApi.Data;
using LibraryApi.Models;

namespace LibraryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookController : ControllerBase
    {
        private readonly LibraryContext _context;

        public BookController(LibraryContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sach>>> GetAllBooks()
        {
            var books = await _context.Saches.ToListAsync();
            return Ok(books);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Sach>> GetBook(int id)
        {
            var book = await _context.Saches.FindAsync(id);
            if (book == null) return NotFound();
            return Ok(book);
        }

        [HttpPost]
        public async Task<ActionResult<Sach>> CreateBook([FromBody] Sach request)
        {
            var book = new Sach
            {
                TenSach = request.TenSach,
                TacGia = request.TacGia,
                TheLoai = request.TheLoai,
                NhaXuatBan = request.NhaXuatBan,
                NamXuatBan = request.NamXuatBan,
                ISBN = request.ISBN,
                SoLuong = request.SoLuong ?? 1,
                ViTriLuuTru = request.ViTriLuuTru,
                KeSach = request.KeSach,
                TrangThai = request.TrangThai ?? "Có sẵn",
                MoTa = request.MoTa,
                AnhBia = request.AnhBia,
                NgayTao = DateTime.Now
            };

            _context.Saches.Add(book);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBook), new { id = book.MaSach }, book);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] Sach request)
        {
            var book = await _context.Saches.FindAsync(id);
            if (book == null) return NotFound();

            book.TenSach = request.TenSach;
            book.TacGia = request.TacGia;
            book.TheLoai = request.TheLoai;
            book.NhaXuatBan = request.NhaXuatBan;
            book.NamXuatBan = request.NamXuatBan;
            book.ISBN = request.ISBN;
            book.SoLuong = request.SoLuong ?? book.SoLuong;
            book.ViTriLuuTru = request.ViTriLuuTru;
            book.KeSach = request.KeSach;
            book.TrangThai = request.TrangThai ?? book.TrangThai;
            book.MoTa = request.MoTa;
            book.AnhBia = request.AnhBia;
            book.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Saches.FindAsync(id);
            if (book == null) return NotFound();

            _context.Saches.Remove(book);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Sach>>> SearchBooks([FromQuery] string q)
        {
            if (string.IsNullOrEmpty(q))
                return await GetAllBooks();

            var books = await _context.Saches
                .Where(b => b.TenSach.Contains(q) || b.TacGia.Contains(q) || b.TheLoai.Contains(q))
                .ToListAsync();

            return Ok(books);
        }

        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<Sach>>> GetBooksByCategory(string category)
        {
            var books = await _context.Saches
                .Where(b => b.TheLoai == category)
                .ToListAsync();

            return Ok(books);
        }

        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<Sach>>> GetBooksByStatus(string status)
        {
            var books = await _context.Saches
                .Where(b => b.TrangThai == status)
                .ToListAsync();

            return Ok(books);
        }
    }
} 