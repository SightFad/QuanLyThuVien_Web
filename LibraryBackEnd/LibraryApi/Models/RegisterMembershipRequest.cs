using System;

namespace LibraryApi.Models
{
    public class RegisterMembershipRequest
    {
        public int DocGiaId { get; set; }
        public string MemberType { get; set; } // Thuong, Vip, SinhVien
    }
} 