using LibraryApi.Models;
using LibraryApi.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace LibraryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaoCaoController : ControllerBase
    {
        private readonly IBaoCaoService _baoCaoService;

        public BaoCaoController(IBaoCaoService baoCaoService)
        {
            _baoCaoService = baoCaoService;
        }

        /// <summary>
        /// Lấy báo cáo doanh thu tổng hợp (cả phí thành viên và phí phạt)
        /// </summary>
        [HttpGet("doanh-thu")]
        public async Task<ActionResult<BaoCaoResponseDto>> GetBaoCaoDoanhThu(
            [FromQuery] DateTime tuNgay,
            [FromQuery] DateTime denNgay)
        {
            try
            {
                if (tuNgay > denNgay)
                {
                    return BadRequest("Từ ngày không được lớn hơn đến ngày");
                }

                var result = await _baoCaoService.GetBaoCaoDoanhThuAsync(tuNgay, denNgay);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi nội bộ: {ex.Message}");
            }
        }

        /// <summary>
        /// Lấy báo cáo doanh thu phí thành viên (BM10)
        /// </summary>
        [HttpGet("phi-thanh-vien")]
        public async Task<ActionResult<object>> GetBaoCaoPhiThanhVien(
            [FromQuery] DateTime tuNgay,
            [FromQuery] DateTime denNgay)
        {
            try
            {
                if (tuNgay > denNgay)
                {
                    return BadRequest("Từ ngày không được lớn hơn đến ngày");
                }

                var result = await _baoCaoService.GetBaoCaoPhiThanhVienAsync(tuNgay, denNgay);
                var tongDoanhThu = result.Sum(x => x.ThanhTien);

                return Ok(new
                {
                    TieuDe = "DANH SÁCH BÁO CÁO DOANH THU PHÍ THÀNH VIÊN",
                    MaBaoCao = "BM10",
                    TuNgay = tuNgay.ToString("dd/MM/yyyy"),
                    DenNgay = denNgay.ToString("dd/MM/yyyy"),
                    DanhSach = result,
                    TongDoanhThu = tongDoanhThu,
                    TongDoanhThuFormatted = $"{tongDoanhThu:N0} VNĐ"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi nội bộ: {ex.Message}");
            }
        }

        /// <summary>
        /// Lấy báo cáo doanh thu phí phạt (BM11)
        /// </summary>
        [HttpGet("phi-phat")]
        public async Task<ActionResult<object>> GetBaoCaoPhiPhat(
            [FromQuery] DateTime tuNgay,
            [FromQuery] DateTime denNgay)
        {
            try
            {
                if (tuNgay > denNgay)
                {
                    return BadRequest("Từ ngày không được lớn hơn đến ngày");
                }

                var result = await _baoCaoService.GetBaoCaoPhiPhatAsync(tuNgay, denNgay);
                var tongDoanhThu = result.Sum(x => x.ThanhTien);

                return Ok(new
                {
                    TieuDe = "DANH SÁCH BÁO CÁO DOANH THU PHÍ PHẠT",
                    MaBaoCao = "BM11",
                    TuNgay = tuNgay.ToString("dd/MM/yyyy"),
                    DenNgay = denNgay.ToString("dd/MM/yyyy"),
                    DanhSach = result,
                    TongDoanhThu = tongDoanhThu,
                    TongDoanhThuFormatted = $"{tongDoanhThu:N0} VNĐ"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi nội bộ: {ex.Message}");
            }
        }

        /// <summary>
        /// Lấy báo cáo theo request tùy chỉnh
        /// </summary>
        [HttpPost("tuy-chinh")]
        public async Task<ActionResult<object>> GetBaoCaoTuyChinh([FromBody] BaoCaoRequestDto request)
        {
            try
            {
                if (request.TuNgay > request.DenNgay)
                {
                    return BadRequest("Từ ngày không được lớn hơn đến ngày");
                }

                switch (request.LoaiBaoCao?.ToLower())
                {
                    case "phithanhvien":
                        var phiThanhVien = await _baoCaoService.GetBaoCaoPhiThanhVienAsync(request.TuNgay, request.DenNgay);
                        return Ok(new
                        {
                            LoaiBaoCao = "PhiThanhVien",
                            TieuDe = "DANH SÁCH BÁO CÁO DOANH THU PHÍ THÀNH VIÊN",
                            MaBaoCao = "BM10",
                            TuNgay = request.TuNgay.ToString("dd/MM/yyyy"),
                            DenNgay = request.DenNgay.ToString("dd/MM/yyyy"),
                            DanhSach = phiThanhVien,
                            TongDoanhThu = phiThanhVien.Sum(x => x.ThanhTien)
                        });

                    case "phiphat":
                        var phiPhat = await _baoCaoService.GetBaoCaoPhiPhatAsync(request.TuNgay, request.DenNgay);
                        return Ok(new
                        {
                            LoaiBaoCao = "PhiPhat",
                            TieuDe = "DANH SÁCH BÁO CÁO DOANH THU PHÍ PHẠT",
                            MaBaoCao = "BM11",
                            TuNgay = request.TuNgay.ToString("dd/MM/yyyy"),
                            DenNgay = request.DenNgay.ToString("dd/MM/yyyy"),
                            DanhSach = phiPhat,
                            TongDoanhThu = phiPhat.Sum(x => x.ThanhTien)
                        });

                    default:
                        var tongHop = await _baoCaoService.GetBaoCaoDoanhThuAsync(request.TuNgay, request.DenNgay);
                        return Ok(new
                        {
                            LoaiBaoCao = "TongHop",
                            TieuDe = "BÁO CÁO DOANH THU TỔNG HỢP",
                            TuNgay = request.TuNgay.ToString("dd/MM/yyyy"),
                            DenNgay = request.DenNgay.ToString("dd/MM/yyyy"),
                            BaoCao = tongHop
                        });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi nội bộ: {ex.Message}");
            }
        }
    }
} 