using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class PhieuKiemKe
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string KyKiemKe { get; set; }
        
        [Required]
        public DateTime NgayKiemKe { get; set; }
        
        [Required]
        [StringLength(100)]
        public string NhanVienThucHien { get; set; }
        
        [StringLength(500)]
        public string? GhiChu { get; set; }
        
        [StringLength(20)]
        public string TrangThai { get; set; } = "pending"; // pending, completed, cancelled
        
        public DateTime NgayTao { get; set; } = DateTime.Now;
        
        public DateTime? NgayCapNhat { get; set; }
        
        // Navigation property
        public virtual ICollection<ChiTietPhieuKiemKe> ChiTietPhieuKiemKe { get; set; } = new List<ChiTietPhieuKiemKe>();
    }
} 