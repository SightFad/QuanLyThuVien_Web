using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using LibraryApi.Services;
using LibraryApi.Models;

namespace LibraryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookProposalController : ControllerBase
    {
        private readonly BookProposalService _bookProposalService;

        public BookProposalController(BookProposalService bookProposalService)
        {
            _bookProposalService = bookProposalService;
        }

        [HttpGet("statistics")]
        public async Task<ActionResult<ProposalStatisticsDto>> GetStatistics()
        {
            try
            {
                var statistics = await _bookProposalService.GetStatisticsAsync();
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thống kê: " + ex.Message });
            }
        }

        [HttpGet("all")]
        public async Task<ActionResult<List<PhieuDeXuatMuaSachDto>>> GetAllProposals(
            [FromQuery] string status = null,
            [FromQuery] string priority = null)
        {
            try
            {
                var proposals = await _bookProposalService.GetAllProposalsAsync(status, priority);
                return Ok(proposals);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách đề xuất: " + ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PhieuDeXuatMuaSachDto>> GetProposalById(int id)
        {
            try
            {
                var proposal = await _bookProposalService.GetProposalByIdAsync(id);
                if (proposal == null)
                    return NotFound(new { message = "Không tìm thấy đề xuất" });

                return Ok(proposal);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thông tin đề xuất: " + ex.Message });
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<PhieuDeXuatMuaSachDto>>> GetProposalsByUser(int userId)
        {
            try
            {
                var proposals = await _bookProposalService.GetProposalsByUserAsync(userId);
                return Ok(proposals);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy đề xuất của người dùng: " + ex.Message });
            }
        }

        [HttpPost("create")]
        public async Task<ActionResult<PhieuDeXuatMuaSachDto>> CreateProposal(CreatePhieuDeXuatMuaSachDto createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var proposal = await _bookProposalService.CreateProposalAsync(createDto);
                return CreatedAtAction(nameof(GetProposalById), new { id = proposal.MaDeXuat }, proposal);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tạo đề xuất: " + ex.Message });
            }
        }

        [HttpPut("update/{id}")]
        public async Task<ActionResult<PhieuDeXuatMuaSachDto>> UpdateProposal(int id, UpdatePhieuDeXuatMuaSachDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var proposal = await _bookProposalService.UpdateProposalAsync(id, updateDto);
                if (proposal == null)
                    return NotFound(new { message = "Không tìm thấy đề xuất" });

                return Ok(proposal);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật đề xuất: " + ex.Message });
            }
        }

        [HttpPost("approve-reject")]
        public async Task<ActionResult<PhieuDeXuatMuaSachDto>> ApproveRejectProposal(ApproveRejectProposalDto approveRejectDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var proposal = await _bookProposalService.ApproveRejectProposalAsync(approveRejectDto);
                if (proposal == null)
                    return NotFound(new { message = "Không tìm thấy đề xuất" });

                return Ok(proposal);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi duyệt/từ chối đề xuất: " + ex.Message });
            }
        }

        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> DeleteProposal(int id)
        {
            try
            {
                var result = await _bookProposalService.DeleteProposalAsync(id);
                if (!result)
                    return NotFound(new { message = "Không tìm thấy đề xuất" });

                return Ok(new { message = "Xóa đề xuất thành công" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xóa đề xuất: " + ex.Message });
            }
        }
    }
} 