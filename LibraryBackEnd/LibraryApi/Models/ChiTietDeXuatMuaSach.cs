using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class ChiTietDeXuatMuaSach
    {
        [Key]
        public int MaChiTiet { get; set; }
        
        [Required]
        public int MaDeXuat { get; set; }
        
        [Required]
        [StringLength(200)]
        public string TenSach { get; set; }
        
        [StringLength(100)]
        public string TacGia { get; set; }
        
        [StringLength(20)]
        public string ISBN { get; set; }
        
        [StringLength(100)]
        public string TheLoai { get; set; }
        
        [StringLength(100)]
        public string NhaXuatBan { get; set; }
        
        public int? NamXuatBan { get; set; }
        
        [Required]
        public int SoLuong { get; set; }
        
        [Required]
        public decimal DonGia { get; set; }
        
        public decimal ThanhTien => SoLuong * DonGia;
        
        [StringLength(500)]
        public string LyDo { get; set; }
        
        [StringLength(100)]
        public string GhiChu { get; set; }
        
        // Navigation property
        public PhieuDeXuatMuaSach PhieuDeXuatMuaSach { get; set; }
    }
} 