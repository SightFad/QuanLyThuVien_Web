using System;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class PhieuGiaHan
    {
        [Key]
        public int MaGiaHan { get; set; } // PRIMARY KEY
        public int MaPhieuMuon { get; set; }
        public PhieuMuon PhieuMuon { get; set; }
        public int MaSach { get; set; }
        public Sach Sach { get; set; }
        public DateTime? NgayMuonCu { get; set; }
        public DateTime? NgayHetHanMoi { get; set; }
    }
} 