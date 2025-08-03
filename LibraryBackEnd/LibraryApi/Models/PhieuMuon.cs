using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class PhieuMuon
    {
        [Key]
        public int MaPhieuMuon { get; set; }
        public int MaDG { get; set; }
        public DateTime NgayMuon { get; set; } = DateTime.Now;
        public DateTime HanTra { get; set; } = DateTime.Now.AddDays(14); // Hạn trả mặc định là 14 ngày sau ngày mượn
        public DateTime? NgayTra { get; set; } = DateTime.Now;

        public string TrangThai
        {
            get
            {
                if (NgayTra != null) return "returned";
                if (DateTime.Now > HanTra) return "overdue";
                return "borrowed";
            }
        }

        public string NguoiLap { get; set; } = null;
        public string GhiChu { get; set; } = null;
        public DateTime? NgayCapNhat { get; set; }

        // Navigation
        public DocGia DocGia { get; set; }
        public ICollection<CT_PhieuMuon> CT_PhieuMuons { get; set; }
        public ICollection<PhieuGiaHan> PhieuGiaHans { get; set; }
        public ICollection<PhieuTra> PhieuTras { get; set; }

        public PhieuMuon()
        {
            CT_PhieuMuons = new List<CT_PhieuMuon>();
            PhieuGiaHans = new List<PhieuGiaHan>();
            PhieuTras = new List<PhieuTra>();
        }
    }
}