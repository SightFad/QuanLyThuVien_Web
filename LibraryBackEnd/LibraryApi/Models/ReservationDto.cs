using System;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class ReservationDto
    {
        public int Id { get; set; }
        public string MaDatTruoc { get; set; }
        public int MaDocGia { get; set; }
        public string TenDocGia { get; set; }
        public int MaSach { get; set; }
        public string TenSach { get; set; }
        public string TacGia { get; set; }
        public DateTime NgayDatTruoc { get; set; }
        public DateTime HanLaySach { get; set; }
        public string TrangThai { get; set; }
        public DateTime? NgayXuLy { get; set; }
        public string NguoiXuLy { get; set; }
        public string GhiChu { get; set; }
        public int? MaPhieuMuon { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateReservationDto
    {
        [Required]
        public int MaDocGia { get; set; }
        
        [Required]
        public int MaSach { get; set; }
        
        public string GhiChu { get; set; }
    }

    public class UpdateReservationDto
    {
        [Required]
        public string TrangThai { get; set; }
        
        public string NguoiXuLy { get; set; }
        
        public string GhiChu { get; set; }
        
        public int? MaPhieuMuon { get; set; }
    }
}