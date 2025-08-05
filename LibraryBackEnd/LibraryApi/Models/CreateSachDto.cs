public class CreateSachDto
{
    public int? MaSach { get; set; }
    public string? TenSach { get; set; }
    public string? TacGia { get; set; }
    public string? TheLoai { get; set; }
    public int? NamXB { get; set; }
    public string? ISBN { get; set; }
    public int? SoLuong { get; set; }
    public string? TrangThai { get; set; }
    public string? ViTriLuuTru { get; set; }
    public string? NhaXuatBan { get; set; }
    public string? AnhBia { get; set; }
    public int? SoLuongConLai { get; set; }
    public string? MoTa { get; set; }
    public string? KeSach { get; set; }
    public DateTime? NgayNhap { get; set; }
    public DateTime? NgayTao { get; set; }
    public DateTime? NgayCapNhat { get; set; }

    // Additional properties for book details
    public int DaMuon { get; set; } // Number of times the book has been borrowed
    public int TongSoLuong { get; set; } // Total number of copies available
}