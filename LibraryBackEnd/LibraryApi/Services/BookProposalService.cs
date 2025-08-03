using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LibraryApi.Data;
using LibraryApi.Models;

namespace LibraryApi.Services
{
    public class BookProposalService
    {
        private readonly LibraryContext _context;

        public BookProposalService(LibraryContext context)
        {
            _context = context;
        }

        public async Task<List<PhieuDeXuatMuaSachDto>> GetAllProposalsAsync(string status = null, string priority = null)
        {
            var query = _context.PhieuDeXuatMuaSachs
                .Include(p => p.NguoiDeXuat)
                .Include(p => p.NguoiDuyet)
                .Include(p => p.ChiTietDeXuatMuaSachs)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(p => p.TrangThai == status);
            }

            if (!string.IsNullOrEmpty(priority))
            {
                query = query.Where(p => p.MucDoUuTien == priority);
            }

            var proposals = await query
                .OrderByDescending(p => p.NgayDeXuat)
                .ToListAsync();

            return proposals.Select(MapToDto).ToList();
        }

        public async Task<PhieuDeXuatMuaSachDto> GetProposalByIdAsync(int id)
        {
            var proposal = await _context.PhieuDeXuatMuaSachs
                .Include(p => p.NguoiDeXuat)
                .Include(p => p.NguoiDuyet)
                .Include(p => p.ChiTietDeXuatMuaSachs)
                .FirstOrDefaultAsync(p => p.MaDeXuat == id);

            return proposal != null ? MapToDto(proposal) : new PhieuDeXuatMuaSachDto();
        }

        public async Task<List<PhieuDeXuatMuaSachDto>> GetProposalsByUserAsync(int userId)
        {
            var proposals = await _context.PhieuDeXuatMuaSachs
                .Include(p => p.NguoiDeXuat)
                .Include(p => p.NguoiDuyet)
                .Include(p => p.ChiTietDeXuatMuaSachs)
                .Where(p => p.MaNguoiDeXuat == userId)
                .OrderByDescending(p => p.NgayDeXuat)
                .ToListAsync();

            return proposals.Select(MapToDto).ToList();
        }

        public async Task<PhieuDeXuatMuaSachDto> CreateProposalAsync(CreatePhieuDeXuatMuaSachDto createDto)
        {
            var proposal = new PhieuDeXuatMuaSach
            {
                TieuDe = createDto.TieuDe,
                MaNguoiDeXuat = createDto.MaNguoiDeXuat,
                NgayDeXuat = DateTime.Now,
                MucDoUuTien = createDto.MucDoUuTien,
                ChiPhiDuKien = createDto.ChiPhiDuKien,
                MoTa = createDto.MoTa,
                TrangThai = "Chờ duyệt",
                GhiChu = createDto.GhiChu,
                NgayTao = DateTime.Now
            };

            _context.PhieuDeXuatMuaSachs.Add(proposal);
            await _context.SaveChangesAsync();

            // Add book details
            foreach (var chiTietDto in createDto.ChiTietDeXuatMuaSachs)
            {
                var chiTiet = new ChiTietDeXuatMuaSach
                {
                    MaDeXuat = proposal.MaDeXuat,
                    TenSach = chiTietDto.TenSach,
                    TacGia = chiTietDto.TacGia,
                    ISBN = chiTietDto.ISBN,
                    TheLoai = chiTietDto.TheLoai,
                    NhaXuatBan = chiTietDto.NhaXuatBan,
                    NamXuatBan = chiTietDto.NamXuatBan,
                    SoLuong = chiTietDto.SoLuong,
                    DonGia = chiTietDto.DonGia,
                    LyDo = chiTietDto.LyDo,
                    GhiChu = chiTietDto.GhiChu
                };

                _context.ChiTietDeXuatMuaSachs.Add(chiTiet);
            }

            await _context.SaveChangesAsync();

            return await GetProposalByIdAsync(proposal.MaDeXuat);
        }

        public async Task<PhieuDeXuatMuaSachDto> UpdateProposalAsync(int id, UpdatePhieuDeXuatMuaSachDto updateDto)
        {
            var proposal = await _context.PhieuDeXuatMuaSachs
                .Include(p => p.ChiTietDeXuatMuaSachs)
                .FirstOrDefaultAsync(p => p.MaDeXuat == id);

            if (proposal == null)
                return new PhieuDeXuatMuaSachDto();

            if (proposal.TrangThai != "Chờ duyệt")
                throw new InvalidOperationException("Chỉ có thể chỉnh sửa đề xuất đang chờ duyệt");

            proposal.TieuDe = updateDto.TieuDe;
            proposal.MucDoUuTien = updateDto.MucDoUuTien;
            proposal.ChiPhiDuKien = updateDto.ChiPhiDuKien;
            proposal.MoTa = updateDto.MoTa;
            proposal.GhiChu = updateDto.GhiChu;
            proposal.NgayCapNhat = DateTime.Now;

            // Remove existing book details
            _context.ChiTietDeXuatMuaSachs.RemoveRange(proposal.ChiTietDeXuatMuaSachs);

            // Add new book details
            foreach (var chiTietDto in updateDto.ChiTietDeXuatMuaSachs)
            {
                var chiTiet = new ChiTietDeXuatMuaSach
                {
                    MaDeXuat = proposal.MaDeXuat,
                    TenSach = chiTietDto.TenSach,
                    TacGia = chiTietDto.TacGia,
                    ISBN = chiTietDto.ISBN,
                    TheLoai = chiTietDto.TheLoai,
                    NhaXuatBan = chiTietDto.NhaXuatBan,
                    NamXuatBan = chiTietDto.NamXuatBan,
                    SoLuong = chiTietDto.SoLuong,
                    DonGia = chiTietDto.DonGia,
                    LyDo = chiTietDto.LyDo,
                    GhiChu = chiTietDto.GhiChu
                };

                _context.ChiTietDeXuatMuaSachs.Add(chiTiet);
            }

            await _context.SaveChangesAsync();

            return await GetProposalByIdAsync(id);
        }

        public async Task<PhieuDeXuatMuaSachDto> ApproveRejectProposalAsync(ApproveRejectProposalDto approveRejectDto)
        {
            var proposal = await _context.PhieuDeXuatMuaSachs
                .FirstOrDefaultAsync(p => p.MaDeXuat == approveRejectDto.MaDeXuat);

            if (proposal == null)
                return new PhieuDeXuatMuaSachDto();

            if (proposal.TrangThai != "Chờ duyệt")
                throw new InvalidOperationException("Chỉ có thể duyệt/từ chối đề xuất đang chờ duyệt");

            proposal.TrangThai = approveRejectDto.TrangThai;
            proposal.NgayDuyet = DateTime.Now;
            proposal.MaNguoiDuyet = approveRejectDto.MaNguoiDuyet;
            proposal.LyDoTuChoi = approveRejectDto.LyDoTuChoi;
            proposal.GhiChu = approveRejectDto.GhiChu;
            proposal.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();

            return await GetProposalByIdAsync(proposal.MaDeXuat);
        }

        public async Task<bool> DeleteProposalAsync(int id)
        {
            var proposal = await _context.PhieuDeXuatMuaSachs
                .Include(p => p.ChiTietDeXuatMuaSachs)
                .FirstOrDefaultAsync(p => p.MaDeXuat == id);

            if (proposal == null)
                return false;

            if (proposal.TrangThai != "Chờ duyệt")
                throw new InvalidOperationException("Chỉ có thể xóa đề xuất đang chờ duyệt");

            _context.ChiTietDeXuatMuaSachs.RemoveRange(proposal.ChiTietDeXuatMuaSachs);
            _context.PhieuDeXuatMuaSachs.Remove(proposal);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<ProposalStatisticsDto> GetStatisticsAsync()
        {
            var proposals = await _context.PhieuDeXuatMuaSachs.ToListAsync();

            return new ProposalStatisticsDto
            {
                TongDeXuat = proposals.Count,
                ChoDuyet = proposals.Count(p => p.TrangThai == "Chờ duyệt"),
                DaDuyet = proposals.Count(p => p.TrangThai == "Đã duyệt"),
                TuChoi = proposals.Count(p => p.TrangThai == "Từ chối"),
                TongChiPhi = proposals.Sum(p => p.ChiPhiDuKien),
                ChiPhiDaDuyet = proposals.Where(p => p.TrangThai == "Đã duyệt").Sum(p => p.ChiPhiDuKien),
                ChiPhiTuChoi = proposals.Where(p => p.TrangThai == "Từ chối").Sum(p => p.ChiPhiDuKien)
            };
        }

        private PhieuDeXuatMuaSachDto MapToDto(PhieuDeXuatMuaSach proposal)
        {
            return new PhieuDeXuatMuaSachDto
            {
                MaDeXuat = proposal.MaDeXuat,
                TieuDe = proposal.TieuDe,
                MaNguoiDeXuat = proposal.MaNguoiDeXuat,
                TenNguoiDeXuat = proposal.NguoiDeXuat?.TenDangNhap ?? "Không xác định",
                ChucVuNguoiDeXuat = proposal.NguoiDeXuat?.ChucVu ?? "Không xác định",
                NgayDeXuat = proposal.NgayDeXuat,
                MucDoUuTien = proposal.MucDoUuTien,
                ChiPhiDuKien = proposal.ChiPhiDuKien,
                MoTa = proposal.MoTa,
                TrangThai = proposal.TrangThai,
                NgayDuyet = proposal.NgayDuyet,
                MaNguoiDuyet = proposal.MaNguoiDuyet,
                TenNguoiDuyet = proposal.NguoiDuyet?.TenDangNhap ?? "Không xác định",
                LyDoTuChoi = proposal.LyDoTuChoi,
                GhiChu = proposal.GhiChu,
                NgayTao = proposal.NgayTao,
                NgayCapNhat = proposal.NgayCapNhat,
                ChiTietDeXuatMuaSachs = proposal.ChiTietDeXuatMuaSachs?.Select(ct => new ChiTietDeXuatMuaSachDto
                {
                    MaChiTiet = ct.MaChiTiet,
                    MaDeXuat = ct.MaDeXuat,
                    TenSach = ct.TenSach,
                    TacGia = ct.TacGia,
                    ISBN = ct.ISBN,
                    TheLoai = ct.TheLoai,
                    NhaXuatBan = ct.NhaXuatBan,
                    NamXuatBan = ct.NamXuatBan,
                    SoLuong = ct.SoLuong,
                    DonGia = ct.DonGia,
                    ThanhTien = ct.ThanhTien,
                    LyDo = ct.LyDo,
                    GhiChu = ct.GhiChu
                }).ToList() ?? new List<ChiTietDeXuatMuaSachDto>()
            };
        }
    }
} 