using System;

namespace LibraryApi.Models
{
    public class CT_PhieuMuon
    {
        public int MaPhieuMuon { get; set; }
        public PhieuMuon PhieuMuon { get; set; }
        public int MaSach { get; set; }
        public Sach Sach { get; set; }
        // PRIMARY KEY (MaPhieuMuon, MaSach)
    }
} 