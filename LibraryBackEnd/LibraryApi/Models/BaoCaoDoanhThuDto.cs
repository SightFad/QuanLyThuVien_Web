using System;
using System.Collections.Generic;

namespace LibraryApi.Models
{
    // DTO cho báo cáo doanh thu phí thành viên (BM10)
    public class BaoCaoDoanhThuPhiThanhVienDto
    {
        public DateTime NgayBaoCao { get; set; }
        public string LoaiThe { get; set; }
        public decimal ThanhTien { get; set; }
    }

    // DTO cho báo cáo doanh thu phí phạt (BM11)
    public class BaoCaoDoanhThuPhiPhatDto
    {
        public DateTime NgayBaoCao { get; set; }
        public string NguonThu { get; set; }
        public int SoLuong { get; set; }
        public decimal ThanhTien { get; set; }
    }

    // DTO cho request báo cáo
    public class BaoCaoRequestDto
    {
        public DateTime TuNgay { get; set; }
        public DateTime DenNgay { get; set; }
        public string LoaiBaoCao { get; set; } // "PhiThanhVien" hoặc "PhiPhat"
    }

    // DTO cho response tổng hợp
    public class BaoCaoResponseDto
    {
        public List<BaoCaoDoanhThuPhiThanhVienDto> DanhSachPhiThanhVien { get; set; }
        public List<BaoCaoDoanhThuPhiPhatDto> DanhSachPhiPhat { get; set; }
        public decimal TongDoanhThuPhiThanhVien { get; set; }
        public decimal TongDoanhThuPhiPhat { get; set; }
        public decimal TongDoanhThu { get; set; }
    }
} 