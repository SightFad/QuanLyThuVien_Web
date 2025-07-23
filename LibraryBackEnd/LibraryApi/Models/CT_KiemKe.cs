namespace LibraryApi.Models
{
    public class CT_KiemKe
    {
        public int MaPhieuKK { get; set; }
        public PhieuKiemKe PhieuKiemKe { get; set; }
        public int MaSach { get; set; }
        public Sach Sach { get; set; }
        public int? SL_HeThong { get; set; }
        public int? SL_ThucTe { get; set; }
        public int? ChenhLech { get; set; }
        // PRIMARY KEY (MaPhieuKK, MaSach)
    }
} 