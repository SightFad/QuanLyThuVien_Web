using LibraryApi.Data;
using LibraryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryApi.Services
{
    public class DocGiaService
    {
        private readonly LibraryContext _context;

        public DocGiaService(LibraryContext context)
        {
            _context = context;
        }

        // Tính phí thành viên theo loại Reader
        public decimal CalculateMembershipFee(string loaiDocGia)
        {
            return loaiDocGia switch
            {
                "Thuong" => 100000, // 100,000 VND/năm
                "VIP" => 200000,    // 200,000 VND/năm
                "HocSinh" => 50000, // 50,000 VND/năm
                "GiaoVien" => 0,    // Miễn phí
                _ => 100000
            };
        }

        // Xác định cấp bậc theo loại Reader
        public string DetermineCapBac(string loaiDocGia)
        {
            return loaiDocGia switch
            {
                "VIP" => "VIP",
                _ => "Thuong"
            };
        }

        // Xác định giới hạn mượn sách theo loại Reader
        public (int soSachToiDa, int soNgayMuonToiDa, int soLanGiaHanToiDa, int soNgayGiaHan) GetBorrowingLimits(string loaiDocGia)
        {
            return loaiDocGia switch
            {
                "VIP" => (5, 30, 2, 7), // VIP: 5 sách, 30 ngày, 2 lần gia hạn, 7 ngày/lần
                "GiaoVien" => (5, 21, 1, 7), // Giáo viên: 5 sách, 21 ngày, 1 lần gia hạn, 7 ngày/lần
                "HocSinh" => (5, 21, 1, 7), // Học sinh: 5 sách, 21 ngày, 1 lần gia hạn, 7 ngày/lần
                _ => (5, 14, 1, 7) // Thường: 5 sách, 14 ngày, 1 lần gia hạn, 7 ngày/lần
            };
        }

        // Kiểm tra điều kiện đăng ký Reader
        public async Task<(bool Success, string Message)> CheckRegistrationConditions(CreateDocGiaDto dto)
        {
            // Kiểm tra tuổi (phải 16+)
            if (dto.NgaySinh.HasValue)
            {
                var age = DateTime.Now.Year - dto.NgaySinh.Value.Year;
                if (dto.NgaySinh.Value > DateTime.Now.AddYears(-age)) age--;
                
                if (age < 16)
                {
                    return (false, "Reader phải từ 16 tuổi trở lên mới được đăng ký tài khoản");
                }
            }

            // Kiểm tra email đã tồn tại
            var existingEmail = await _context.DocGias
                .FirstOrDefaultAsync(d => d.Email == dto.Email);
            if (existingEmail != null)
            {
                return (false, "Email đã được sử dụng bởi Reader khác");
            }

            // Kiểm tra số điện thoại đã tồn tại
            var existingPhone = await _context.DocGias
                .FirstOrDefaultAsync(d => d.SDT == dto.SDT);
            if (existingPhone != null)
            {
                return (false, "Số điện thoại đã được sử dụng bởi Reader khác");
            }

            return (true, "OK");
        }

        // Tạo Reader mới
        public async Task<(bool Success, string Message, DocGia? DocGia)> CreateDocGia(CreateDocGiaDto dto)
        {
            var checkResult = await CheckRegistrationConditions(dto);
            if (!checkResult.Success)
            {
                return (false, checkResult.Message, null);
            }

            var (soSachToiDa, soNgayMuonToiDa, soLanGiaHanToiDa, soNgayGiaHan) = GetBorrowingLimits(dto.LoaiDocGia);
            var phiThanhVien = CalculateMembershipFee(dto.LoaiDocGia);
            var capBac = DetermineCapBac(dto.LoaiDocGia);

            var docGia = new DocGia
            {
                HoTen = dto.HoTen,
                NgaySinh = dto.NgaySinh,
                GioiTinh = dto.GioiTinh,
                DiaChi = dto.DiaChi,
                Email = dto.Email,
                SDT = dto.SDT,
                LoaiDocGia = dto.LoaiDocGia,
                CapBac = capBac,
                MemberStatus = "ChuaThanhToan",
                NgayDangKy = DateTime.Now,
                PhiThanhVien = phiThanhVien,
                SoSachToiDa = soSachToiDa,
                SoNgayMuonToiDa = soNgayMuonToiDa,
                SoLanGiaHanToiDa = soLanGiaHanToiDa,
                SoNgayGiaHan = soNgayGiaHan
            };

            _context.DocGias.Add(docGia);
            await _context.SaveChangesAsync();

            return (true, "Tạo Reader thành công", docGia);
        }

        // Kiểm tra điều kiện mượn sách
        public async Task<(bool Success, string Message)> CheckBorrowingConditions(int maDG, int soSachMuon)
        {
            var docGia = await _context.DocGias.FindAsync(maDG);
            if (docGia == null)
            {
                return (false, "Reader không tồn tại");
            }

            // Kiểm tra trạng thái thành viên
            if (docGia.MemberStatus != "DaThanhToan")
            {
                return (false, "Chỉ thành viên đã thanh toán mới được mượn sách");
            }

            // Kiểm tra tài khoản có bị khóa không
            if (docGia.MemberStatus == "BiKhoa")
            {
                if (docGia.NgayKhoa.HasValue && docGia.SoNgayKhoa > 0)
                {
                    var ngayMoKhoa = docGia.NgayKhoa.Value.AddDays(docGia.SoNgayKhoa);
                    if (DateTime.Now < ngayMoKhoa)
                    {
                        return (false, $"Tài khoản bị khóa đến {ngayMoKhoa:dd/MM/yyyy}. Lý do: {docGia.LyDoKhoa}");
                    }
                    else
                    {
                        // Tự động mở khóa tài khoản
                        docGia.MemberStatus = "DaThanhToan";
                        docGia.NgayKhoa = null;
                        docGia.SoNgayKhoa = 0;
                        docGia.LyDoKhoa = string.Empty;
                        await _context.SaveChangesAsync();
                    }
                }
            }

            // Kiểm tra tài khoản có bị hủy không
            if (docGia.MemberStatus == "BiHuy")
            {
                return (false, "Tài khoản đã bị hủy, không thể mượn sách");
            }

            // Kiểm tra số sách đang mượn
            var soSachDangMuon = await _context.PhieuMuons
                .Where(p => p.MaDG == maDG && p.TrangThai == "borrowed")
                .CountAsync();

            if (soSachDangMuon + soSachMuon > docGia.SoSachToiDa)
            {
                return (false, $"Reader chỉ được mượn tối đa {docGia.SoSachToiDa} sách. Hiện tại đang mượn {soSachDangMuon} sách");
            }

            return (true, "OK");
        }

        // Cập nhật trạng thái thành viên
        public async Task<(bool Success, string Message)> UpdateMemberStatus(int maDG, string newStatus, string? lyDo = null)
        {
            var docGia = await _context.DocGias.FindAsync(maDG);
            if (docGia == null)
            {
                return (false, "Reader không tồn tại");
            }

            docGia.MemberStatus = newStatus;
            docGia.NgayCapNhat = DateTime.Now;

            if (newStatus == "BiKhoa")
            {
                docGia.NgayKhoa = DateTime.Now;
                docGia.LyDoKhoa = lyDo ?? "";
            }
            else if (newStatus == "DaThanhToan")
            {
                docGia.NgayHetHan = DateTime.Now.AddYears(1);
                docGia.NgayKhoa = null;
                docGia.SoNgayKhoa = 0;
                docGia.LyDoKhoa = "";
            }

            await _context.SaveChangesAsync();
            return (true, "Cập nhật trạng thái thành công");
        }

        // Kiểm tra và xử lý vi phạm trễ hạn
        public async Task<(bool Success, string Message)> ProcessOverdueViolation(int maDG, int soNgayTre)
        {
            var docGia = await _context.DocGias.FindAsync(maDG);
            if (docGia == null)
            {
                return (false, "Reader không tồn tại");
            }

            if (soNgayTre <= 0)
            {
                return (true, "Không có vi phạm trễ hạn");
            }

            // Xử lý theo mức độ vi phạm
            if (soNgayTre <= 3)
            {
                return (true, "Cảnh báo: Trả sách trễ 1-3 ngày");
            }
            else if (soNgayTre <= 7)
            {
                return (true, "Phạt tiền + Cảnh báo: Trả sách trễ 4-7 ngày");
            }
            else if (soNgayTre <= 365)
            {
                // Khóa tài khoản 30 ngày
                await UpdateMemberStatus(maDG, "BiKhoa", $"Trả sách trễ {soNgayTre} ngày");
                return (true, $"Khóa tài khoản 30 ngày: Trả sách trễ {soNgayTre} ngày");
            }
            else
            {
                // Hủy thẻ
                await UpdateMemberStatus(maDG, "BiHuy", $"Trả sách trễ {soNgayTre} ngày (>1 năm)");
                return (true, "Hủy thẻ: Trả sách trễ hơn 1 năm");
            }
        }
    }
} 