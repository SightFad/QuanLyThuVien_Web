using LibraryApi.Controllers;
using System;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class RegisterReaderRequest : RegisterRequest
    {
        [Required]
        public string HoTen { get; set; }

        [Required]
        public string SDT { get; set; }
        public string DiaChi { get; set; }
        public string GioiTinh { get; set; }
        public DateTime? NgaySinh { get; set; }
    }
} 