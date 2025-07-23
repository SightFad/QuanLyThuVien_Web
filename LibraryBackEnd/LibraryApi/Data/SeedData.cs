using LibraryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryApi.Data
{
    public static class SeedData
    {
        public static void Initialize(LibraryContext context)
        {
            if (!context.Saches.Any())
            {
                context.Saches.AddRange(
                    new Sach
                    {
                        TenSach = "Đắc Nhân Tâm",
                        TacGia = "Dale Carnegie",
                        ISBN = "978-604-1-00001-1",
                        TheLoai = "Kỹ năng sống",
                        SoLuong = 5,
                        TrangThai = "Còn"
                    },
                    new Sach
                    {
                        TenSach = "Nhà Giả Kim",
                        TacGia = "Paulo Coelho",
                        ISBN = "978-604-1-00002-2",
                        TheLoai = "Tiểu thuyết",
                        SoLuong = 3,
                        TrangThai = "Còn"
                    },
                    new Sach
                    {
                        TenSach = "Tuổi Trẻ Đáng Giá Bao Nhiêu",
                        TacGia = "Rosie Nguyễn",
                        ISBN = "978-604-1-00003-3",
                        TheLoai = "Kỹ năng sống",
                        SoLuong = 4,
                        TrangThai = "Còn"
                    }
                );
            }
            else return;

            if (!context.DocGias.Any())
            {
                context.DocGias.AddRange(
                    new DocGia
                    {
                        HoTen = "Nguyễn Văn A",
                        Email = "nguyenvana@email.com",
                        SDT = "0123456789",
                        DiaChi = "123 Lê Lợi, Q1",
                        GioiTinh = "Nam"
                    },
                    new DocGia
                    {
                        HoTen = "Trần Thị B",
                        Email = "tranthib@email.com",
                        SDT = "0987654321",
                        DiaChi = "456 Nguyễn Trãi, Q5",
                        GioiTinh = "Nữ"
                    }
                );
            }
            else return;

            if (!context.NguoiDungs.Any())
            {
                context.NguoiDungs.Add(new NguoiDung
                {
                    TenDangNhap = "admin",
                    MatKhau = "admin123",
                    ChucVu = "Admin"
                });
            }
            context.SaveChanges();

            // Seed phiếu mượn nếu chưa có
            if (!context.PhieuMuons.Any())
            {
                var docGia = context.DocGias.FirstOrDefault();
                var sach = context.Saches.FirstOrDefault();
                if (docGia != null && sach != null)
                {
                    var phieuMuon = new PhieuMuon
                    {
                        MaDG = docGia.MaDG,
                        NgayMuon = DateTime.Now.AddDays(-2),
                        NgayTraDuKien = DateTime.Now.AddDays(12),
                        NguoiLap = "admin"
                    };
                    context.PhieuMuons.Add(phieuMuon);
                    context.CT_PhieuMuons.Add(new CT_PhieuMuon
                    {
                        MaPhieuMuon = phieuMuon.MaPhieuMuon,
                        MaSach = sach.MaSach
                    });
                }
            }
            context.SaveChanges();
        }
    }
}
