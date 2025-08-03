using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class NguoiDung
    {
        [Key]
        public int MaND { get; set; } // PRIMARY KEY
        public string TenDangNhap { get; set; }
        public string MatKhau { get; set; }
        public string ChucVu { get; set; }
        public int? DocGiaId { get; set; } // Liên kết với DocGia, nếu là độc giả
        [Required]
        public string Email { get; set; } = string.Empty;
        public DateTime NgayTao { get; set; } = DateTime.Now;
        // Navigation
        public ICollection<PhieuCapQuyen> PhieuCapQuyens { get; set; }
        public ICollection<NhatKyHoatDong> NhatKyHoatDongs { get; set; }
    }
} 