using System;

namespace LibraryApi.Models
{
    public class CT_PhieuNhapKho
    {
        public int MaPhieuNhap { get; set; }
        public PhieuNhapKho PhieuNhapKho { get; set; }
        public int MaSach { get; set; }
        public Sach Sach { get; set; }
        public int? SoLuong { get; set; }
        public decimal? DonGia { get; set; }
        // PRIMARY KEY (MaPhieuNhap, MaSach)
    }
} 