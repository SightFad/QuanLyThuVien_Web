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
                        NamXB = 2019,
                        NhaXuatBan = "NXB Tổng hợp TP.HCM",
                        SoLuong = 5,
                        TrangThai = "Còn",
                        ViTriLuuTru = "Kệ A1",
                        AnhBia = "/images/book-covers/dac-nhan-tam.jpg"
                    },
                    new Sach
                    {
                        TenSach = "Nhà Giả Kim",
                        TacGia = "Paulo Coelho",
                        ISBN = "978-604-1-00002-2",
                        TheLoai = "Tiểu thuyết",
                        NamXB = 2020,
                        NhaXuatBan = "NXB Văn học",
                        SoLuong = 3,
                        TrangThai = "Còn",
                        ViTriLuuTru = "Kệ B2",
                        AnhBia = "/images/book-covers/nha-gia-kim.jpg"
                    },
                    new Sach
                    {
                        TenSach = "Tuổi Trẻ Đáng Giá Bao Nhiêu",
                        TacGia = "Rosie Nguyễn",
                        ISBN = "978-604-1-00003-3",
                        TheLoai = "Kỹ năng sống",
                        NamXB = 2018,
                        NhaXuatBan = "NXB Hội nhà văn",
                        SoLuong = 4,
                        TrangThai = "Còn",
                        ViTriLuuTru = "Kệ A1",
                        AnhBia = "/images/book-covers/tuoi-tre-dang-gia-bao-nhieu.jpg"
                    },
                    new Sach
                    {
                        TenSach = "Cách Nghĩ Để Thành Công",
                        TacGia = "Napoleon Hill",
                        ISBN = "978-604-1-00004-4",
                        TheLoai = "Kinh doanh",
                        NamXB = 2021,
                        NhaXuatBan = "NXB Lao động",
                        SoLuong = 6,
                        TrangThai = "Còn",
                        ViTriLuuTru = "Kệ C1",
                        AnhBia = "/images/book-covers/cach-nghi-de-thanh-cong.jpg"
                    },
                    new Sach
                    {
                        TenSach = "Đọc Vị Bất Kỳ Ai",
                        TacGia = "David J. Lieberman",
                        ISBN = "978-604-1-00005-5",
                        TheLoai = "Tâm lý học",
                        NamXB = 2020,
                        NhaXuatBan = "NXB Thế giới",
                        SoLuong = 2,
                        TrangThai = "Còn",
                        ViTriLuuTru = "Kệ B3",
                        AnhBia = "/images/book-covers/doc-vi-bat-ky-ai.jpg"
                    },
                    new Sach
                    {
                        TenSach = "Sapiens: Lược Sử Loài Người",
                        TacGia = "Yuval Noah Harari",
                        ISBN = "978-604-1-00006-6",
                        TheLoai = "Lịch sử",
                        NamXB = 2021,
                        NhaXuatBan = "NXB Thế giới",
                        SoLuong = 3,
                        TrangThai = "Còn",
                        ViTriLuuTru = "Kệ D1",
                        AnhBia = "/images/book-covers/sapiens.jpg"
                    }
                );
                context.SaveChanges();
            }

            if (!context.DocGias.Any())
            {
                context.DocGias.AddRange(
                    new DocGia
                    {
                        HoTen = "Nguyễn Văn A",
                        Email = "nguyenvana@email.com",
                        SDT = "0123456789",
                        DiaChi = "123 Lê Lợi, Q1, TP.HCM",
                        GioiTinh = "Nam",
                        MemberType = "Sinh viên",
                        MemberStatus = "Hoạt động",
                        NgayDangKy = DateTime.Now.AddMonths(-6),
                        NgayHetHan = DateTime.Now.AddMonths(6)
                    },
                    new DocGia
                    {
                        HoTen = "Trần Thị B",
                        Email = "tranthib@email.com",
                        SDT = "0987654321",
                        DiaChi = "456 Nguyễn Trãi, Q5, TP.HCM",
                        GioiTinh = "Nữ",
                        MemberType = "Giảng viên",
                        MemberStatus = "Hoạt động",
                        NgayDangKy = DateTime.Now.AddMonths(-12),
                        NgayHetHan = DateTime.Now.AddMonths(12)
                    },
                    new DocGia
                    {
                        HoTen = "Lê Văn C",
                        Email = "levanc@email.com",
                        SDT = "0369852147",
                        DiaChi = "789 Võ Văn Tần, Q3, TP.HCM",
                        GioiTinh = "Nam",
                        MemberType = "Sinh viên",
                        MemberStatus = "Hoạt động",
                        NgayDangKy = DateTime.Now.AddMonths(-3),
                        NgayHetHan = DateTime.Now.AddMonths(9)
                    },
                    new DocGia
                    {
                        HoTen = "Phạm Thị D",
                        Email = "phamthid@email.com",
                        SDT = "0521478963",
                        DiaChi = "321 Điện Biên Phủ, Q3, TP.HCM",
                        GioiTinh = "Nữ",
                        MemberType = "Nhân viên",
                        MemberStatus = "Hoạt động",
                        NgayDangKy = DateTime.Now.AddMonths(-8),
                        NgayHetHan = DateTime.Now.AddMonths(4)
                    }
                );
            }

            if (!context.NguoiDungs.Any())
            {
                context.NguoiDungs.AddRange(
                    new NguoiDung
                    {
                        TenDangNhap = "admin",
                        MatKhau = "admin123",
                        ChucVu = "Quản trị viên"
                    },
                    new NguoiDung
                    {
                        TenDangNhap = "librarian",
                        MatKhau = "librarian123",
                        ChucVu = "Thủ thư"
                    },
                    new NguoiDung
                    {
                        TenDangNhap = "accountant",
                        MatKhau = "accountant123",
                        ChucVu = "Kế toán"
                    },
                    new NguoiDung
                    {
                        TenDangNhap = "warehouse",
                        MatKhau = "warehouse123",
                        ChucVu = "Nhân viên kho sách"
                    },
                    new NguoiDung
                    {
                        TenDangNhap = "reader1",
                        MatKhau = "reader123",
                        ChucVu = "Độc giả"
                    },
                    new NguoiDung
                    {
                        TenDangNhap = "reader2",
                        MatKhau = "reader123",
                        ChucVu = "Độc giả"
                    },
                    new NguoiDung
                    {
                        TenDangNhap = "reader3",
                        MatKhau = "reader123",
                        ChucVu = "Độc giả"
                    }
                );
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
                    context.SaveChanges(); // Lưu trước để có MaPhieuMuon
                    
                    context.CT_PhieuMuons.Add(new CT_PhieuMuon
                    {
                        MaPhieuMuon = phieuMuon.MaPhieuMuon,
                        MaSach = sach.MaSach
                    });
                    context.SaveChanges();
                }
            }
        }
    }
}
