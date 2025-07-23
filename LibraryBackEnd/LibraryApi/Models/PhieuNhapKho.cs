using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class PhieuNhapKho
    {
        [Key]
        public int MaPhieuNhap { get; set; } // PRIMARY KEY
        public string NhaCungCap { get; set; }
        public DateTime? NgayNhap { get; set; }
        // Navigation
        public ICollection<CT_PhieuNhapKho> CT_PhieuNhapKhos { get; set; }
    }
} 