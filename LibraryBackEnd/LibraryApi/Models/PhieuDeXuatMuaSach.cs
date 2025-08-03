using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace LibraryApi.Models
{
    public class PhieuDeXuatMuaSach
    {
        [Key]
        public int MaDeXuat { get; set; }
        
        [Required]
        [StringLength(200)]
        public string TieuDe { get; set; }
        
        [Required]
        public int MaNguoiDeXuat { get; set; } // MaND của người đề xuất
        
        [Required]
        public DateTime NgayDeXuat { get; set; } = DateTime.Now;
        
        [Required]
        [StringLength(20)]
        public string MucDoUuTien { get; set; } // "Cao", "Trung bình", "Thấp"
        
        [Required]
        public decimal ChiPhiDuKien { get; set; }
        
        [StringLength(1000)]
        public string MoTa { get; set; }
        
        [Required]
        [StringLength(20)]
        public string TrangThai { get; set; } = "Chờ duyệt"; // "Chờ duyệt", "Đã duyệt", "Từ chối"
        
        public DateTime? NgayDuyet { get; set; }
        
        public int? MaNguoiDuyet { get; set; } // MaND của người duyệt
        
        [StringLength(500)]
        public string LyDoTuChoi { get; set; }
        
        [StringLength(100)]
        public string GhiChu { get; set; }
        
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime? NgayCapNhat { get; set; }
        
        // Navigation properties
        public NguoiDung NguoiDeXuat { get; set; }
        public NguoiDung NguoiDuyet { get; set; }
        public ICollection<ChiTietDeXuatMuaSach> ChiTietDeXuatMuaSachs { get; set; }
    }
} 