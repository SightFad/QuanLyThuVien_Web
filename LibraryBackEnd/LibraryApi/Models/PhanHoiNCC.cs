using System;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class PhanHoiNCC
    {
        [Key]
        public int MaPhieu { get; set; } // PRIMARY KEY
        public string NhaCungCap { get; set; }
        public DateTime? NgayNhan { get; set; }
        public string PhanHoi { get; set; }
        public DateTime? NgayGiaoDuKien { get; set; }
    }
} 