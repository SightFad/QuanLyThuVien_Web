using LibraryApi.Data;
using LibraryApi.Models;
using Microsoft.EntityFrameworkCore;
using LibraryApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Configure database based on environment
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDbContext<LibraryContext>(options =>
        options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
}
else
{
    builder.Services.AddDbContext<LibraryContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
}

// Add JWT Service
builder.Services.AddScoped<JwtService>();

// Add other services
builder.Services.AddScoped<BookProposalService>();
builder.Services.AddScoped<BookReservationService>();
builder.Services.AddScoped<BaoCaoService>();
builder.Services.AddScoped<ViolationService>();

// Add JWT Authentication (simplified for testing)
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException("JWT key is not configured in appsettings.json");
}
Console.WriteLine($"JWT Key: {jwtKey}");
Console.WriteLine($"JWT Key Length: {jwtKey?.Length}");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtKey)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true
        };
    });

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

            // Initialize database with seed data
            using (var scope = app.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<LibraryContext>();
                
                // Ensure database is created and migrations are applied
                context.Database.EnsureCreated();
                
                // Seed data if database is empty
                if (!context.NguoiDungs.Any())
                {
                    Console.WriteLine("Seeding database with initial data...");
                    
                    // Add users
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
                            TenDangNhap = "reader",
                            MatKhau = "reader123",
                            ChucVu = "Reader"
                        },
                        new NguoiDung
                        {
                            TenDangNhap = "reader1",
                            MatKhau = "reader123",
                            ChucVu = "Reader"
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
                        }
                    );
                    
                    // Add sample books
                    context.Saches.AddRange(
                        new Sach
                        {
                            TenSach = "Đắc Nhân Tâm",
                            TacGia = "Dale Carnegie",
                            TheLoai = "Kỹ năng sống",
                            KeSach = "Kệ A1",
                            ViTriLuuTru = "Kệ A1 - Tầng 1",
                            NhaXuatBan = "NXB Tổng hợp TP.HCM",
                            SoLuong = 5,
                            TrangThai = "Có sẵn",
                            MoTa = "Cuốn sách kinh điển về nghệ thuật đối nhân xử thế và kỹ năng giao tiếp.",
                            NamXuatBan = 1936,
                            ISBN = "978-0-671-02703-2",
                            AnhBia = "/images/book-covers/python.jpg"
                        },
                        new Sach
                        {
                            TenSach = "Nhà Giả Kim",
                            TacGia = "Paulo Coelho",
                            TheLoai = "Tiểu thuyết",
                            KeSach = "Kệ B2",
                            ViTriLuuTru = "Kệ B2 - Tầng 1",
                            NhaXuatBan = "NXB Văn học",
                            SoLuong = 3,
                            TrangThai = "Có sẵn",
                            MoTa = "Câu chuyện về hành trình tìm kiếm kho báu và ý nghĩa cuộc sống.",
                            NamXuatBan = 1988,
                            ISBN = "978-0-06-231500-7",
                            AnhBia = "/images/book-covers/ml.jpg"
                        },
                        new Sach
                        {
                            TenSach = "React Programming",
                            TacGia = "John Doe",
                            TheLoai = "Công nghệ",
                            KeSach = "Kệ C3",
                            ViTriLuuTru = "Kệ C3 - Tầng 2",
                            NhaXuatBan = "NXB Công nghệ",
                            SoLuong = 2,
                            TrangThai = "Đã mượn",
                            MoTa = "Hướng dẫn chi tiết về React.js và các best practices.",
                            NamXuatBan = 2023,
                            ISBN = "978-1-234-56789-0",
                            AnhBia = "/images/book-covers/react.jpg"
                        },
                        new Sach
                        {
                            TenSach = "Database Design",
                            TacGia = "Jane Smith",
                            TheLoai = "Công nghệ",
                            KeSach = "Kệ D4",
                            ViTriLuuTru = "Kệ D4 - Tầng 2",
                            NhaXuatBan = "NXB Công nghệ",
                            SoLuong = 4,
                            TrangThai = "Có sẵn",
                            MoTa = "Nguyên lý thiết kế cơ sở dữ liệu và tối ưu hóa hiệu suất.",
                            NamXuatBan = 2022,
                            ISBN = "978-0-987-65432-1",
                            AnhBia = "/images/book-covers/database.jpg"
                        },
                        new Sach
                        {
                            TenSach = "Web Development",
                            TacGia = "Mike Johnson",
                            TheLoai = "Công nghệ",
                            KeSach = "Kệ E5",
                            ViTriLuuTru = "Kệ E5 - Tầng 2",
                            NhaXuatBan = "NXB Công nghệ",
                            SoLuong = 3,
                            TrangThai = "Đã đặt",
                            MoTa = "Toàn diện về phát triển web hiện đại với các công nghệ mới nhất.",
                            NamXuatBan = 2023,
                            ISBN = "978-5-432-10987-6",
                            AnhBia = "/images/book-covers/web.jpg"
                        }
                    );
                    
                    context.SaveChanges();
                    Console.WriteLine("Database seeded successfully!");
                }
            }

// Add a simple test endpoint
app.MapGet("/api/test", () => "Backend API is running!");
app.MapGet("/", () => "Library Management API is running!");

app.Run();
