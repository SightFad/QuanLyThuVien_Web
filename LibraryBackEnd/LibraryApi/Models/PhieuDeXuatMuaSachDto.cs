using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class PhieuDeXuatMuaSachDto
    {
        public int MaDeXuat { get; set; }
        public string TieuDe { get; set; }
        public int MaNguoiDeXuat { get; set; }
        public string TenNguoiDeXuat { get; set; }
        public string ChucVuNguoiDeXuat { get; set; }
        public DateTime NgayDeXuat { get; set; }
        public string MucDoUuTien { get; set; }
        public decimal ChiPhiDuKien { get; set; }
        public string MoTa { get; set; }
        public string TrangThai { get; set; }
        public DateTime? NgayDuyet { get; set; }
        public int? MaNguoiDuyet { get; set; }
        public string TenNguoiDuyet { get; set; }
        public string LyDoTuChoi { get; set; }
        public string GhiChu { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime? NgayCapNhat { get; set; }
        public List<ChiTietDeXuatMuaSachDto> ChiTietDeXuatMuaSachs { get; set; }
    }

    public class ChiTietDeXuatMuaSachDto
    {
        public int MaChiTiet { get; set; }
        public int MaDeXuat { get; set; }
        public string TenSach { get; set; }
        public string TacGia { get; set; }
        public string ISBN { get; set; }
        public string TheLoai { get; set; }
        public string NhaXuatBan { get; set; }
        public int? NamXuatBan { get; set; }
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
        public decimal ThanhTien { get; set; }
        public string LyDo { get; set; }
        public string GhiChu { get; set; }
    }

    public class CreatePhieuDeXuatMuaSachDto
    {
        [Required]
        [StringLength(200)]
        public string TieuDe { get; set; }
        
        [Required]
        public int MaNguoiDeXuat { get; set; }
        
        [Required]
        [StringLength(20)]
        public string MucDoUuTien { get; set; }
        
        [Required]
        public decimal ChiPhiDuKien { get; set; }
        
        [StringLength(1000)]
        public string MoTa { get; set; }
        
        [StringLength(100)]
        public string GhiChu { get; set; }
        
        [Required]
        public List<CreateChiTietDeXuatMuaSachDto> ChiTietDeXuatMuaSachs { get; set; }
    }

    public class CreateChiTietDeXuatMuaSachDto
    {
        [Required]
        [StringLength(200)]
        public string TenSach { get; set; }
        
        [StringLength(100)]
        public string TacGia { get; set; }
        
        [StringLength(20)]
        public string ISBN { get; set; }
        
        [StringLength(100)]
        public string TheLoai { get; set; }
        
        [StringLength(100)]
        public string NhaXuatBan { get; set; }
        
        public int? NamXuatBan { get; set; }
        
        [Required]
        public int SoLuong { get; set; }
        
        [Required]
        public decimal DonGia { get; set; }
        
        [StringLength(500)]
        public string LyDo { get; set; }
        
        [StringLength(100)]
        public string GhiChu { get; set; }
    }

    public class UpdatePhieuDeXuatMuaSachDto
    {
        [Required]
        [StringLength(200)]
        public string TieuDe { get; set; }
        
        [Required]
        [StringLength(20)]
        public string MucDoUuTien { get; set; }
        
        [Required]
        public decimal ChiPhiDuKien { get; set; }
        
        [StringLength(1000)]
        public string MoTa { get; set; }
        
        [StringLength(100)]
        public string GhiChu { get; set; }
        
        [Required]
        public List<CreateChiTietDeXuatMuaSachDto> ChiTietDeXuatMuaSachs { get; set; }
    }

    public class ApproveRejectProposalDto
    {
        [Required]
        public int MaDeXuat { get; set; }
        
        [Required]
        public int MaNguoiDuyet { get; set; }
        
        [Required]
        [StringLength(20)]
        public string TrangThai { get; set; } // "Đã duyệt" hoặc "Từ chối"
        
        [StringLength(500)]
        public string LyDoTuChoi { get; set; }
        
        [StringLength(100)]
        public string GhiChu { get; set; }
    }

    public class ProposalStatisticsDto
    {
        public int TongDeXuat { get; set; }
        public int ChoDuyet { get; set; }
        public int DaDuyet { get; set; }
        public int TuChoi { get; set; }
        public decimal TongChiPhi { get; set; }
        public decimal ChiPhiDaDuyet { get; set; }
        public decimal ChiPhiTuChoi { get; set; }
    }
} 