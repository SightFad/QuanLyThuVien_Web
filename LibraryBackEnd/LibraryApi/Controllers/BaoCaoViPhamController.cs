using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryApi.Data;
using LibraryApi.Models;

namespace LibraryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaoCaoViPhamController : ControllerBase
    {
        private readonly LibraryContext _context;

        public BaoCaoViPhamController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/BaoCaoViPham
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BaoCaoViPhamDto>>> GetBaoCaoViPham()
        {
            var baoCaoViPham = await _context.BaoCaoViPhams
                .Include(x => x.DocGia)
                .Include(x => x.Sach)
                .OrderByDescending(x => x.NgayViPham)
                .ThenBy(x => x.Id)
                .Select(x => new BaoCaoViPhamDto
                {
                    Id = x.Id,
                    MaViPham = x.MaViPham,
                    MaSach = x.MaSach,
                    TenSach = x.Sach.TenSach,
                    SoNgayTre = x.SoNgayTre,
                    LoaiViPham = x.MucDoViPham,
                    GhiChu = x.GhiChu,
                    MaDocGia = x.MaDocGia,
                    TenDocGia = x.DocGia.HoTen,
                    NgayTao = x.CreatedAt,
                    NgayCapNhat = x.UpdatedAt,
                    TrangThai = x.TrangThai,
                    TienPhat = x.SoTienPhat ?? 0
                })
                .ToListAsync();

            return Ok(baoCaoViPham);
        }

        // GET: api/BaoCaoViPham/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BaoCaoViPhamDto>> GetBaoCaoViPham(int id)
        {
            var baoCaoViPham = await _context.BaoCaoViPhams
                .Include(x => x.DocGia)
                .Include(x => x.Sach)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (baoCaoViPham == null)
            {
                return NotFound();
            }

            var dto = new BaoCaoViPhamDto
            {
                Id = baoCaoViPham.Id,
                MaViPham = baoCaoViPham.MaViPham,
                MaSach = baoCaoViPham.MaSach,
                TenSach = baoCaoViPham.Sach.TenSach,
                SoNgayTre = baoCaoViPham.SoNgayTre,
                LoaiViPham = baoCaoViPham.MucDoViPham,
                GhiChu = baoCaoViPham.GhiChu,
                MaDocGia = baoCaoViPham.MaDocGia,
                TenDocGia = baoCaoViPham.DocGia.HoTen,
                NgayTao = baoCaoViPham.CreatedAt,
                NgayCapNhat = baoCaoViPham.UpdatedAt,
                TrangThai = baoCaoViPham.TrangThai,
                TienPhat = baoCaoViPham.SoTienPhat ?? 0
            };

            return Ok(dto);
        }

        // POST: api/BaoCaoViPham
        [HttpPost]
        public async Task<ActionResult<BaoCaoViPhamDto>> CreateBaoCaoViPham(CreateBaoCaoViPhamDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var baoCaoViPham = new BaoCaoViPham
            {
                MaViPham = await GenerateViolationCode(),
                MaSach = createDto.MaSach,
                SoNgayTre = createDto.SoNgayTre,
                MucDoViPham = createDto.LoaiViPham,
                GhiChu = createDto.GhiChu,
                MaDocGia = createDto.MaDocGia,
                MoTaViPham = createDto.GhiChu,
                NgayViPham = DateTime.Now,
                TrangThai = "Chờ xử lý",
                SoTienPhat = createDto.TienPhat,
                CreatedAt = DateTime.Now
            };

            _context.BaoCaoViPhams.Add(baoCaoViPham);
            await _context.SaveChangesAsync();

            // Lấy thông tin đầy đủ để trả về
            var resultDto = await GetBaoCaoViPham(baoCaoViPham.Id);
            return CreatedAtAction(nameof(GetBaoCaoViPham), new { id = baoCaoViPham.Id }, resultDto.Value);
        }

        private async Task<string> GenerateViolationCode()
        {
            var count = await _context.BaoCaoViPhams.CountAsync();
            return $"VP{DateTime.Now:yyyyMMdd}{(count + 1):D4}";
        }

        // PUT: api/BaoCaoViPham/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBaoCaoViPham(int id, UpdateBaoCaoViPhamDto updateDto)
        {
            var baoCaoViPham = await _context.BaoCaoViPhams.FindAsync(id);

            if (baoCaoViPham == null)
            {
                return NotFound();
            }

            baoCaoViPham.TrangThai = updateDto.TrangThai;
            baoCaoViPham.GhiChu = updateDto.GhiChu;
            baoCaoViPham.SoTienPhat = updateDto.TienPhat;
            baoCaoViPham.UpdatedAt = DateTime.Now;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BaoCaoViPhamExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/BaoCaoViPham/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBaoCaoViPham(int id)
        {
            var baoCaoViPham = await _context.BaoCaoViPhams.FindAsync(id);
            if (baoCaoViPham == null)
            {
                return NotFound();
            }

            _context.BaoCaoViPhams.Remove(baoCaoViPham);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/BaoCaoViPham/statistics
        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetStatistics()
        {
            var today = DateTime.Today;
            var thisMonth = new DateTime(today.Year, today.Month, 1);

            var statistics = new
            {
                Total = await _context.BaoCaoViPhams.CountAsync(),
                Today = await _context.BaoCaoViPhams.CountAsync(x => x.NgayViPham.Date == today),
                ThisMonth = await _context.BaoCaoViPhams.CountAsync(x => x.NgayViPham >= thisMonth),
                Pending = await _context.BaoCaoViPhams.CountAsync(x => x.TrangThai == "Chờ xử lý"),
                Processed = await _context.BaoCaoViPhams.CountAsync(x => x.TrangThai == "Đã xử lý"),
                Fined = await _context.BaoCaoViPhams.CountAsync(x => x.TrangThai == "Đã phạt"),
                TotalFine = await _context.BaoCaoViPhams.Where(x => x.SoTienPhat.HasValue).SumAsync(x => x.SoTienPhat.Value)
            };

            return Ok(statistics);
        }

        private bool BaoCaoViPhamExists(int id)
        {
            return _context.BaoCaoViPhams.Any(e => e.Id == id);
        }
    }
} 