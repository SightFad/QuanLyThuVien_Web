using System;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class CreateDocGiaDto
    {
        [Required]
        public string HoTen { get; set; }
        
        public DateTime? NgaySinh { get; set; }
        
        [Required]
        public string GioiTinh { get; set; }
        
        [Required]
        public string DiaChi { get; set; }
        
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        public string SDT { get; set; }
        
        [Required]
        public string LoaiDocGia { get; set; } // "Thuong", "VIP", "HocSinh", "GiaoVien"
        
        public decimal PhiThanhVien { get; set; } = 0;
    }
} 