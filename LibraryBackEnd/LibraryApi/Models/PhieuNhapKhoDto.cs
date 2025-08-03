namespace LibraryApi.Models
{
    public class PhieuNhapKhoDto
    {
        public int Id { get; set; }
        public string MaPhieu { get; set; }
        public DateTime NgayNhap { get; set; }
        public string NhaCungCap { get; set; }
        public string? GhiChu { get; set; }
        public decimal TongTien { get; set; }
        public string TrangThai { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime? NgayCapNhat { get; set; }
        public List<ChiTietPhieuNhapKhoDto> ChiTietSach { get; set; } = new List<ChiTietPhieuNhapKhoDto>();
    }

    public class ChiTietPhieuNhapKhoDto
    {
        public int Id { get; set; }
        public string MaSach { get; set; }
        public string TenSach { get; set; }
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
        public decimal ThanhTien { get; set; }
    }

    public class CreatePhieuNhapKhoDto
    {
        public string MaPhieu { get; set; }
        public DateTime NgayNhap { get; set; }
        public string NhaCungCap { get; set; }
        public string? GhiChu { get; set; }
        public List<ChiTietPhieuNhapKhoDto> ChiTietSach { get; set; } = new List<ChiTietPhieuNhapKhoDto>();
    }
} 