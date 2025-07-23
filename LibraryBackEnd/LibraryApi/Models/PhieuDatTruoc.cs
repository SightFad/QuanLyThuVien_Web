using System;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class PhieuDatTruoc
    {
        [Key]
        public int MaPhieuDat { get; set; } // PRIMARY KEY
        public int MaDG { get; set; }
        public DocGia DocGia { get; set; }
        public int MaSach { get; set; }
        public Sach Sach { get; set; }
        public DateTime? NgayDat { get; set; }
        public string TrangThai { get; set; }
    }
} 