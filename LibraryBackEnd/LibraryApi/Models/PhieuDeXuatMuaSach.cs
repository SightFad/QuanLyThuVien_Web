using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class PhieuDeXuatMuaSach
    {
        [Key]
        public int MaDeXuat { get; set; } // PRIMARY KEY
        public int MaSach { get; set; }
        public Sach Sach { get; set; }
        public int? SoLuong { get; set; }
        public string LyDo { get; set; }
        public string TrangThai { get; set; }
    }
} 