using System;

namespace LibraryApi.Models
{
    public class CreateSachDto
    {
        public string TenSach { get; set; }
        public string TacGia { get; set; }
        public string TheLoai { get; set; }
        public int? NamXB { get; set; }
        public string ISBN { get; set; }
        public int? SoLuong { get; set; }
        public string TrangThai { get; set; }
    }
} 