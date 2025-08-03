using System;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class PhieuGiaHan
    {
        [Key]
        public int MaGiaHan { get; set; }
        public int MaPhieuMuon { get; set; }
        public int MaSach { get; set; }
        public int MaDG { get; set; }
        
        // Thông tin gia hạn
        public DateTime NgayGiaHan { get; set; } = DateTime.Now;
        public DateTime NgayHetHanCu { get; set; }
        public DateTime NgayHetHanMoi { get; set; }
        public int SoNgayGiaHan { get; set; } // Số ngày được gia hạn
        public int LanGiaHan { get; set; } // Lần gia hạn thứ mấy (1, 2, 3...)
        
        // Trạng thái và lý do
        public string TrangThai { get; set; } // "ChoDuyet", "DaDuyet", "TuChoi", "Huy"
        public string LyDoTuChoi { get; set; } // Lý do từ chối gia hạn
        public string NguoiDuyet { get; set; } // Người duyệt gia hạn
        public DateTime? NgayDuyet { get; set; }
        
        // Ghi chú
        public string GhiChu { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime? NgayCapNhat { get; set; }

        // Navigation
        public PhieuMuon PhieuMuon { get; set; }
        public Sach Sach { get; set; }
        public DocGia DocGia { get; set; }
    }
} 