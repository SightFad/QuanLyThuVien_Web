using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryApi.Models
{
    public class ChiTietPhieuNhapKho
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int PhieuNhapKhoId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string MaSach { get; set; }
        
        [Required]
        [StringLength(200)]
        public string TenSach { get; set; }
        
        [Required]
        public int SoLuong { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal DonGia { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ThanhTien { get; set; }
        
        // Navigation properties
        [ForeignKey("PhieuNhapKhoId")]
        public virtual PhieuNhapKho PhieuNhapKho { get; set; }
    }
} 