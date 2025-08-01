using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LibraryApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePhieuNhapKhoModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CT_PhieuNhapKhos");

            migrationBuilder.RenameColumn(
                name: "MaPhieuNhap",
                table: "PhieuNhapKhos",
                newName: "Id");

            migrationBuilder.AlterColumn<string>(
                name: "NhaCungCap",
                table: "PhieuNhapKhos",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "NgayNhap",
                table: "PhieuNhapKhos",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GhiChu",
                table: "PhieuNhapKhos",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MaPhieu",
                table: "PhieuNhapKhos",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayCapNhat",
                table: "PhieuNhapKhos",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayTao",
                table: "PhieuNhapKhos",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "TongTien",
                table: "PhieuNhapKhos",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "TrangThai",
                table: "PhieuNhapKhos",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "ChiTietPhieuNhapKhos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PhieuNhapKhoId = table.Column<int>(type: "int", nullable: false),
                    MaSach = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TenSach = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    SoLuong = table.Column<int>(type: "int", nullable: false),
                    DonGia = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ThanhTien = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietPhieuNhapKhos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuNhapKhos_PhieuNhapKhos_PhieuNhapKhoId",
                        column: x => x.PhieuNhapKhoId,
                        principalTable: "PhieuNhapKhos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuNhapKhos_PhieuNhapKhoId",
                table: "ChiTietPhieuNhapKhos",
                column: "PhieuNhapKhoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChiTietPhieuNhapKhos");

            migrationBuilder.DropColumn(
                name: "GhiChu",
                table: "PhieuNhapKhos");

            migrationBuilder.DropColumn(
                name: "MaPhieu",
                table: "PhieuNhapKhos");

            migrationBuilder.DropColumn(
                name: "NgayCapNhat",
                table: "PhieuNhapKhos");

            migrationBuilder.DropColumn(
                name: "NgayTao",
                table: "PhieuNhapKhos");

            migrationBuilder.DropColumn(
                name: "TongTien",
                table: "PhieuNhapKhos");

            migrationBuilder.DropColumn(
                name: "TrangThai",
                table: "PhieuNhapKhos");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "PhieuNhapKhos",
                newName: "MaPhieuNhap");

            migrationBuilder.AlterColumn<string>(
                name: "NhaCungCap",
                table: "PhieuNhapKhos",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<DateTime>(
                name: "NgayNhap",
                table: "PhieuNhapKhos",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.CreateTable(
                name: "CT_PhieuNhapKhos",
                columns: table => new
                {
                    MaPhieuNhap = table.Column<int>(type: "int", nullable: false),
                    MaSach = table.Column<int>(type: "int", nullable: false),
                    DonGia = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SoLuong = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CT_PhieuNhapKhos", x => new { x.MaPhieuNhap, x.MaSach });
                    table.ForeignKey(
                        name: "FK_CT_PhieuNhapKhos_PhieuNhapKhos_MaPhieuNhap",
                        column: x => x.MaPhieuNhap,
                        principalTable: "PhieuNhapKhos",
                        principalColumn: "MaPhieuNhap",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CT_PhieuNhapKhos_Saches_MaSach",
                        column: x => x.MaSach,
                        principalTable: "Saches",
                        principalColumn: "MaSach",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CT_PhieuNhapKhos_MaSach",
                table: "CT_PhieuNhapKhos",
                column: "MaSach");
        }
    }
}
