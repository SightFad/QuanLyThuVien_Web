using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class PhieuMuon
    {
        [Key]
        public int MaPhieuMuon { get; set; } // PRIMARY KEY
        public int MaDG { get; set; }
        public DocGia DocGia { get; set; }
        public DateTime? NgayMuon { get; set; }
        public DateTime? NgayTraDuKien { get; set; }
        public string NguoiLap { get; set; }

        // Navigation
        public ICollection<CT_PhieuMuon> CT_PhieuMuons { get; set; }
        public ICollection<PhieuGiaHan> PhieuGiaHans { get; set; }
        public ICollection<PhieuTra> PhieuTras { get; set; }
    }
}