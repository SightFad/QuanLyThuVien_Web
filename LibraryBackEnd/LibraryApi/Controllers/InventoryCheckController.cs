using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryApi.Data;
using LibraryApi.Models;

namespace LibraryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryCheckController : ControllerBase
    {
        private readonly LibraryContext _context;

        public InventoryCheckController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/InventoryCheck
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PhieuKiemKeDto>>> GetPhieuKiemKe()
        {
            try
            {
                var phieuKiemKe = await _context.PhieuKiemKes
                    .Include(p => p.ChiTietPhieuKiemKe)
                    .OrderByDescending(p => p.NgayTao)
                    .ToListAsync();

                var result = phieuKiemKe.Select(p => new PhieuKiemKeDto
                {
                    Id = p.Id,
                    KyKiemKe = p.KyKiemKe,
                    NgayKiemKe = p.NgayKiemKe,
                    NhanVienThucHien = p.NhanVienThucHien,
                    GhiChu = p.GhiChu,
                    TrangThai = p.TrangThai,
                    NgayTao = p.NgayTao,
                    NgayCapNhat = p.NgayCapNhat,
                    ChiTietSach = p.ChiTietPhieuKiemKe.Select(ct => new ChiTietPhieuKiemKeDto
                    {
                        Id = ct.Id,
                        MaSach = ct.MaSach,
                        TenSach = ct.TenSach,
                        SoLuongHeThong = ct.SoLuongHeThong,
                        SoLuongThucTe = ct.SoLuongThucTe,
                        ChenhLech = ct.ChenhLech,
                        GhiChu = ct.GhiChu
                    }).ToList()
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách phiếu kiểm kê", error = ex.Message });
            }
        }

        // GET: api/InventoryCheck/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PhieuKiemKeDto>> GetPhieuKiemKe(int id)
        {
            try
            {
                var phieuKiemKe = await _context.PhieuKiemKes
                    .Include(p => p.ChiTietPhieuKiemKe)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (phieuKiemKe == null)
                {
                    return NotFound(new { message = "Không tìm thấy phiếu kiểm kê" });
                }

                var result = new PhieuKiemKeDto
                {
                    Id = phieuKiemKe.Id,
                    KyKiemKe = phieuKiemKe.KyKiemKe,
                    NgayKiemKe = phieuKiemKe.NgayKiemKe,
                    NhanVienThucHien = phieuKiemKe.NhanVienThucHien,
                    GhiChu = phieuKiemKe.GhiChu,
                    TrangThai = phieuKiemKe.TrangThai,
                    NgayTao = phieuKiemKe.NgayTao,
                    NgayCapNhat = phieuKiemKe.NgayCapNhat,
                    ChiTietSach = phieuKiemKe.ChiTietPhieuKiemKe.Select(ct => new ChiTietPhieuKiemKeDto
                    {
                        Id = ct.Id,
                        MaSach = ct.MaSach,
                        TenSach = ct.TenSach,
                        SoLuongHeThong = ct.SoLuongHeThong,
                        SoLuongThucTe = ct.SoLuongThucTe,
                        ChenhLech = ct.ChenhLech,
                        GhiChu = ct.GhiChu
                    }).ToList()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thông tin phiếu kiểm kê", error = ex.Message });
            }
        }

        // POST: api/InventoryCheck
        [HttpPost]
        public async Task<ActionResult<PhieuKiemKeDto>> CreatePhieuKiemKe(PhieuKiemKeDto phieuKiemKeDto)
        {
            try
            {
                if (string.IsNullOrEmpty(phieuKiemKeDto.KyKiemKe))
                {
                    return BadRequest(new { message = "Kỳ kiểm kê không được để trống" });
                }

                if (string.IsNullOrEmpty(phieuKiemKeDto.NhanVienThucHien))
                {
                    return BadRequest(new { message = "Nhân viên thực hiện không được để trống" });
                }

                if (phieuKiemKeDto.ChiTietSach == null || !phieuKiemKeDto.ChiTietSach.Any())
                {
                    return BadRequest(new { message = "Phải có ít nhất một sách trong danh sách kiểm kê" });
                }

                var phieuKiemKe = new PhieuKiemKe
                {
                    KyKiemKe = phieuKiemKeDto.KyKiemKe,
                    NgayKiemKe = phieuKiemKeDto.NgayKiemKe,
                    NhanVienThucHien = phieuKiemKeDto.NhanVienThucHien,
                    GhiChu = phieuKiemKeDto.GhiChu,
                    TrangThai = "pending",
                    NgayTao = DateTime.Now
                };

                _context.PhieuKiemKes.Add(phieuKiemKe);
                await _context.SaveChangesAsync();

                // Add chi tiết phiếu kiểm kê
                foreach (var chiTiet in phieuKiemKeDto.ChiTietSach)
                {
                    var chiTietPhieuKiemKe = new ChiTietPhieuKiemKe
                    {
                        PhieuKiemKeId = phieuKiemKe.Id,
                        MaSach = chiTiet.MaSach,
                        TenSach = chiTiet.TenSach,
                        SoLuongHeThong = chiTiet.SoLuongHeThong,
                        SoLuongThucTe = chiTiet.SoLuongThucTe,
                        ChenhLech = chiTiet.ChenhLech,
                        GhiChu = chiTiet.GhiChu
                    };

                    _context.ChiTietPhieuKiemKes.Add(chiTietPhieuKiemKe);
                }

                await _context.SaveChangesAsync();

                // Return the created entity
                return CreatedAtAction(nameof(GetPhieuKiemKe), new { id = phieuKiemKe.Id }, phieuKiemKeDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tạo phiếu kiểm kê", error = ex.Message });
            }
        }

        // PUT: api/InventoryCheck/5/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdatePhieuKiemKeStatus(int id, [FromBody] UpdateStatusRequest request)
        {
            try
            {
                var phieuKiemKe = await _context.PhieuKiemKes.FindAsync(id);

                if (phieuKiemKe == null)
                {
                    return NotFound(new { message = "Không tìm thấy phiếu kiểm kê" });
                }

                phieuKiemKe.TrangThai = request.Status;
                phieuKiemKe.NgayCapNhat = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật trạng thái thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật trạng thái", error = ex.Message });
            }
        }

        // DELETE: api/InventoryCheck/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhieuKiemKe(int id)
        {
            try
            {
                var phieuKiemKe = await _context.PhieuKiemKes
                    .Include(p => p.ChiTietPhieuKiemKe)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (phieuKiemKe == null)
                {
                    return NotFound(new { message = "Không tìm thấy phiếu kiểm kê" });
                }

                // Delete chi tiết phiếu kiểm kê first
                _context.ChiTietPhieuKiemKes.RemoveRange(phieuKiemKe.ChiTietPhieuKiemKe);
                
                // Delete phiếu kiểm kê
                _context.PhieuKiemKes.Remove(phieuKiemKe);
                
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa phiếu kiểm kê thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xóa phiếu kiểm kê", error = ex.Message });
            }
        }
    }

    public class UpdateStatusRequest
    {
        public string Status { get; set; } = string.Empty;
    }
} 