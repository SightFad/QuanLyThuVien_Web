using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class NguoiDung
    {
        [Key]
        public int MaND { get; set; } // PRIMARY KEY
        public string TenDangNhap { get; set; } = string.Empty;
        public string MatKhau { get; set; } = string.Empty;
        public string ChucVu { get; set; } = string.Empty;
        public int? DocGiaId { get; set; } // Liên kết với DocGia, nếu là độc giả
        [Required]
        public string Email { get; set; } = string.Empty;
        public DateTime NgayTao { get; set; } = DateTime.Now;
        // Navigation
        public DocGia? DocGia { get; set; }
        public ICollection<PhieuCapQuyen> PhieuCapQuyens { get; set; } = new List<PhieuCapQuyen>();
        public ICollection<NhatKyHoatDong> NhatKyHoatDongs { get; set; } = new List<NhatKyHoatDong>();
    }
} 