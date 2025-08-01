using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LibraryApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBookProposalSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PhieuDeXuatMuaSachs_Saches_MaSach",
                table: "PhieuDeXuatMuaSachs");

            migrationBuilder.DropColumn(
                name: "LyDo",
                table: "PhieuDeXuatMuaSachs");

            migrationBuilder.RenameColumn(
                name: "SoLuong",
                table: "PhieuDeXuatMuaSachs",
                newName: "SachMaSach");

            migrationBuilder.RenameColumn(
                name: "MaSach",
                table: "PhieuDeXuatMuaSachs",
                newName: "MaNguoiDeXuat");

            migrationBuilder.RenameIndex(
                name: "IX_PhieuDeXuatMuaSachs_MaSach",
                table: "PhieuDeXuatMuaSachs",
                newName: "IX_PhieuDeXuatMuaSachs_MaNguoiDeXuat");

            migrationBuilder.AlterColumn<string>(
                name: "TrangThai",
                table: "PhieuDeXuatMuaSachs",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<decimal>(
                name: "ChiPhiDuKien",
                table: "PhieuDeXuatMuaSachs",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "GhiChu",
                table: "PhieuDeXuatMuaSachs",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LyDoTuChoi",
                table: "PhieuDeXuatMuaSachs",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "MaNguoiDuyet",
                table: "PhieuDeXuatMuaSachs",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MoTa",
                table: "PhieuDeXuatMuaSachs",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MucDoUuTien",
                table: "PhieuDeXuatMuaSachs",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayCapNhat",
                table: "PhieuDeXuatMuaSachs",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayDeXuat",
                table: "PhieuDeXuatMuaSachs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayDuyet",
                table: "PhieuDeXuatMuaSachs",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayTao",
                table: "PhieuDeXuatMuaSachs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "TieuDe",
                table: "PhieuDeXuatMuaSachs",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "ChiTietDeXuatMuaSachs",
                columns: table => new
                {
                    MaChiTiet = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaDeXuat = table.Column<int>(type: "int", nullable: false),
                    TenSach = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    TacGia = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ISBN = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    TheLoai = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NhaXuatBan = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NamXuatBan = table.Column<int>(type: "int", nullable: true),
                    SoLuong = table.Column<int>(type: "int", nullable: false),
                    DonGia = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    LyDo = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    GhiChu = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietDeXuatMuaSachs", x => x.MaChiTiet);
                    table.ForeignKey(
                        name: "FK_ChiTietDeXuatMuaSachs_PhieuDeXuatMuaSachs_MaDeXuat",
                        column: x => x.MaDeXuat,
                        principalTable: "PhieuDeXuatMuaSachs",
                        principalColumn: "MaDeXuat",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PhieuDeXuatMuaSachs_MaNguoiDuyet",
                table: "PhieuDeXuatMuaSachs",
                column: "MaNguoiDuyet");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuDeXuatMuaSachs_SachMaSach",
                table: "PhieuDeXuatMuaSachs",
                column: "SachMaSach");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietDeXuatMuaSachs_MaDeXuat",
                table: "ChiTietDeXuatMuaSachs",
                column: "MaDeXuat");

            migrationBuilder.AddForeignKey(
                name: "FK_PhieuDeXuatMuaSachs_NguoiDungs_MaNguoiDeXuat",
                table: "PhieuDeXuatMuaSachs",
                column: "MaNguoiDeXuat",
                principalTable: "NguoiDungs",
                principalColumn: "MaND",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PhieuDeXuatMuaSachs_NguoiDungs_MaNguoiDuyet",
                table: "PhieuDeXuatMuaSachs",
                column: "MaNguoiDuyet",
                principalTable: "NguoiDungs",
                principalColumn: "MaND");

            migrationBuilder.AddForeignKey(
                name: "FK_PhieuDeXuatMuaSachs_Saches_SachMaSach",
                table: "PhieuDeXuatMuaSachs",
                column: "SachMaSach",
                principalTable: "Saches",
                principalColumn: "MaSach");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PhieuDeXuatMuaSachs_NguoiDungs_MaNguoiDeXuat",
                table: "PhieuDeXuatMuaSachs");

            migrationBuilder.DropForeignKey(
                name: "FK_PhieuDeXuatMuaSachs_NguoiDungs_MaNguoiDuyet",
                table: "PhieuDeXuatMuaSachs");

            migrationBuilder.DropForeignKey(
                name: "FK_PhieuDeXuatMuaSachs_Saches_SachMaSach",
                table: "PhieuDeXuatMuaSachs");

            migrationBuilder.DropTable(
                name: "ChiTietDeXuatMuaSachs");

            migrationBuilder.DropIndex(
                name: "IX_PhieuDeXuatMuaSachs_MaNguoiDuyet",
                table: "PhieuDeXuatMuaSachs");

            migrationBuilder.DropIndex(
                name: "IX_PhieuDeXuatMuaSachs_SachMaSach",
                table: "PhieuDeXuatMuaSachs");

            migrationBuilder.DropColumn(
                name: "ChiPhiDuKien",
                table: "PhieuDeXuatMuaSachs");

            migrationBuilder.DropColumn(
                name: "GhiChu",
                table: "PhieuDeXuatMuaSachs");

            migrationBuilder.DropColumn(
                name: "LyDoTuChoi",
                table: "PhieuDeXuatMuaSachs");

            migrationBuilder.DropColumn(
                name: "MaNguoiDuyet",
                table: "PhieuDeXuatMuaSachs");

            migrationBuilder.DropColumn(
                name: "MoTa",
                table: "PhieuDeXuatMuaSachs");

            migrationBuilder.DropColumn(
                name: "MucDoUuTien",
                table: "PhieuDeXuatMuaSachs");

            migrationBuilder.DropColumn(
                name: "NgayCapNhat",
                table: "PhieuDeXuatMuaSachs");

            migrationBuilder.DropColumn(
                name: "NgayDeXuat",
                table: "PhieuDeXuatMuaSachs");

            migrationBuilder.DropColumn(
                name: "NgayDuyet",
                table: "PhieuDeXuatMuaSachs");

            migrationBuilder.DropColumn(
                name: "NgayTao",
                table: "PhieuDeXuatMuaSachs");

            migrationBuilder.DropColumn(
                name: "TieuDe",
                table: "PhieuDeXuatMuaSachs");

            migrationBuilder.RenameColumn(
                name: "SachMaSach",
                table: "PhieuDeXuatMuaSachs",
                newName: "SoLuong");

            migrationBuilder.RenameColumn(
                name: "MaNguoiDeXuat",
                table: "PhieuDeXuatMuaSachs",
                newName: "MaSach");

            migrationBuilder.RenameIndex(
                name: "IX_PhieuDeXuatMuaSachs_MaNguoiDeXuat",
                table: "PhieuDeXuatMuaSachs",
                newName: "IX_PhieuDeXuatMuaSachs_MaSach");

            migrationBuilder.AlterColumn<string>(
                name: "TrangThai",
                table: "PhieuDeXuatMuaSachs",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AddColumn<string>(
                name: "LyDo",
                table: "PhieuDeXuatMuaSachs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_PhieuDeXuatMuaSachs_Saches_MaSach",
                table: "PhieuDeXuatMuaSachs",
                column: "MaSach",
                principalTable: "Saches",
                principalColumn: "MaSach",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
