using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class PhieuKiemKe
    {
        [Key]
        public int MaPhieuKK { get; set; } // PRIMARY KEY
        public DateTime? NgayKK { get; set; }
        public string NguoiKK { get; set; }
        // Navigation
        public ICollection<CT_KiemKe> CT_KiemKes { get; set; }
    }
} 