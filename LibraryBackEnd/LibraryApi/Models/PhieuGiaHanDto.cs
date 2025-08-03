using System;

namespace LibraryApi.Models
{
    public class PhieuGiaHanDto
    {
        public int MaGiaHan { get; set; }
        public int MaPhieuMuon { get; set; }
        public int MaSach { get; set; }
        public int MaDG { get; set; }
        public DateTime NgayGiaHan { get; set; }
        public DateTime NgayHetHanCu { get; set; }
        public DateTime NgayHetHanMoi { get; set; }
        public int SoNgayGiaHan { get; set; }
        public int LanGiaHan { get; set; }
        public string TrangThai { get; set; }
        public string LyDoTuChoi { get; set; }
        public string NguoiDuyet { get; set; }
        public DateTime? NgayDuyet { get; set; }
        public string GhiChu { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime? NgayCapNhat { get; set; }
        
        // Thông tin bổ sung
        public string TenSach { get; set; }
        public string TenDocGia { get; set; }
    }

    public class CreatePhieuGiaHanDto
    {
        public int MaPhieuMuon { get; set; }
        public int MaSach { get; set; }
        public int MaDG { get; set; }
        public string GhiChu { get; set; }
    }

    public class UpdatePhieuGiaHanDto
    {
        public string TrangThai { get; set; }
        public string LyDoTuChoi { get; set; }
        public string NguoiDuyet { get; set; }
        public string GhiChu { get; set; }
    }
} 