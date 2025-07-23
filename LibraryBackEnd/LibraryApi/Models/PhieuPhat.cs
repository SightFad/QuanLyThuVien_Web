using System;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class PhieuPhat
    {
        [Key]
        public int MaPhieuPhat { get; set; } // PRIMARY KEY
        public int MaDG { get; set; }
        public DocGia DocGia { get; set; }
        public string LoaiPhat { get; set; }
        public decimal? SoTien { get; set; }
        public DateTime? NgayLap { get; set; }
    }
} 