using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class DocGia
    {
        [Key]
        public int MaDG { get; set; } // PRIMARY KEY
        public string HoTen { get; set; }
        public DateTime? NgaySinh { get; set; }
        public string GioiTinh { get; set; }
        public string DiaChi { get; set; }
        public string Email { get; set; }
        public string SDT { get; set; }

        // Navigation
        public TheThuVien TheThuVien { get; set; }
        public ICollection<PhieuMuon> PhieuMuons { get; set; }
        public ICollection<PhieuTra> PhieuTras { get; set; }
        public ICollection<PhieuPhat> PhieuPhats { get; set; }
        public ICollection<PhieuThu> PhieuThus { get; set; }
        public ICollection<PhieuDatTruoc> PhieuDatTruocs { get; set; }
    }
}
