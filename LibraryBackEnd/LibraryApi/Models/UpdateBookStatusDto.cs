using System;

namespace LibraryApi.Models
{
    public class UpdateBookStatusDto
    {
        public int MaSach { get; set; }
        public string TrangThai { get; set; }
        public string GhiChu { get; set; }
        public DateTime? NgayCapNhat { get; set; }
    }
} 