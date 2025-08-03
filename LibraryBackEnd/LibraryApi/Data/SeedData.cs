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
                        TenDG = "Nguyễn Văn A",
                        Email = "nguyenvana@email.com",
                        SDT = "0123456789",
                        DiaChi = "123 Lê Lợi, Q1, TP.HCM",
                        GioiTinh = "Nam",
                        LoaiDocGia = "HocSinh",
                        CapBac = "Thuong",
                        MemberStatus = "DaThanhToan",
                        NgayDangKy = DateTime.Now.AddMonths(-6),
                        NgayHetHan = DateTime.Now.AddMonths(6),
                        PhiThanhVien = 50000,
                        LyDoKhoa = ""
                    },
                    new DocGia
                    {
                        HoTen = "Trần Thị B",
                        TenDG = "Trần Thị B",
                        Email = "tranthib@email.com",
                        SDT = "0987654321",
                        DiaChi = "456 Nguyễn Trãi, Q5, TP.HCM",
                        GioiTinh = "Nữ",
                        LoaiDocGia = "GiaoVien",
                        CapBac = "Thuong",
                        MemberStatus = "DaThanhToan",
                        NgayDangKy = DateTime.Now.AddMonths(-12),
                        NgayHetHan = DateTime.Now.AddMonths(12),
                        PhiThanhVien = 0,
                        LyDoKhoa = ""
                    },
                    new DocGia
                    {
                        HoTen = "Lê Văn C",
                        TenDG = "Lê Văn C",
                        Email = "levanc@email.com",
                        SDT = "0369852147",
                        DiaChi = "789 Võ Văn Tần, Q3, TP.HCM",
                        GioiTinh = "Nam",
                        LoaiDocGia = "HocSinh",
                        CapBac = "Thuong",
                        MemberStatus = "DaThanhToan",
                        NgayDangKy = DateTime.Now.AddMonths(-3),
                        NgayHetHan = DateTime.Now.AddMonths(9),
                        PhiThanhVien = 50000,
                        LyDoKhoa = ""
                    },
                    new DocGia
                    {
                        HoTen = "Phạm Thị D",
                        TenDG = "Phạm Thị D",
                        Email = "phamthid@email.com",
                        SDT = "0521478963",
                        DiaChi = "321 Điện Biên Phủ, Q3, TP.HCM",
                        GioiTinh = "Nữ",
                        LoaiDocGia = "Thuong",
                        CapBac = "Thuong",
                        MemberStatus = "DaThanhToan",
                        NgayDangKy = DateTime.Now.AddMonths(-8),
                        NgayHetHan = DateTime.Now.AddMonths(4),
                        PhiThanhVien = 100000,
                        LyDoKhoa = ""
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
                        ChucVu = "Admin"
                    },
                    new NguoiDung
                    {
                        TenDangNhap = "librarian",
                        MatKhau = "librarian123",
                        ChucVu = "Librarian"
                    },
                    new NguoiDung
                    {
                        TenDangNhap = "accountant",
                        MatKhau = "accountant123",
                        ChucVu = "Accountant"
                    },
                    new NguoiDung
                    {
                        TenDangNhap = "warehouse",
                        MatKhau = "warehouse123",
                        ChucVu = "Warehouse sách"
                    },
                    new NguoiDung
                    {
                        TenDangNhap = "reader1",
                        MatKhau = "reader123",
                        ChucVu = "Reader"
                    },
                    new NguoiDung
                    {
                        TenDangNhap = "reader2",
                        MatKhau = "reader123",
                        ChucVu = "Reader"
                    },
                    new NguoiDung
                    {
                        TenDangNhap = "reader3",
                        MatKhau = "reader123",
                        ChucVu = "Reader"
                    },
                    new NguoiDung
                    {
                        TenDangNhap = "director",
                        MatKhau = "director123",
                        ChucVu = "Giám đốc"
                    },
                    new NguoiDung
                    {
                        TenDangNhap = "library_manager",
                        MatKhau = "manager123",
                        ChucVu = "Trưởng thư viện"
                    },
                    new NguoiDung
                    {
                        TenDangNhap = "technician",
                        MatKhau = "tech123",
                        ChucVu = "Kỹ thuật viên"
                    },
                    new NguoiDung
                    {
                        TenDangNhap = "accounting_manager",
                        MatKhau = "acc_manager123",
                        ChucVu = "Trưởng phòng Accountant"
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
                        HanTra = DateTime.Now.AddDays(12),
                        TrangThai = "borrowed",
                        NguoiLap = "admin",
                        GhiChu = "Phiếu mượn mẫu"
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

            // Thêm dữ liệu mẫu cho PhieuThu (phí thành viên)
            if (!context.PhieuThus.Any())
            {
                context.PhieuThus.AddRange(
                    new PhieuThu
                    {
                        MaDG = 1,
                        NgayThu = DateTime.Now.AddDays(-30),
                        LoaiThu = "PhiThanhVien",
                        SoTien = 50000,
                        HinhThucThanhToan = "TienMat",
                        GhiChu = "Phí thành viên học sinh",
                        TrangThai = "DaThu",
                        NguoiThu = "admin",
                        LoaiViPham = null,
                        MaGiaoDich = null,
                        TenSach = null
                    },
                    new PhieuThu
                    {
                        MaDG = 2,
                        NgayThu = DateTime.Now.AddDays(-25),
                        LoaiThu = "PhiThanhVien",
                        SoTien = 0,
                        HinhThucThanhToan = "TienMat",
                        GhiChu = "Phí thành viên giáo viên (miễn phí)",
                        TrangThai = "DaThu",
                        NguoiThu = "admin",
                        LoaiViPham = null,
                        MaGiaoDich = null,
                        TenSach = null
                    },
                    new PhieuThu
                    {
                        MaDG = 3,
                        NgayThu = DateTime.Now.AddDays(-20),
                        LoaiThu = "PhiThanhVien",
                        SoTien = 50000,
                        HinhThucThanhToan = "TienMat",
                        GhiChu = "Phí thành viên học sinh",
                        TrangThai = "DaThu",
                        NguoiThu = "admin",
                        LoaiViPham = null,
                        MaGiaoDich = null,
                        TenSach = null
                    },
                    new PhieuThu
                    {
                        MaDG = 4,
                        NgayThu = DateTime.Now.AddDays(-15),
                        LoaiThu = "PhiThanhVien",
                        SoTien = 100000,
                        HinhThucThanhToan = "TienMat",
                        GhiChu = "Phí thành viên thường",
                        TrangThai = "DaThu",
                        NguoiThu = "admin",
                        LoaiViPham = null,
                        MaGiaoDich = null,
                        TenSach = null
                    },
                    new PhieuThu
                    {
                        MaDG = 5,
                        NgayThu = DateTime.Now.AddDays(-10),
                        LoaiThu = "PhiThanhVien",
                        SoTien = 60000,
                        HinhThucThanhToan = "TienMat",
                        GhiChu = "Phí thành viên thường",
                        TrangThai = "DaThu",
                        NguoiThu = "admin",
                        LoaiViPham = null,
                        MaGiaoDich = null,
                        TenSach = null
                    }
                );
                context.SaveChanges();
            }

            // Thêm dữ liệu mẫu cho PhieuPhat (phí phạt)
            if (!context.PhieuPhats.Any())
            {
                context.PhieuPhats.AddRange(
                    new PhieuPhat
                    {
                        MaDG = 1,
                        LoaiPhat = "Trả sách trễ",
                        SoTien = 10000,
                        NgayLap = DateTime.Now.AddDays(-28)
                    },
                    new PhieuPhat
                    {
                        MaDG = 2,
                        LoaiPhat = "Sách hư hỏng",
                        SoTien = 25000,
                        NgayLap = DateTime.Now.AddDays(-22)
                    },
                    new PhieuPhat
                    {
                        MaDG = 3,
                        LoaiPhat = "Trả sách trễ",
                        SoTien = 15000,
                        NgayLap = DateTime.Now.AddDays(-18)
                    },
                    new PhieuPhat
                    {
                        MaDG = 4,
                        LoaiPhat = "Mất sách",
                        SoTien = 50000,
                        NgayLap = DateTime.Now.AddDays(-12)
                    },
                    new PhieuPhat
                    {
                        MaDG = 5,
                        LoaiPhat = "Trả sách trễ",
                        SoTien = 8000,
                        NgayLap = DateTime.Now.AddDays(-5)
                    }
                );
                context.SaveChanges();
            }

            // Thêm dữ liệu mẫu cho TheThuVien
            if (!context.TheThuViens.Any())
            {
                context.TheThuViens.AddRange(
                    new TheThuVien
                    {
                        MaDG = 1,
                        LoaiThe = "Thẻ thường",
                        NgayDK = DateTime.Now.AddDays(-30),
                        NgayHetHan = DateTime.Now.AddDays(335),
                        TrangThai = "Hoạt động"
                    },
                    new TheThuVien
                    {
                        MaDG = 2,
                        LoaiThe = "Thẻ VIP",
                        NgayDK = DateTime.Now.AddDays(-25),
                        NgayHetHan = DateTime.Now.AddDays(340),
                        TrangThai = "Hoạt động"
                    },
                    new TheThuVien
                    {
                        MaDG = 3,
                        LoaiThe = "Thẻ thường",
                        NgayDK = DateTime.Now.AddDays(-20),
                        NgayHetHan = DateTime.Now.AddDays(345),
                        TrangThai = "Hoạt động"
                    },
                    new TheThuVien
                    {
                        MaDG = 4,
                        LoaiThe = "Thẻ VIP",
                        NgayDK = DateTime.Now.AddDays(-15),
                        NgayHetHan = DateTime.Now.AddDays(350),
                        TrangThai = "Hoạt động"
                    },
                    new TheThuVien
                    {
                        MaDG = 5,
                        LoaiThe = "Thẻ thường",
                        NgayDK = DateTime.Now.AddDays(-10),
                        NgayHetHan = DateTime.Now.AddDays(355),
                        TrangThai = "Hoạt động"
                    }
                );
                context.SaveChanges();
            }
        }
    }
}
}
