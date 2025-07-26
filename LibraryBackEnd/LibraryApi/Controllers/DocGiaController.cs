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
                Email = dto.Email,
                SDT = dto.SDT,
                DiaChi = dto.DiaChi,
                GioiTinh = dto.GioiTinh,
                NgaySinh = dto.NgaySinh
            };
            _context.DocGias.Add(docGia);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = docGia.MaDG }, docGia);
        }

        // PUT: api/DocGia/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] CreateDocGiaDto dto)
        {
            var docGia = _context.DocGias.FirstOrDefault(dg => dg.MaDG == id);
            if (docGia == null)
                return NotFound();
            docGia.HoTen = dto.HoTen;
            docGia.Email = dto.Email;
            docGia.SDT = dto.SDT;
            docGia.DiaChi = dto.DiaChi;
            docGia.GioiTinh = dto.GioiTinh;
            docGia.NgaySinh = dto.NgaySinh;
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
                return NotFound("Không tìm thấy độc giả");
            if (!string.IsNullOrEmpty(docGia.MemberStatus) && docGia.MemberStatus == "DaThanhToan")
                return BadRequest("Độc giả đã là thành viên");
            docGia.MemberType = request.MemberType;
            docGia.MemberStatus = "ChoXacNhan";
            docGia.NgayDangKy = DateTime.Now;
            // NgayHetHan sẽ được cập nhật khi xác nhận thanh toán
            _context.SaveChanges();
            return Ok(new { docGia.MaDG, docGia.MemberType, docGia.MemberStatus, docGia.NgayDangKy });
        }

        // POST: api/DocGia/ConfirmMembership
        [HttpPost("ConfirmMembership")]
        public IActionResult ConfirmMembership([FromBody] ConfirmMembershipRequest request)
        {
            var docGia = _context.DocGias.FirstOrDefault(dg => dg.MaDG == request.DocGiaId);
            if (docGia == null)
                return NotFound("Không tìm thấy độc giả");
            if (docGia.MemberStatus != "ChoXacNhan")
                return BadRequest("Yêu cầu không hợp lệ hoặc đã xác nhận");
            docGia.MemberStatus = "DaThanhToan";
            docGia.NgayDangKy = DateTime.Now;
            // Tính ngày hết hạn: mặc định 1 năm cho mọi gói, có thể thay đổi nếu cần
            docGia.NgayHetHan = DateTime.Now.AddYears(1);
            _context.SaveChanges();
            return Ok(new { docGia.MaDG, docGia.MemberType, docGia.MemberStatus, docGia.NgayDangKy, docGia.NgayHetHan });
        }
    }
}
