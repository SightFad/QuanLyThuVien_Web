using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class PhieuNhapKho
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string MaPhieu { get; set; }
        
        [Required]
        public DateTime NgayNhap { get; set; }
        
        [Required]
        [StringLength(200)]
        public string NhaCungCap { get; set; }
        
        [StringLength(500)]
        public string? GhiChu { get; set; }
        
        public decimal TongTien { get; set; }
        
        [StringLength(20)]
        public string TrangThai { get; set; } = "pending"; // pending, completed, cancelled
        
        public DateTime NgayTao { get; set; } = DateTime.Now;
        
        public DateTime? NgayCapNhat { get; set; }
        
        // Navigation properties
        public virtual ICollection<ChiTietPhieuNhapKho> ChiTietPhieuNhapKho { get; set; } = new List<ChiTietPhieuNhapKho>();
    }
} 