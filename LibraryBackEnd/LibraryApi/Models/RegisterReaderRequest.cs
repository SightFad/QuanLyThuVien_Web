using System;

namespace LibraryApi.Models
{
    public class RegisterReaderRequest
    {
        // Thông tin tài khoản
        public string Username { get; set; }
        public string Password { get; set; }
        // Thông tin cá nhân độc giả
        public string HoTen { get; set; }
        public string Email { get; set; }
        public string SDT { get; set; }
        public string DiaChi { get; set; }
        public string GioiTinh { get; set; }
        public DateTime? NgaySinh { get; set; }
    }
} 