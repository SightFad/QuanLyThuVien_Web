using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LibraryApi.Models
{
    public class Sach
    {
        [Key]
        public int MaSach { get; set; }

        [Required]
        [StringLength(100)]
        public string TenSach { get; set; }

        [Required]
        [StringLength(50)]
        public string TacGia { get; set; }

        [Required]
        [StringLength(50)]
        public string TheLoai { get; set; }

        public int? NamXB { get; set; }

        [StringLength(20)]
        public string ISBN { get; set; }

        public int? SoLuong { get; set; }

        public decimal? GiaSach { get; set; }

        [NotMapped]
        public decimal? GiaTien => GiaSach; // Alias không lưu vào DB

        [StringLength(50)]
        public string TrangThai { get; set; }

        [StringLength(50)]
        public string ViTriLuuTru { get; set; }

        [StringLength(50)]
        public string NhaXuatBan { get; set; }

        [StringLength(200)]
        public string AnhBia { get; set; }

        [StringLength(500)]
        public string MoTa { get; set; }

        public string KeSach { get; set; } = string.Empty;

        public DateTime? NgayNhap { get; set; }

        public DateTime NgayTao { get; set; } = DateTime.Now;

        public DateTime? NgayCapNhat { get; set; }

        // Navigation properties — đã được khởi tạo & xử lý vòng lặp JSON
        [JsonIgnore]
        public ICollection<CT_PhieuMuon> CT_PhieuMuons { get; set; } = new List<CT_PhieuMuon>();

        [JsonIgnore]
        public ICollection<CT_PhieuTra> CT_PhieuTras { get; set; } = new List<CT_PhieuTra>();

        [JsonIgnore]
        public ICollection<PhieuDatTruoc> PhieuDatTruocs { get; set; } = new List<PhieuDatTruoc>();

        [JsonIgnore]
        public ICollection<PhieuDeXuatMuaSach> PhieuDeXuatMuaSachs { get; set; } = new List<PhieuDeXuatMuaSach>();

        [JsonIgnore]
        public ICollection<PhieuGiaHan> PhieuGiaHans { get; set; } = new List<PhieuGiaHan>();

        [JsonIgnore]
        public ICollection<ChiTietPhieuKiemKe> ChiTietPhieuKiemKes { get; set; } = new List<ChiTietPhieuKiemKe>();
    }
}
