using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using LibraryApi.Data;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using System.IO;

namespace LibraryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Restrict to admin only
    public class BackupController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly IWebHostEnvironment _environment;

        public BackupController(LibraryContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // GET: api/Backup/history
        [HttpGet("history")]
        public async Task<ActionResult<object>> GetBackupHistory([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                // Since we don't have a dedicated backup table, we'll simulate backup history
                // In a real system, you'd store backup records in a database table
                var mockBackups = GenerateMockBackupHistory();

                // Apply pagination
                var totalCount = mockBackups.Count;
                var paginatedBackups = mockBackups
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                // Calculate database size (approximate)
                var dbInfo = await GetDatabaseInfo();

                var result = new
                {
                    backups = paginatedBackups,
                    pagination = new
                    {
                        page = page,
                        pageSize = pageSize,
                        totalCount = totalCount,
                        totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                    },
                    databaseInfo = dbInfo,
                    statistics = new
                    {
                        totalBackups = totalCount,
                        successfulBackups = mockBackups.Count(b => b.Status == "completed"),
                        failedBackups = mockBackups.Count(b => b.Status == "failed"),
                        averageSize = mockBackups.Where(b => b.Status == "completed").Average(b => b.SizeInMB),
                        lastBackupDate = mockBackups.OrderByDescending(b => b.Date).FirstOrDefault()?.Date
                    }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy lịch sử backup", error = ex.Message });
            }
        }

        // GET: api/Backup/status
        [HttpGet("status")]
        public async Task<ActionResult<object>> GetBackupStatus()
        {
            try
            {
                var dbInfo = await GetDatabaseInfo();
                var lastBackup = GenerateMockBackupHistory().OrderByDescending(b => b.Date).FirstOrDefault();

                var status = new
                {
                    databaseSize = $"{dbInfo.SizeInMB:F1} MB",
                    tableCount = dbInfo.TableCount,
                    recordCount = dbInfo.RecordCount,
                    lastBackupDate = lastBackup?.Date,
                    lastBackupStatus = lastBackup?.Status,
                    nextScheduledBackup = DateTime.Now.Date.AddDays(1).AddHours(23), // Daily at 23:00
                    autoBackupEnabled = true,
                    backupRetentionDays = 30,
                    availableSpace = "50 GB", // Mock value
                    backupLocation = Path.Combine(_environment.ContentRootPath, "Backups")
                };

                return Ok(status);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy trạng thái backup", error = ex.Message });
            }
        }

        // POST: api/Backup/create
        [HttpPost("create")]
        public async Task<ActionResult<object>> CreateBackup([FromBody] CreateBackupRequest request)
        {
            try
            {
                // In a real system, you would:
                // 1. Create actual database backup
                // 2. Store backup metadata in database
                // 3. Handle backup compression and encryption
                
                var dbInfo = await GetDatabaseInfo();
                
                // Simulate backup creation process
                var backup = new
                {
                    id = Guid.NewGuid().ToString(),
                    date = DateTime.Now,
                    type = request.Type ?? "manual",
                    status = "in_progress",
                    sizeInMB = dbInfo.SizeInMB,
                    estimatedDuration = CalculateEstimatedDuration(dbInfo.SizeInMB),
                    description = request.Description ?? "Manual backup created via admin panel",
                    includeUserData = request.IncludeUserData ?? true,
                    includeSystemData = request.IncludeSystemData ?? true,
                    compression = request.EnableCompression ?? true
                };

                // In a real system, this would trigger an actual backup process
                // For now, we'll return the backup info immediately
                return Ok(new 
                { 
                    message = "Backup đã được khởi tạo thành công",
                    backup = backup,
                    estimatedCompletion = DateTime.Now.AddMinutes(backup.estimatedDuration)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tạo backup", error = ex.Message });
            }
        }

        // POST: api/Backup/{id}/restore
        [HttpPost("{id}/restore")]
        public async Task<ActionResult<object>> RestoreBackup(string id, [FromBody] RestoreBackupRequest request)
        {
            try
            {
                // Validate backup exists (in mock system, we'll accept any valid GUID)
                if (!Guid.TryParse(id, out _))
                {
                    return BadRequest("ID backup không hợp lệ");
                }

                // In a real system, you would:
                // 1. Validate backup file exists and is not corrupted
                // 2. Create a backup of current state before restore
                // 3. Perform actual database restore
                // 4. Validate restored data integrity

                var restoreOperation = new
                {
                    id = Guid.NewGuid().ToString(),
                    backupId = id,
                    startTime = DateTime.Now,
                    status = "in_progress",
                    estimatedDuration = 10, // minutes
                    restorePoint = DateTime.Now,
                    options = new
                    {
                        overwriteExisting = request.OverwriteExisting ?? false,
                        restoreUserData = request.RestoreUserData ?? true,
                        restoreSystemData = request.RestoreSystemData ?? true,
                        createBackupBeforeRestore = request.CreateBackupBeforeRestore ?? true
                    }
                };

                return Ok(new 
                { 
                    message = "Quá trình khôi phục đã được khởi tạo",
                    operation = restoreOperation,
                    warning = "Hệ thống sẽ tạm thời không khả dụng trong quá trình khôi phục",
                    estimatedCompletion = DateTime.Now.AddMinutes(10)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi khôi phục backup", error = ex.Message });
            }
        }

        // DELETE: api/Backup/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBackup(string id)
        {
            try
            {
                if (!Guid.TryParse(id, out _))
                {
                    return BadRequest("ID backup không hợp lệ");
                }

                // In a real system:
                // 1. Delete backup file from storage
                // 2. Remove backup record from database
                // 3. Clean up any related metadata

                return Ok(new { message = "Backup đã được xóa thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xóa backup", error = ex.Message });
            }
        }

        // GET: api/Backup/settings
        [HttpGet("settings")]
        public ActionResult<object> GetBackupSettings()
        {
            try
            {
                var settings = new
                {
                    autoBackupEnabled = true,
                    backupSchedule = "daily", // daily, weekly, monthly
                    backupTime = "23:00",
                    retentionPeriodDays = 30,
                    maxBackupCount = 10,
                    compressionEnabled = true,
                    encryptionEnabled = false,
                    backupLocation = Path.Combine(_environment.ContentRootPath, "Backups"),
                    includeUserUploads = true,
                    includeLogFiles = false,
                    notificationsEnabled = true,
                    emailNotifications = "admin@library.com"
                };

                return Ok(settings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy cài đặt backup", error = ex.Message });
            }
        }

        // PUT: api/Backup/settings
        [HttpPut("settings")]
        public ActionResult UpdateBackupSettings([FromBody] BackupSettingsRequest settings)
        {
            try
            {
                // In a real system, save settings to database or configuration file
                return Ok(new { message = "Cài đặt backup đã được cập nhật thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật cài đặt backup", error = ex.Message });
            }
        }

        // Helper methods
        private async Task<DatabaseInfo> GetDatabaseInfo()
        {
            var tableCount = 15; // Approximate number of tables in your system
            
            var recordCounts = new Dictionary<string, int>
            {
                ["Books"] = await _context.Saches.CountAsync(),
                ["Readers"] = await _context.DocGias.CountAsync(),
                ["Users"] = await _context.NguoiDungs.CountAsync(),
                ["BorrowRecords"] = await _context.PhieuMuons.CountAsync(),
                //["Reservations"] = await _context.Reservations.CountAsync()
            };

            var totalRecords = recordCounts.Values.Sum();
            var estimatedSizeInMB = totalRecords * 0.002; // Rough estimate: 2KB per record

            return new DatabaseInfo
            {
                TableCount = tableCount,
                RecordCount = totalRecords,
                SizeInMB = Math.Max(estimatedSizeInMB, 1.0), // Minimum 1MB
                Details = recordCounts
            };
        }

        private List<BackupRecord> GenerateMockBackupHistory()
        {
            var backups = new List<BackupRecord>();
            var random = new Random();

            for (int i = 0; i < 30; i++) // Last 30 backups
            {
                var date = DateTime.Now.AddDays(-i);
                var isSuccess = random.NextDouble() > 0.1; // 90% success rate
                
                backups.Add(new BackupRecord
                {
                    Id = Guid.NewGuid().ToString(),
                    Date = date,
                    Type = i % 7 == 0 ? "manual" : "automatic", // Manual backup every 7 days
                    Status = isSuccess ? "completed" : "failed",
                    SizeInMB = random.NextDouble() * 2 + 1.5, // 1.5-3.5 MB
                    Duration = isSuccess ? random.Next(10, 25) : random.Next(5, 10),
                    Description = i % 7 == 0 ? "Manual backup" : "Scheduled automatic backup",
                    Error = isSuccess ? null : "Connection timeout during backup process"
                });
            }

            return backups.OrderByDescending(b => b.Date).ToList();
        }

        private int CalculateEstimatedDuration(double sizeInMB)
        {
            // Estimate backup duration based on size (rough calculation)
            return Math.Max((int)(sizeInMB * 2), 5); // At least 5 minutes
        }
    }

    // DTOs
    public class CreateBackupRequest
    {
        public string? Type { get; set; } = "manual";
        public string? Description { get; set; }
        public bool? IncludeUserData { get; set; } = true;
        public bool? IncludeSystemData { get; set; } = true;
        public bool? EnableCompression { get; set; } = true;
    }

    public class RestoreBackupRequest
    {
        public bool? OverwriteExisting { get; set; } = false;
        public bool? RestoreUserData { get; set; } = true;
        public bool? RestoreSystemData { get; set; } = true;
        public bool? CreateBackupBeforeRestore { get; set; } = true;
    }

    public class BackupSettingsRequest
    {
        public bool AutoBackupEnabled { get; set; }
        public string BackupSchedule { get; set; } = "daily";
        public string BackupTime { get; set; } = "23:00";
        public int RetentionPeriodDays { get; set; } = 30;
        public int MaxBackupCount { get; set; } = 10;
        public bool CompressionEnabled { get; set; } = true;
        public bool EncryptionEnabled { get; set; } = false;
        public bool IncludeUserUploads { get; set; } = true;
        public bool IncludeLogFiles { get; set; } = false;
        public bool NotificationsEnabled { get; set; } = true;
        public string? EmailNotifications { get; set; }
    }

    public class DatabaseInfo
    {
        public int TableCount { get; set; }
        public int RecordCount { get; set; }
        public double SizeInMB { get; set; }
        public Dictionary<string, int> Details { get; set; } = new();
    }

    public class BackupRecord
    {
        public string Id { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public double SizeInMB { get; set; }
        public int Duration { get; set; } // in minutes
        public string? Description { get; set; }
        public string? Error { get; set; }
    }
}