using System;

namespace LibraryApi.Models
{
    public class CT_PhieuTra
    {
        public int MaPhieuTra { get; set; }
        public PhieuTra PhieuTra { get; set; }
        public int MaSach { get; set; }
        public Sach Sach { get; set; }
        public int? SoNgayMuon { get; set; }
        public decimal? TienPhat { get; set; }
        public string TinhTrang { get; set; }
        public DateTime? NgayTraThucTe { get; set; }
        // PRIMARY KEY (MaPhieuTra, MaSach)
    }
} 