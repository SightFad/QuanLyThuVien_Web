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
                        TrangThai = "Còn",
                        ViTriLuuTru = "Kệ A1"
                    },
                    new Sach
                    {
                        TenSach = "Nhà Giả Kim",
                        TacGia = "Paulo Coelho",
                        ISBN = "978-604-1-00002-2",
                        TheLoai = "Tiểu thuyết",
                        SoLuong = 3,
                        TrangThai = "Còn",
                        ViTriLuuTru = "Kệ B2"
                    },
                    new Sach
                    {
                        TenSach = "Tuổi Trẻ Đáng Giá Bao Nhiêu",
                        TacGia = "Rosie Nguyễn",
                        ISBN = "978-604-1-00003-3",
                        TheLoai = "Kỹ năng sống",
                        SoLuong = 4,
                        TrangThai = "Còn",
                        ViTriLuuTru = "Kệ A1"
                    },
                    new Sach
                    {
                        TenSach = "Lập trình Web với React",
                        TacGia = "John Doe",
                        ISBN = "978-604-1-00004-4",
                        TheLoai = "Công nghệ",
                        SoLuong = 6,
                        TrangThai = "Còn",
                        ViTriLuuTru = "Kệ C3"
                    },
                    new Sach
                    {
                        TenSach = "Cơ sở dữ liệu SQL",
                        TacGia = "Jane Smith",
                        ISBN = "978-604-1-00005-5",
                        TheLoai = "Công nghệ",
                        SoLuong = 4,
                        TrangThai = "Còn",
                        ViTriLuuTru = "Kệ C3"
                    }
                );
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
