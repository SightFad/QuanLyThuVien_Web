using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class PhieuTra
    {
        [Key]
        public int MaPhieuTra { get; set; } // PRIMARY KEY
        public int MaDG { get; set; }
        public DocGia DocGia { get; set; }
        public DateTime? NgayTra { get; set; }
        public string NguoiLap { get; set; }
        public int MaPhieuMuon { get; set; }
        public PhieuMuon PhieuMuon { get; set; }
        // Navigation
        public ICollection<CT_PhieuTra> CT_PhieuTras { get; set; }
    }
} 