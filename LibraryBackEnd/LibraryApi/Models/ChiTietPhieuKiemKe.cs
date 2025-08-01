using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class ChiTietPhieuKiemKe
    {
        [Key]
        public int Id { get; set; }
        
        public int PhieuKiemKeId { get; set; }
        
        [Required]
        public int MaSach { get; set; }
        
        [Required]
        [StringLength(200)]
        public string TenSach { get; set; }
        
        public int SoLuongHeThong { get; set; }
        
        public int SoLuongThucTe { get; set; }
        
        public int ChenhLech { get; set; }
        
        [StringLength(200)]
        public string? GhiChu { get; set; }
        
        // Navigation properties
        public virtual PhieuKiemKe PhieuKiemKe { get; set; }
        public virtual Sach Sach { get; set; }
    }
} 