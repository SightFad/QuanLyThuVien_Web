using LibraryApi.Data;
using LibraryApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SachController : ControllerBase
    {
        private readonly LibraryContext _context;

        public SachController(LibraryContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetBooks()
        {
            var books = await _context.Saches
                .Include(s => s.CT_PhieuMuons)
                .ToListAsync();
            var result = books.Select(book => {
                // Số sách đã mượn (chưa trả)
                int daMuon = book.CT_PhieuMuons?.Count() ?? 0;
                int tong = book.SoLuong ?? 0;
                int conLai = tong - daMuon;
                return new {
                    book.MaSach,
                    book.TenSach,
                    book.TacGia,
                    book.TheLoai,
                    book.NamXB,
                    book.ISBN,
                    book.SoLuong,
                    book.TrangThai,
                    book.ViTriLuuTru,
                    SoLuongConLai = conLai < 0 ? 0 : conLai
                };
            });
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Sach>> GetBook(int id)
        {
            var book = await _context.Saches.FirstOrDefaultAsync(s => s.MaSach == id);
            if (book == null) return NotFound();
            return book;
        }

        [HttpPost]
        public async Task<ActionResult<Sach>> CreateBook([FromBody] CreateSachDto dto)
        {
            var book = new Sach
            {
                TenSach = dto.TenSach,
                TacGia = dto.TacGia,
                TheLoai = dto.TheLoai,
                NamXB = dto.NamXB,
                ISBN = dto.ISBN,
                SoLuong = dto.SoLuong,
                TrangThai = dto.TrangThai,
                ViTriLuuTru = dto.ViTriLuuTru
            };
            _context.Saches.Add(book);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBook), new { id = book.MaSach }, book);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] CreateSachDto dto)
        {
            var book = await _context.Saches.FirstOrDefaultAsync(s => s.MaSach == id);
            if (book == null) return NotFound();
            book.TenSach = dto.TenSach;
            book.TacGia = dto.TacGia;
            book.TheLoai = dto.TheLoai;
            book.NamXB = dto.NamXB;
            book.ISBN = dto.ISBN;
            book.SoLuong = dto.SoLuong;
            book.TrangThai = dto.TrangThai;
            book.ViTriLuuTru = dto.ViTriLuuTru;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Saches.FirstOrDefaultAsync(s => s.MaSach == id);
            if (book == null) return NotFound();
            _context.Saches.Remove(book);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
