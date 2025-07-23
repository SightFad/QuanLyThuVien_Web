using System;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class PhieuThu
    {
        [Key]
        public int MaPhieuThu { get; set; } // PRIMARY KEY
        public int MaDG { get; set; }
        public DocGia DocGia { get; set; }
        public string LoaiThu { get; set; }
        public decimal? SoTien { get; set; }
        public DateTime? NgayThu { get; set; }
    }
} 