using System;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class NhatKyHoatDong
    {
        [Key]
        public int MaNK { get; set; } // PRIMARY KEY
        public int MaND { get; set; }
        public NguoiDung NguoiDung { get; set; }
        public DateTime? ThoiGian { get; set; }
        public string HanhDong { get; set; }
    }
} 