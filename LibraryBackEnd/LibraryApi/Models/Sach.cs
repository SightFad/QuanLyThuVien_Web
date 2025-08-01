using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System;

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
        public decimal? GiaSach { get; set; } // Giá sách để tính phạt
        public string TrangThai { get; set; }
        public string ViTriLuuTru { get; set; }
        public string NhaXuatBan { get; set; } // Thêm trường nhà xuất bản
        public string AnhBia { get; set; } // Thêm trường hình ảnh bìa sách
        
        // Additional properties to fix compilation errors
        public string KeSach { get; set; } = string.Empty;
        public string MoTa { get; set; } = string.Empty;
        public int? NamXuatBan { get; set; }
        public DateTime? NgayNhap { get; set; }

        // Navigation
        public ICollection<CT_PhieuMuon> CT_PhieuMuons { get; set; }
        public ICollection<CT_PhieuTra> CT_PhieuTras { get; set; }
        public ICollection<PhieuDatTruoc> PhieuDatTruocs { get; set; }

        public ICollection<PhieuDeXuatMuaSach> PhieuDeXuatMuaSachs { get; set; }
        public ICollection<PhieuGiaHan> PhieuGiaHans { get; set; }
        public ICollection<ChiTietPhieuKiemKe> ChiTietPhieuKiemKes { get; set; }
    }
}
