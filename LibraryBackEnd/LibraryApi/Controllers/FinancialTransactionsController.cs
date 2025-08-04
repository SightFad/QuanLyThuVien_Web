
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using LibraryApi.Data;

//namespace LibraryApi.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    [Authorize]
//    public class FinancialTransactionsController : ControllerBase
//    {
//        private readonly LibraryContext _context;

//        public FinancialTransactionsController(LibraryContext context)
//        {
//            _context = context;
//        }

//        // GET: api/FinancialTransactions
//        [HttpGet]
//        public async Task<ActionResult<object>> GetTransactions([FromQuery] string? search = null, [FromQuery] string? type = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
//        {
//            try
//            {
//                var query = _context.PhieuThus.AsQueryable();

//                // Apply search filter
//                if (!string.IsNullOrEmpty(search))
//                {
//                    query = query.Where(pt => 
//                        pt.DocGia.HoTen.Contains(search) ||
//                        //pt.LyDo.Contains(search) ||
//                        pt.GhiChu.Contains(search));
//                }

//                // Apply type filter
//                if (!string.IsNullOrEmpty(type))
//                {
//                    query = query.Where(p => p.LoaiThu == type);
//                }

//                var totalCount = await query.CountAsync();
//                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

//                var transactions = await query
//                    .Include(p => p.DocGia)
//                    .OrderByDescending(p => p.NgayThu)
//                    .Skip((page - 1) * pageSize)
//                    .Take(pageSize)
//                    .Select(p => new
//                    {
//                        id = pt.MaPhieuThu,
//                        date = pt.NgayTao.ToString("yyyy-MM-dd"),
//                        type = pt.LoaiThu,
//                        memberName = pt.DocGia.HoTen,
//                        memberId = pt.MaDG,
//                        amount = pt.SoTien,
//                        //paymentMethod = pt.PhuongThucThu ?? "cash", // Default to cash if null
//                        //status = pt.TrangThai,
//                        //description = pt.LyDo ?? pt.GhiChu ?? "Không có mô tả",
//                        //paidDate = pt.NgayThu?.ToString("yyyy-MM-dd"),
//                        collector = pt.NguoiThu
//                    })
//                    .ToListAsync();

//                var result = new
//                {
//                    transactions = transactions,
//                    pagination = new
//                    {
//                        currentPage = page,
//                        totalPages = totalPages,
//                        totalCount = totalCount,
//                        pageSize = pageSize
//                    }
//                };

//                return Ok(result);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, new { message = "Lỗi khi lấy danh sách giao dịch", error = ex.Message });
//            }
//        }

//        // GET: api/FinancialTransactions/{id}
//        [HttpGet("{id}")]
//        public async Task<ActionResult<object>> GetTransaction(int id)
//        {
//            try
//            {
//                var transaction = await _context.PhieuThus
//                    .Include(p => p.DocGia)
//                    .Where(p => p.MaPhieuThu == id)
//                    .Select(p => new
//                    {
//                        id = pt.MaPhieuThu,
//                        date = pt.NgayTao.ToString("yyyy-MM-dd"),
//                        type = pt.LoaiThu,
//                        memberName = pt.DocGia.HoTen,
//                        memberId = pt.MaDG,
//                        memberEmail = pt.DocGia.Email,
//                        memberPhone = pt.DocGia.SDT,
//                        amount = pt.SoTien,
//                        //paymentMethod = pt.PhuongThucThu ?? "cash",
//                        status = pt.TrangThai,
//                        //description = pt.LyDo ?? pt.GhiChu ?? "Không có mô tả",
//                        paidDate = pt.NgayThu/*?*/.ToString("yyyy-MM-dd"),
//                        collector = pt.NguoiThu,
//                        violationId = pt.MaBaoCaoViPham,
//                        violationInfo = pt.BaoCaoViPham != null ? new
//                        {
//                            id = pt.BaoCaoViPham.Id,
//                            violationCode = pt.BaoCaoViPham.MaViPham,
//                            violationType = pt.BaoCaoViPham.MucDoViPham,
//                            notes = pt.BaoCaoViPham.GhiChu
//                        } : null
//                    })
//                    .FirstOrDefaultAsync();

//                if (transaction == null)
//                {
//                    return NotFound(new { message = "Không tìm thấy giao dịch" });
//                }

//                return Ok(transaction);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, new { message = "Lỗi khi lấy thông tin giao dịch", error = ex.Message });
//            }
//        }

//        // POST: api/FinancialTransactions
//        [HttpPost]
//        public async Task<ActionResult<object>> CreateTransaction([FromBody] object transactionData)
//        {
//            try
//            {
//                // Simulate transaction creation
//                var newTransaction = new
//                {
//                    MaDG = dto.MemberId,
//                    LoaiThu = dto.Type,
//                    SoTien = dto.Amount,
//                    //PhuongThucThu = dto.PaymentMethod,
//                    TrangThai = dto.Status ?? "ChuaThu",
//                    //LyDo = dto.Description,
//                    GhiChu = dto.Notes,
//                    NgayTao = DateTime.Now,
//                    //NgayThu = dto.Status == "DaThu" ? DateTime.Now : null,
//                    NguoiThu = dto.Status == "DaThu" ? dto.Collector : null,
//                    MaBaoCaoViPham = dto.ViolationId
//                };

//                return CreatedAtAction(nameof(GetTransaction), new { id = newTransaction.id }, newTransaction);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, new { message = "Lỗi khi tạo giao dịch", error = ex.Message });
//            }
//        }

//        //// PUT: api/FinancialTransactions/{id}
//        //[HttpPut("{id}")]
//        //public async Task<ActionResult<object>> UpdateTransaction(int id, [FromBody] object transactionData)
//        //{
//        //    try
//        //    {
//        //        var transaction = await _context.PhieuThus.FindAsync(id);
//        //        if (transaction == null)
//        //            return NotFound("Không tìm thấy giao dịch");

//        //        //// Update fields
//        //        //if (!string.IsNullOrEmpty(dto.PaymentMethod))
//        //        //    transaction.PhuongThucThu = dto.PaymentMethod;
                
//        //        if (!string.IsNullOrEmpty(dto.Status))
//        //        {
//        //            transaction.TrangThai = dto.Status;
//        //            if (dto.Status == "DaThu" && transaction.NgayThu == null)
//        //            {
//        //                id = id,
//        //                type = "Phí thành viên",
//        //                amount = 50000,
//        //                paymentMethod = "Chuyển khoản",
//        //                description = "Phí thành viên tháng 1",
//        //                date = DateTime.Now,
//        //                status = "Đã thu",
//        //                collector = "admin",
//        //                memberName = "Nguyễn Văn A"
//        //            };

//        //        return Ok(updatedTransaction);
//        //    }
//        //    catch (Exception ex)
//        //    {
//        //        return StatusCode(500, new { message = "Lỗi khi cập nhật giao dịch", error = ex.Message });
//        //    }
//        //}

//        // DELETE: api/FinancialTransactions/{id}
//        [HttpDelete("{id}")]
//        public async Task<ActionResult<object>> DeleteTransaction(int id)
//        {
//            try
//            {
//                var transaction = await _context.PhieuThus.FindAsync(id);
//                if (transaction == null)
//                    return NotFound("Không tìm thấy giao dịch");

//                if (transaction.TrangThai == "DaThu")
//                    return BadRequest("Giao dịch đã được thanh toán");

//                transaction.TrangThai = "DaThu";
//                transaction.NgayThu = DateTime.Now;
//                //transaction.NguoiThu = dto.Collector;
//                //transaction.PhuongThucThu = dto.PaymentMethod;

//                //if (!string.IsNullOrEmpty(dto.Notes))
//                //    transaction.GhiChu = dto.Notes;

//                await _context.SaveChangesAsync();

//                return Ok(new { message = "Xử lý thanh toán thành công" });
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, new { message = "Lỗi khi xóa giao dịch", error = ex.Message });
//            }
//        }

//        // GET: api/FinancialTransactions/types
//        [HttpGet("types")]
//        public async Task<ActionResult<object>> GetTransactionTypes()
//        {
//            try
//            {
//                var types = new[]
//                {
//                    new { value = "Phí thành viên", label = "Phí thành viên" },
//                    new { value = "Phạt", label = "Phạt" },
//                    new { value = "Phí dịch vụ", label = "Phí dịch vụ" },
//                    new { value = "Khác", label = "Khác" }
//                };

//                return Ok(types);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, new { message = "Lỗi khi lấy danh sách loại giao dịch", error = ex.Message });
//            }
//        }

//        // GET: api/FinancialTransactions/payment-methods
//        [HttpGet("payment-methods")]
//        public async Task<ActionResult<object>> GetPaymentMethods()
//        {
//            try
//            {
//                var methods = new[]
//                {
//                    new { value = "Tiền mặt", label = "Tiền mặt" },
//                    new { value = "Chuyển khoản", label = "Chuyển khoản" },
//                    new { value = "Thẻ tín dụng", label = "Thẻ tín dụng" },
//                    new { value = "Ví điện tử", label = "Ví điện tử" }
//                };

//                return Ok(methods);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, new { message = "Lỗi khi lấy danh sách phương thức thanh toán", error = ex.Message });
//            }
//        }
//    }
//}
