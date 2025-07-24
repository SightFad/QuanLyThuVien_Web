using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class Sach
    {
        [Key]
        public int MaSach { get; set; } // PRIMARY KEY
        public string TenSach { get; set; }
        public string TacGia { get; set; }
        public string TheLoai { get; set; }
        public int? NamXB { get; set; }
        public string ISBN { get; set; }
        public int? SoLuong { get; set; }
        public string TrangThai { get; set; }
        public string ViTriLuuTru { get; set; }

        // Navigation
        public ICollection<CT_PhieuMuon> CT_PhieuMuons { get; set; }
        public ICollection<CT_PhieuTra> CT_PhieuTras { get; set; }
        public ICollection<PhieuDatTruoc> PhieuDatTruocs { get; set; }
        public ICollection<CT_PhieuNhapKho> CT_PhieuNhapKhos { get; set; }
        public ICollection<PhieuDeXuatMuaSach> PhieuDeXuatMuaSachs { get; set; }
        public ICollection<PhieuGiaHan> PhieuGiaHans { get; set; }
        public ICollection<CT_KiemKe> CT_KiemKes { get; set; }
    }
}
