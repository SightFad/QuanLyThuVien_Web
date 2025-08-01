using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class DocGia
    {
        [Key]
        public int MaDG { get; set; } // PRIMARY KEY
        public string HoTen { get; set; }
        public string TenDG { get; set; } // Alias for HoTen for compatibility
        public DateTime? NgaySinh { get; set; }
        public string GioiTinh { get; set; }
        public string DiaChi { get; set; }
        public string Email { get; set; }
        public string SDT { get; set; }

        // Thông tin thành viên chi tiết
        public string LoaiDocGia { get; set; } // "Thuong", "VIP", "HocSinh", "GiaoVien"
        public string CapBac { get; set; } // "Thuong", "VIP" (VIP > Thuong)
        public string MemberStatus { get; set; } // "ChuaThanhToan", "ChoXacNhan", "DaThanhToan", "HetHan", "BiKhoa", "BiHuy"
        public DateTime? NgayDangKy { get; set; }
        public DateTime? NgayHetHan { get; set; }
        public decimal PhiThanhVien { get; set; } = 0; // Phí thành viên hàng năm
        public DateTime? NgayKhoa { get; set; } // Ngày khóa tài khoản
        public int SoNgayKhoa { get; set; } = 0; // Số ngày bị khóa
        public string LyDoKhoa { get; set; } // Lý do khóa tài khoản
        public DateTime? NgayCapNhat { get; set; } // Ngày cập nhật thông tin

        // Giới hạn mượn sách
        public int SoSachToiDa { get; set; } = 5; // Số sách tối đa được mượn
        public int SoNgayMuonToiDa { get; set; } = 14; // Số ngày mượn tối đa
        public int SoLanGiaHanToiDa { get; set; } = 1; // Số lần gia hạn tối đa
        public int SoNgayGiaHan { get; set; } = 7; // Số ngày gia hạn mỗi lần

        // Navigation
        public TheThuVien TheThuVien { get; set; }
        public ICollection<PhieuMuon> PhieuMuons { get; set; }
        public ICollection<PhieuMuon> PhieuMus { get; set; } // Alias for compatibility
        public ICollection<PhieuTra> PhieuTras { get; set; }
        public ICollection<PhieuPhat> PhieuPhats { get; set; }
        public ICollection<PhieuThu> PhieuThus { get; set; }
        public ICollection<PhieuDatTruoc> PhieuDatTruocs { get; set; }
        public ICollection<PhieuGiaHan> PhieuGiaHans { get; set; }

        public DocGia()
        {
            PhieuMuons = new List<PhieuMuon>();
            PhieuMus = new List<PhieuMuon>(); // Alias
            PhieuTras = new List<PhieuTra>();
            PhieuPhats = new List<PhieuPhat>();
            PhieuThus = new List<PhieuThu>();
            PhieuDatTruocs = new List<PhieuDatTruoc>();
            PhieuGiaHans = new List<PhieuGiaHan>();
        }
    }
}
