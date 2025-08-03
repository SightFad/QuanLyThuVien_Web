using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class PhieuMuon
    {
        [Key]
        public int MaPhieuMuon { get; set; }
        public int MaDG { get; set; }
        public DateTime NgayMuon { get; set; } = DateTime.Now;
        public DateTime HanTra { get; set; }
        public DateTime? NgayTra { get; set; }
        public string TrangThai { get; set; } = "borrowed"; // "borrowed", "returned", "overdue"
        public string NguoiLap { get; set; }
        public string GhiChu { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime? NgayCapNhat { get; set; }

        // Navigation
        public DocGia DocGia { get; set; }
        public ICollection<CT_PhieuMuon> CT_PhieuMuons { get; set; }
        public ICollection<PhieuGiaHan> PhieuGiaHans { get; set; }
        public ICollection<PhieuTra> PhieuTras { get; set; }

        public PhieuMuon()
        {
            CT_PhieuMuons = new List<CT_PhieuMuon>();
            PhieuGiaHans = new List<PhieuGiaHan>();
            PhieuTras = new List<PhieuTra>();
        }
    }
}