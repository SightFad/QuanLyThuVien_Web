namespace LibraryApi.Models
{
    public class BaoCaoViPhamDto
    {
        public int Id { get; set; }
        public string MaViPham { get; set; } = string.Empty;
        public int MaSach { get; set; }
        public string TenSach { get; set; } = string.Empty;
        public int? SoNgayTre { get; set; }
        public string LoaiViPham { get; set; } = string.Empty;
        public string GhiChu { get; set; } = string.Empty;
        public int MaDocGia { get; set; }
        public string TenDocGia { get; set; } = string.Empty;
        public DateTime NgayTao { get; set; }
        public DateTime? NgayCapNhat { get; set; }
        public string TrangThai { get; set; } = string.Empty;
        public decimal TienPhat { get; set; }
    }
    
    public class CreateBaoCaoViPhamDto
    {
        public int MaSach { get; set; }
        public int? SoNgayTre { get; set; }
        public string LoaiViPham { get; set; } = string.Empty;
        public string GhiChu { get; set; } = string.Empty;
        public int MaDocGia { get; set; }
        public decimal TienPhat { get; set; }
    }
    
    public class UpdateBaoCaoViPhamDto
    {
        public string TrangThai { get; set; } = string.Empty;
        public string GhiChu { get; set; } = string.Empty;
        public decimal TienPhat { get; set; }
    }
} 