using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryApi.Models
{
    public class BaoCaoViPham
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(20)]
        public string MaViPham { get; set; }

        [Required]
        public int MaDocGia { get; set; }

        [ForeignKey("MaDocGia")]
        public DocGia DocGia { get; set; }

        [Required]
        public int MaSach { get; set; }

        [ForeignKey("MaSach")]
        public Sach Sach { get; set; }

        public int? MaPhieuMuon { get; set; }

        [ForeignKey("MaPhieuMuon")]
        public PhieuMuon PhieuMuon { get; set; }

        [Required]
        [StringLength(50)]
        public string MucDoViPham { get; set; } // "Nhẹ", "Trung bình", "Nặng", "Rất nặng"

        public int? SoNgayTre { get; set; }

        [StringLength(500)]
        public string MoTaViPham { get; set; }

        public DateTime NgayViPham { get; set; }

        [StringLength(50)]
        public string TrangThai { get; set; } = "Chờ xử lý"; // "Chờ xử lý", "Đã xử lý"

        public DateTime? NgayXuLy { get; set; }

        [StringLength(100)]
        public string NguoiXuLy { get; set; }

        [StringLength(500)]
        public string GhiChu { get; set; }

        public decimal? SoTienPhat { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime? UpdatedAt { get; set; }
    }
} 