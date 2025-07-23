using System;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class PhieuCapQuyen
    {
        [Key]
        public int MaPhieuQuyen { get; set; } // PRIMARY KEY
        public int MaND { get; set; }
        public NguoiDung NguoiDung { get; set; }
        public string QuyenDuocCap { get; set; }
        public DateTime? ThoiHan { get; set; }
    }
} 