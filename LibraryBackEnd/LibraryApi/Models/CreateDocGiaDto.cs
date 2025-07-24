using System;

namespace LibraryApi.Models
{
    public class CreateDocGiaDto
    {
        public string HoTen { get; set; }
        public string Email { get; set; }
        public string SDT { get; set; }
        public string DiaChi { get; set; }
        public string GioiTinh { get; set; }
        public DateTime? NgaySinh { get; set; }
    }
} 