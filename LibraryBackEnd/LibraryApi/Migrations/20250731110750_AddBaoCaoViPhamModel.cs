using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LibraryApi.Migrations
{
    /// <inheritdoc />
    public partial class AddBaoCaoViPhamModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CT_KiemKes_PhieuKiemKes_MaPhieuKK",
                table: "CT_KiemKes");

            migrationBuilder.DropForeignKey(
                name: "FK_CT_KiemKes_Saches_MaSach",
                table: "CT_KiemKes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CT_KiemKes",
                table: "CT_KiemKes");

            migrationBuilder.DropIndex(
                name: "IX_CT_KiemKes_MaSach",
                table: "CT_KiemKes");

            migrationBuilder.DropColumn(
                name: "NguoiKK",
                table: "PhieuKiemKes");

            migrationBuilder.RenameTable(
                name: "CT_KiemKes",
                newName: "CT_KiemKe");

            migrationBuilder.RenameColumn(
                name: "NgayKK",
                table: "PhieuKiemKes",
                newName: "NgayCapNhat");

            migrationBuilder.RenameColumn(
                name: "MaPhieuKK",
                table: "PhieuKiemKes",
                newName: "Id");

            migrationBuilder.AddColumn<string>(
                name: "GhiChu",
                table: "PhieuKiemKes",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "KyKiemKe",
                table: "PhieuKiemKes",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayKiemKe",
                table: "PhieuKiemKes",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayTao",
                table: "PhieuKiemKes",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "NhanVienThucHien",
                table: "PhieuKiemKes",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TrangThai",
                table: "PhieuKiemKes",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "PhieuKiemKeId",
                table: "CT_KiemKe",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SachMaSach",
                table: "CT_KiemKe",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_CT_KiemKe",
                table: "CT_KiemKe",
                columns: new[] { "MaPhieuKK", "MaSach" });

            migrationBuilder.CreateTable(
                name: "BaoCaoViPhams",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NgayBaoCao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    STT = table.Column<int>(type: "int", nullable: false),
                    MaSach = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TenSach = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    SoNgayTre = table.Column<int>(type: "int", nullable: true),
                    LoaiViPham = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    GhiChu = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    MaDocGia = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TenDocGia = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TrangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    TienPhat = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BaoCaoViPhams", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietPhieuKiemKes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PhieuKiemKeId = table.Column<int>(type: "int", nullable: false),
                    MaSach = table.Column<int>(type: "int", nullable: false),
                    TenSach = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    SoLuongHeThong = table.Column<int>(type: "int", nullable: false),
                    SoLuongThucTe = table.Column<int>(type: "int", nullable: false),
                    ChenhLech = table.Column<int>(type: "int", nullable: false),
                    GhiChu = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietPhieuKiemKes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuKiemKes_PhieuKiemKes_PhieuKiemKeId",
                        column: x => x.PhieuKiemKeId,
                        principalTable: "PhieuKiemKes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuKiemKes_Saches_MaSach",
                        column: x => x.MaSach,
                        principalTable: "Saches",
                        principalColumn: "MaSach",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CT_KiemKe_PhieuKiemKeId",
                table: "CT_KiemKe",
                column: "PhieuKiemKeId");

            migrationBuilder.CreateIndex(
                name: "IX_CT_KiemKe_SachMaSach",
                table: "CT_KiemKe",
                column: "SachMaSach");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuKiemKes_MaSach",
                table: "ChiTietPhieuKiemKes",
                column: "MaSach");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuKiemKes_PhieuKiemKeId",
                table: "ChiTietPhieuKiemKes",
                column: "PhieuKiemKeId");

            migrationBuilder.AddForeignKey(
                name: "FK_CT_KiemKe_PhieuKiemKes_PhieuKiemKeId",
                table: "CT_KiemKe",
                column: "PhieuKiemKeId",
                principalTable: "PhieuKiemKes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CT_KiemKe_Saches_SachMaSach",
                table: "CT_KiemKe",
                column: "SachMaSach",
                principalTable: "Saches",
                principalColumn: "MaSach",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CT_KiemKe_PhieuKiemKes_PhieuKiemKeId",
                table: "CT_KiemKe");

            migrationBuilder.DropForeignKey(
                name: "FK_CT_KiemKe_Saches_SachMaSach",
                table: "CT_KiemKe");

            migrationBuilder.DropTable(
                name: "BaoCaoViPhams");

            migrationBuilder.DropTable(
                name: "ChiTietPhieuKiemKes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CT_KiemKe",
                table: "CT_KiemKe");

            migrationBuilder.DropIndex(
                name: "IX_CT_KiemKe_PhieuKiemKeId",
                table: "CT_KiemKe");

            migrationBuilder.DropIndex(
                name: "IX_CT_KiemKe_SachMaSach",
                table: "CT_KiemKe");

            migrationBuilder.DropColumn(
                name: "GhiChu",
                table: "PhieuKiemKes");

            migrationBuilder.DropColumn(
                name: "KyKiemKe",
                table: "PhieuKiemKes");

            migrationBuilder.DropColumn(
                name: "NgayKiemKe",
                table: "PhieuKiemKes");

            migrationBuilder.DropColumn(
                name: "NgayTao",
                table: "PhieuKiemKes");

            migrationBuilder.DropColumn(
                name: "NhanVienThucHien",
                table: "PhieuKiemKes");

            migrationBuilder.DropColumn(
                name: "TrangThai",
                table: "PhieuKiemKes");

            migrationBuilder.DropColumn(
                name: "PhieuKiemKeId",
                table: "CT_KiemKe");

            migrationBuilder.DropColumn(
                name: "SachMaSach",
                table: "CT_KiemKe");

            migrationBuilder.RenameTable(
                name: "CT_KiemKe",
                newName: "CT_KiemKes");

            migrationBuilder.RenameColumn(
                name: "NgayCapNhat",
                table: "PhieuKiemKes",
                newName: "NgayKK");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "PhieuKiemKes",
                newName: "MaPhieuKK");

            migrationBuilder.AddColumn<string>(
                name: "NguoiKK",
                table: "PhieuKiemKes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CT_KiemKes",
                table: "CT_KiemKes",
                columns: new[] { "MaPhieuKK", "MaSach" });

            migrationBuilder.CreateIndex(
                name: "IX_CT_KiemKes_MaSach",
                table: "CT_KiemKes",
                column: "MaSach");

            migrationBuilder.AddForeignKey(
                name: "FK_CT_KiemKes_PhieuKiemKes_MaPhieuKK",
                table: "CT_KiemKes",
                column: "MaPhieuKK",
                principalTable: "PhieuKiemKes",
                principalColumn: "MaPhieuKK",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CT_KiemKes_Saches_MaSach",
                table: "CT_KiemKes",
                column: "MaSach",
                principalTable: "Saches",
                principalColumn: "MaSach",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
