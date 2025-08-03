using System;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class PhieuThu
    {
        [Key]
        public int MaPhieuThu { get; set; }
        
        [Required]
        public DateTime NgayThu { get; set; }
        
        [Required]
        public int MaDG { get; set; }
        
        [Required]
        [StringLength(20)]
        public string LoaiThu { get; set; } // "PhiThanhVien", "PhiPhat", "PhiKhac"
        
        [Required]
        public decimal SoTien { get; set; }
        
        [Required]
        [StringLength(20)]
        public string HinhThucThanhToan { get; set; } // "TienMat", "ChuyenKhoan"
        
        [StringLength(500)]
        public string GhiChu { get; set; }
        
        [Required]
        [StringLength(20)]
        public string TrangThai { get; set; } // "ChuaThu", "DaThu", "Huy"
        
        [StringLength(100)]
        public string NguoiThu { get; set; } // Tên người thu tiền
        
        // Thông tin chi tiết phạt tiền
        [StringLength(20)]
        public string LoaiViPham { get; set; } // "Trả trễ", "Hư hỏng", "Mất"
        
        public int? MaSach { get; set; } // Mã sách vi phạm
        
        [StringLength(200)]
        public string TenSach { get; set; } // Tên sách vi phạm
        
        public int? SoNgayTre { get; set; } // Số ngày trễ (nếu trả trễ)
        
        public int? MaPhieuMuon { get; set; } // Mã phiếu mượn liên quan
        
        public int? MaBaoCaoViPham { get; set; } // Mã báo cáo vi phạm liên quan
        
        [StringLength(50)]
        public string MaGiaoDich { get; set; } // Mã giao dịch (nếu chuyển khoản)
        
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime? NgayCapNhat { get; set; }

        // Navigation
        public DocGia DocGia { get; set; }
        public Sach Sach { get; set; }
        public PhieuMuon PhieuMuon { get; set; }
        public BaoCaoViPham BaoCaoViPham { get; set; }
    }
} 