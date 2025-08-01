using LibraryApi.Data;
using LibraryApi.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryApi.Services
{
    public interface IBaoCaoService
    {
        Task<BaoCaoResponseDto> GetBaoCaoDoanhThuAsync(DateTime tuNgay, DateTime denNgay);
        Task<List<BaoCaoDoanhThuPhiThanhVienDto>> GetBaoCaoPhiThanhVienAsync(DateTime tuNgay, DateTime denNgay);
        Task<List<BaoCaoDoanhThuPhiPhatDto>> GetBaoCaoPhiPhatAsync(DateTime tuNgay, DateTime denNgay);
    }

    public class BaoCaoService : IBaoCaoService
    {
        private readonly LibraryContext _context;

        public BaoCaoService(LibraryContext context)
        {
            _context = context;
        }

        public async Task<BaoCaoResponseDto> GetBaoCaoDoanhThuAsync(DateTime tuNgay, DateTime denNgay)
        {
            var phiThanhVien = await GetBaoCaoPhiThanhVienAsync(tuNgay, denNgay);
            var phiPhat = await GetBaoCaoPhiPhatAsync(tuNgay, denNgay);

            return new BaoCaoResponseDto
            {
                DanhSachPhiThanhVien = phiThanhVien,
                DanhSachPhiPhat = phiPhat,
                TongDoanhThuPhiThanhVien = phiThanhVien.Sum(x => x.ThanhTien),
                TongDoanhThuPhiPhat = phiPhat.Sum(x => x.ThanhTien),
                TongDoanhThu = phiThanhVien.Sum(x => x.ThanhTien) + phiPhat.Sum(x => x.ThanhTien)
            };
        }

        public async Task<List<BaoCaoDoanhThuPhiThanhVienDto>> GetBaoCaoPhiThanhVienAsync(DateTime tuNgay, DateTime denNgay)
        {
            // Lấy dữ liệu từ bảng PhieuThu với loại thu là phí thành viên
            var phiThanhVien = await _context.PhieuThus
                .Where(pt => pt.NgayThu >= tuNgay && pt.NgayThu <= denNgay && 
                            (pt.LoaiThu.Contains("thành viên") || pt.LoaiThu.Contains("member") || 
                             pt.LoaiThu.Contains("phí thẻ") || pt.LoaiThu.Contains("card fee")))
                .Join(_context.TheThuViens,
                    pt => pt.MaDG,
                    tt => tt.MaDG,
                    (pt, tt) => new BaoCaoDoanhThuPhiThanhVienDto
                    {
                        NgayBaoCao = pt.NgayThu,
                        LoaiThe = tt.LoaiThe ?? "Không xác định",
                        ThanhTien = pt.SoTien
                    })
                .ToListAsync();

            // Nhóm theo ngày và loại thẻ
            var result = phiThanhVien
                .GroupBy(x => new { x.NgayBaoCao.Date, x.LoaiThe })
                .Select(g => new BaoCaoDoanhThuPhiThanhVienDto
                {
                    NgayBaoCao = g.Key.Date,
                    LoaiThe = g.Key.LoaiThe,
                    ThanhTien = g.Sum(x => x.ThanhTien)
                })
                .OrderBy(x => x.NgayBaoCao)
                .ThenBy(x => x.LoaiThe)
                .ToList();

            return result;
        }

        public async Task<List<BaoCaoDoanhThuPhiPhatDto>> GetBaoCaoPhiPhatAsync(DateTime tuNgay, DateTime denNgay)
        {
            // Lấy dữ liệu từ bảng PhieuPhat
            var phiPhat = await _context.PhieuPhats
                .Where(pp => pp.NgayLap >= tuNgay && pp.NgayLap <= denNgay)
                .Select(pp => new BaoCaoDoanhThuPhiPhatDto
                {
                                            NgayBaoCao = pp.NgayLap ?? DateTime.Now,
                    NguonThu = pp.LoaiPhat ?? "Không xác định",
                    SoLuong = 1, // Mỗi phiếu phạt = 1 lần
                    ThanhTien = pp.SoTien ?? 0
                })
                .ToListAsync();

            // Nhóm theo ngày và nguồn thu
            var result = phiPhat
                .GroupBy(x => new { x.NgayBaoCao.Date, x.NguonThu })
                .Select(g => new BaoCaoDoanhThuPhiPhatDto
                {
                    NgayBaoCao = g.Key.Date,
                    NguonThu = g.Key.NguonThu,
                    SoLuong = g.Count(),
                    ThanhTien = g.Sum(x => x.ThanhTien)
                })
                .OrderBy(x => x.NgayBaoCao)
                .ThenBy(x => x.NguonThu)
                .ToList();

            return result;
        }
    }
} 