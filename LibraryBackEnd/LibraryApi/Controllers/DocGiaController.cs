using LibraryApi.Data;
using LibraryApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace LibraryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocGiaController : Controller
    {
        private readonly LibraryContext _context;

        public DocGiaController(LibraryContext context)
        {
            _context = context;
        }

        private string GenerateUsername(string hoTen)
        {
            // Tạo username từ họ tên: lấy tên cuối + số ngẫu nhiên
            var nameParts = hoTen.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            var lastName = nameParts.Length > 0 ? nameParts[nameParts.Length - 1] : hoTen;
            
            // Loại bỏ dấu tiếng Việt và chuyển thành chữ thường
            var cleanName = RemoveVietnameseAccents(lastName).ToLower();
            
            // Thêm số ngẫu nhiên để tránh trùng lặp
            var random = new Random();
            var randomNumber = random.Next(100, 999);
            
            var username = $"{cleanName}{randomNumber}";
            
            // Kiểm tra xem username đã tồn tại chưa
            var counter = 1;
            var originalUsername = username;
            while (_context.NguoiDungs.Any(u => u.TenDangNhap == username))
            {
                username = $"{originalUsername}{counter}";
                counter++;
            }
            
            return username;
        }

        private string GeneratePassword()
        {
            // Tạo mật khẩu mặc định: "docgia" + số ngẫu nhiên
            var random = new Random();
            var randomNumber = random.Next(100, 999);
            return $"docgia{randomNumber}";
        }

        private string RemoveVietnameseAccents(string text)
        {
            // Loại bỏ dấu tiếng Việt
            var normalized = text.Normalize(System.Text.NormalizationForm.FormD);
            var stringBuilder = new System.Text.StringBuilder();

            foreach (char c in normalized)
            {
                if (System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c) != System.Globalization.UnicodeCategory.NonSpacingMark)
                    stringBuilder.Append(c);
            }

            return stringBuilder.ToString().Normalize(System.Text.NormalizationForm.FormC);
        }

        // GET: api/DocGia
        [HttpGet]
        public ActionResult<IEnumerable<DocGia>> GetAll()
        {
            return Ok(_context.DocGias.ToList());
        }

        // GET: api/DocGia/5
        [HttpGet("{id}")]
        public ActionResult<DocGia> GetById(int id)
        {
            var docGia = _context.DocGias.FirstOrDefault(dg => dg.MaDG == id);
            if (docGia == null)
                return NotFound();
            return Ok(docGia);
        }

        // POST: api/DocGia
        [HttpPost]
        public ActionResult<DocGia> Create([FromBody] CreateDocGiaDto dto)
        {
            var docGia = new DocGia
            {
                HoTen = dto.HoTen,
                TenDG = dto.HoTen, // Set TenDG same as HoTen
                Email = dto.Email,
                SDT = dto.SDT,
                DiaChi = dto.DiaChi,
                GioiTinh = dto.GioiTinh,              
                LoaiDocGia = dto.LoaiDocGia ?? "Thuong",
                CapBac = dto.LoaiDocGia, // Default value
                NgayDangKy = DateTime.Now,
                NgayHetHan = DateTime.Now.AddMonths(9),
                PhiThanhVien = dto.PhiThanhVien,
                MemberStatus = (dto.PhiThanhVien > 0) ? "DaThanhToan" : "ChuaThanhToan" , // Default value
                LyDoKhoa = null, // Allow null
                NgayCapNhat = DateTime.Now
                
            };
            _context.DocGias.Add(docGia);
            _context.SaveChanges();

            // Tự động tạo tài khoản đăng nhập cho Reader
            var username = GenerateUsername(dto.HoTen);
            var password = GeneratePassword();
            
            var nguoiDung = new NguoiDung
            {
                TenDangNhap = username,
                MatKhau = password,
                ChucVu = "Reader",
                DocGiaId = docGia.MaDG
            };
            _context.NguoiDungs.Add(nguoiDung);
            _context.SaveChanges();

            // Trả về thông tin tài khoản
            return CreatedAtAction(nameof(GetById), new { id = docGia.MaDG }, new
            {
                docGia,
                accountInfo = new
                {
                    username = username,
                    password = password,
                    message = "Tài khoản đăng nhập đã được tạo tự động"
                }
            });
        }

        // PUT: api/DocGia/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] CreateDocGiaDto dto)
        {
            var docGia = _context.DocGias.FirstOrDefault(dg => dg.MaDG == id);
            if (docGia == null)
                return NotFound();
            docGia.HoTen = dto.HoTen;
            docGia.TenDG = dto.HoTen; // Update TenDG as well
            docGia.Email = dto.Email;
            docGia.SDT = dto.SDT;
            docGia.DiaChi = dto.DiaChi;
            docGia.GioiTinh = dto.GioiTinh;
            docGia.NgaySinh = dto.NgaySinh;
            docGia.LoaiDocGia = dto.LoaiDocGia;
            docGia.PhiThanhVien = dto.PhiThanhVien;
            docGia.NgayCapNhat = DateTime.Now;
            _context.SaveChanges();
            return NoContent();
        }

        // DELETE: api/DocGia/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var docGia = _context.DocGias.FirstOrDefault(dg => dg.MaDG == id);
            if (docGia == null)
                return NotFound();
            _context.DocGias.Remove(docGia);
            _context.SaveChanges();
            return NoContent();
        }

        // POST: api/DocGia/RegisterMembership
        [HttpPost("RegisterMembership")]
        public IActionResult RegisterMembership([FromBody] RegisterMembershipRequest request)
        {
            var docGia = _context.DocGias.FirstOrDefault(dg => dg.MaDG == request.DocGiaId);
            if (docGia == null)
                return NotFound("Không tìm thấy Reader");
            if (!string.IsNullOrEmpty(docGia.MemberStatus) && docGia.MemberStatus == "DaThanhToan")
                return BadRequest("Reader đã là thành viên");
            docGia.LoaiDocGia = request.MemberType;
            docGia.MemberStatus = "ChoXacNhan";
            docGia.NgayDangKy = DateTime.Now;
            // NgayHetHan sẽ được cập nhật khi xác nhận thanh toán
            _context.SaveChanges();
            return Ok(new { docGia.MaDG, docGia.LoaiDocGia, docGia.MemberStatus, docGia.NgayDangKy });
        }

        // POST: api/DocGia/ConfirmMembership
        [HttpPost("ConfirmMembership")]
        public IActionResult ConfirmMembership([FromBody] ConfirmMembershipRequest request)
        {
            var docGia = _context.DocGias.FirstOrDefault(dg => dg.MaDG == request.DocGiaId);
            if (docGia == null)
                return NotFound("Không tìm thấy Reader");
            if (docGia.MemberStatus != "ChoXacNhan")
                return BadRequest("Yêu cầu không hợp lệ hoặc đã xác nhận");
            docGia.MemberStatus = "DaThanhToan";
            docGia.NgayDangKy = DateTime.Now;
            // Tính ngày hết hạn: mặc định 1 năm cho mọi gói, có thể thay đổi nếu cần
            docGia.NgayHetHan = DateTime.Now.AddYears(1);
            _context.SaveChanges();
            return Ok(new { docGia.MaDG, docGia.LoaiDocGia, docGia.MemberStatus, docGia.NgayDangKy, docGia.NgayHetHan });
        }
    }
}
