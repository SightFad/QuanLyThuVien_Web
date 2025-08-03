using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryApi.Data;
using LibraryApi.Models;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace LibraryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PhieuNhapKhoController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly ILogger<PhieuNhapKhoController> _logger;

        public PhieuNhapKhoController(LibraryContext context, ILogger<PhieuNhapKhoController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/PhieuNhapKho
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PhieuNhapKhoDto>>> GetPhieuNhapKho()
        {
            try
            {
                var phieuNhapKho = await _context.PhieuNhapKhos
                    .Include(p => p.ChiTietPhieuNhapKho)
                    .OrderByDescending(p => p.NgayTao)
                    .Select(p => new PhieuNhapKhoDto
                    {
                        Id = p.Id,
                        MaPhieu = p.MaPhieu,
                        NgayNhap = p.NgayNhap,
                        NhaCungCap = p.NhaCungCap,
                        GhiChu = p.GhiChu,
                        TongTien = p.TongTien,
                        TrangThai = p.TrangThai,
                        NgayTao = p.NgayTao,
                        NgayCapNhat = p.NgayCapNhat,
                        ChiTietSach = p.ChiTietPhieuNhapKho.Select(ct => new ChiTietPhieuNhapKhoDto
                        {
                            Id = ct.Id,
                            MaSach = ct.MaSach,
                            TenSach = ct.TenSach,
                            SoLuong = ct.SoLuong,
                            DonGia = ct.DonGia,
                            ThanhTien = ct.ThanhTien
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(phieuNhapKho);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting PhieuNhapKho: {ex.Message}");
                return StatusCode(500, "An error occurred while retrieving the data");
            }
        }

        // GET: api/PhieuNhapKho/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PhieuNhapKhoDto>> GetPhieuNhapKho(int id)
        {
            try
            {
                var phieuNhapKho = await _context.PhieuNhapKhos
                    .Include(p => p.ChiTietPhieuNhapKho)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (phieuNhapKho == null)
                {
                    return NotFound();
                }

                var phieuNhapKhoDto = new PhieuNhapKhoDto
                {
                    Id = phieuNhapKho.Id,
                    MaPhieu = phieuNhapKho.MaPhieu,
                    NgayNhap = phieuNhapKho.NgayNhap,
                    NhaCungCap = phieuNhapKho.NhaCungCap,
                    GhiChu = phieuNhapKho.GhiChu,
                    TongTien = phieuNhapKho.TongTien,
                    TrangThai = phieuNhapKho.TrangThai,
                    NgayTao = phieuNhapKho.NgayTao,
                    NgayCapNhat = phieuNhapKho.NgayCapNhat,
                    ChiTietSach = phieuNhapKho.ChiTietPhieuNhapKho.Select(ct => new ChiTietPhieuNhapKhoDto
                    {
                        Id = ct.Id,
                        MaSach = ct.MaSach,
                        TenSach = ct.TenSach,
                        SoLuong = ct.SoLuong,
                        DonGia = ct.DonGia,
                        ThanhTien = ct.ThanhTien
                    }).ToList()
                };

                return Ok(phieuNhapKhoDto);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting PhieuNhapKho with id {id}: {ex.Message}");
                return StatusCode(500, "An error occurred while retrieving the data");
            }
        }

        // POST: api/PhieuNhapKho
        [HttpPost]
        public async Task<ActionResult<PhieuNhapKhoDto>> CreatePhieuNhapKho(CreatePhieuNhapKhoDto createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (createDto.ChiTietSach == null || !createDto.ChiTietSach.Any())
                {
                    return BadRequest("Chi tiết sách không được để trống");
                }

                // Calculate total amount
                var tongTien = createDto.ChiTietSach.Sum(ct => ct.ThanhTien);

                var phieuNhapKho = new PhieuNhapKho
                {
                    MaPhieu = createDto.MaPhieu,
                    NgayNhap = createDto.NgayNhap,
                    NhaCungCap = createDto.NhaCungCap,
                    GhiChu = createDto.GhiChu,
                    TongTien = tongTien,
                    TrangThai = "pending",
                    NgayTao = DateTime.Now
                };

                _context.PhieuNhapKhos.Add(phieuNhapKho);
                await _context.SaveChangesAsync();

                // Add chi tiết
                foreach (var chiTiet in createDto.ChiTietSach)
                {
                    var chiTietPhieuNhap = new ChiTietPhieuNhapKho
                    {
                        PhieuNhapKhoId = phieuNhapKho.Id,
                        MaSach = chiTiet.MaSach,
                        TenSach = chiTiet.TenSach,
                        SoLuong = chiTiet.SoLuong,
                        DonGia = chiTiet.DonGia,
                        ThanhTien = chiTiet.ThanhTien
                    };

                    _context.ChiTietPhieuNhapKhos.Add(chiTietPhieuNhap);
                }

                await _context.SaveChangesAsync();

                // Update book quantities in Sach table
                foreach (var chiTiet in createDto.ChiTietSach)
                {
                    var sach = await _context.Saches.FirstOrDefaultAsync(s => s.MaSach.ToString() == chiTiet.MaSach);
                    if (sach != null)
                    {
                        sach.SoLuong = (sach.SoLuong ?? 0) + chiTiet.SoLuong;
                    }
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Created PhieuNhapKho with ID: {phieuNhapKho.Id}");

                return CreatedAtAction(nameof(GetPhieuNhapKho), new { id = phieuNhapKho.Id }, phieuNhapKho);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating PhieuNhapKho: {ex.Message}");
                return StatusCode(500, "An error occurred while creating the PhieuNhapKho");
            }
        }

        // PUT: api/PhieuNhapKho/5/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            try
            {
                var phieuNhapKho = await _context.PhieuNhapKhos.FindAsync(id);
                if (phieuNhapKho == null)
                {
                    return NotFound();
                }

                phieuNhapKho.TrangThai = status;
                phieuNhapKho.NgayCapNhat = DateTime.Now;

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Updated PhieuNhapKho status with ID: {id} to {status}");

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating PhieuNhapKho status with id {id}: {ex.Message}");
                return StatusCode(500, "An error occurred while updating the status");
            }
        }

        // DELETE: api/PhieuNhapKho/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhieuNhapKho(int id)
        {
            try
            {
                var phieuNhapKho = await _context.PhieuNhapKhos
                    .Include(p => p.ChiTietPhieuNhapKho)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (phieuNhapKho == null)
                {
                    return NotFound();
                }

                // Remove chi tiết first
                _context.ChiTietPhieuNhapKhos.RemoveRange(phieuNhapKho.ChiTietPhieuNhapKho);
                
                // Remove main record
                _context.PhieuNhapKhos.Remove(phieuNhapKho);
                
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Deleted PhieuNhapKho with ID: {id}");

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting PhieuNhapKho with id {id}: {ex.Message}");
                return StatusCode(500, "An error occurred while deleting the PhieuNhapKho");
            }
        }
    }
} 