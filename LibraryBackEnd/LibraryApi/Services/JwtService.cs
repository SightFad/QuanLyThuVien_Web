using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LibraryApi.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace LibraryApi.Services
{
    public class JwtService
    {
        private readonly string _secret;
        private readonly string _expDate;

        public JwtService(IConfiguration config)
        {
            _secret = config["Jwt:Key"] ?? throw new ArgumentNullException(nameof(config), "JWT Key is not configured");
            _expDate = config["Jwt:ExpireDays"] ?? throw new ArgumentNullException(nameof(config), "JWT ExpireDays is not configured");
        }

        public string GenerateToken(NguoiDung nguoiDung)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, nguoiDung.MaND.ToString()),
                    new Claim(ClaimTypes.Name, nguoiDung.TenDangNhap),
                    new Claim(ClaimTypes.Role, nguoiDung.ChucVu ?? "")
                }),
                Expires = DateTime.UtcNow.AddDays(double.Parse(_expDate)),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
} 