namespace LibraryApi.Models
{
    public class PhieuKiemKeDto
    {
        public int Id { get; set; }
        public string KyKiemKe { get; set; }
        public DateTime NgayKiemKe { get; set; }
        public string NhanVienThucHien { get; set; }
        public string? GhiChu { get; set; }
        public string TrangThai { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime? NgayCapNhat { get; set; }
        public List<ChiTietPhieuKiemKeDto> ChiTietSach { get; set; } = new List<ChiTietPhieuKiemKeDto>();
    }

    public class ChiTietPhieuKiemKeDto
    {
        public int Id { get; set; }
        public int MaSach { get; set; }
        public string TenSach { get; set; }
        public int SoLuongHeThong { get; set; }
        public int SoLuongThucTe { get; set; }
        public int ChenhLech { get; set; }
        public string? GhiChu { get; set; }
    }
} 