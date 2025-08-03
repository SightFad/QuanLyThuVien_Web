namespace LibraryApi.Models
{
    public class LoginResponse
    {
        public string Token { get; set; }
        public int UserId { get; set; } // MaND - ID của người dùng
        public string Username { get; set; }
        public string Role { get; set; }
        public string Email { get; set; }
        public DateTime ExpiresAt { get; set; }
        
        // Thông tin chi tiết khi user là Reader
        public int? DocGiaId { get; set; } // MaDG - ID của độc giả (nếu là reader)
        public string? HoTen { get; set; }
        public string? LoaiDocGia { get; set; } // "Thuong", "VIP", "HocSinh", "GiaoVien"
        public string? CapBac { get; set; } // "Thuong", "VIP"
        public string? MemberStatus { get; set; } // "DaThanhToan", "HetHan", "BiKhoa", etc.
        public DateTime? NgayHetHan { get; set; }
        public int SoSachToiDa { get; set; } = 5;
        public int SoNgayMuonToiDa { get; set; } = 14;
        
        // Helper property để kiểm tra loại user
        public bool IsReader => !string.IsNullOrEmpty(LoaiDocGia);
        public bool IsVipReader => CapBac == "VIP";
        public bool IsActiveReader => MemberStatus == "DaThanhToan" && NgayHetHan > DateTime.Now;
    }
} 