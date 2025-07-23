using System;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class TheThuVien
    {
        [Key]
        public int MaThe { get; set; } // PRIMARY KEY
        public int MaDG { get; set; }
        public DocGia DocGia { get; set; }
        public string LoaiThe { get; set; }
        public DateTime? NgayDK { get; set; }
        public DateTime? NgayHetHan { get; set; }
        public string TrangThai { get; set; }
    }
} 