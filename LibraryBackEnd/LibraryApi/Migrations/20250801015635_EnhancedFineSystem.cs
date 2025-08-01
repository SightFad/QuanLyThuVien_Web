using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LibraryApi.Migrations
{
    /// <inheritdoc />
    public partial class EnhancedFineSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CT_PhieuMuons_PhieuMuons_MaPhieuMuon",
                table: "CT_PhieuMuons");

            migrationBuilder.DropForeignKey(
                name: "FK_PhieuGiaHans_PhieuMuons_MaPhieuMuon",
                table: "PhieuGiaHans");

            migrationBuilder.DropForeignKey(
                name: "FK_PhieuMuons_DocGias_MaDG",
                table: "PhieuMuons");

            migrationBuilder.DropForeignKey(
                name: "FK_PhieuTras_PhieuMuons_MaPhieuMuon",
                table: "PhieuTras");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PhieuMuons",
                table: "PhieuMuons");

            migrationBuilder.RenameTable(
                name: "PhieuMuons",
                newName: "PhieuMuon");

            migrationBuilder.RenameColumn(
                name: "NgayMuonCu",
                table: "PhieuGiaHans",
                newName: "NgayDuyet");

            migrationBuilder.RenameColumn(
                name: "MemberType",
                table: "DocGias",
                newName: "TenDG");

            migrationBuilder.RenameColumn(
                name: "NgayTraDuKien",
                table: "PhieuMuon",
                newName: "NgayTra");

            migrationBuilder.RenameIndex(
                name: "IX_PhieuMuons_MaDG",
                table: "PhieuMuon",
                newName: "IX_PhieuMuon_MaDG");

            migrationBuilder.AddColumn<decimal>(
                name: "GiaSach",
                table: "Saches",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "SoTien",
                table: "PhieuThus",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "NgayThu",
                table: "PhieuThus",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "LoaiThu",
                table: "PhieuThus",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "BaoCaoViPhamId",
                table: "PhieuThus",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "GhiChu",
                table: "PhieuThus",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HinhThucThanhToan",
                table: "PhieuThus",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LoaiViPham",
                table: "PhieuThus",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "MaBaoCaoViPham",
                table: "PhieuThus",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MaGiaoDich",
                table: "PhieuThus",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "MaPhieuMuon",
                table: "PhieuThus",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaSach",
                table: "PhieuThus",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayCapNhat",
                table: "PhieuThus",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayTao",
                table: "PhieuThus",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "NguoiThu",
                table: "PhieuThus",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "PhieuMuonMaPhieuMuon",
                table: "PhieuThus",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SachMaSach",
                table: "PhieuThus",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SoNgayTre",
                table: "PhieuThus",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TenSach",
                table: "PhieuThus",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TrangThai",
                table: "PhieuThus",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<DateTime>(
                name: "NgayHetHanMoi",
                table: "PhieuGiaHans",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GhiChu",
                table: "PhieuGiaHans",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "LanGiaHan",
                table: "PhieuGiaHans",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "LyDoTuChoi",
                table: "PhieuGiaHans",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "MaDG",
                table: "PhieuGiaHans",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayCapNhat",
                table: "PhieuGiaHans",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayGiaHan",
                table: "PhieuGiaHans",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayHetHanCu",
                table: "PhieuGiaHans",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayTao",
                table: "PhieuGiaHans",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "NguoiDuyet",
                table: "PhieuGiaHans",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "SoNgayGiaHan",
                table: "PhieuGiaHans",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "TrangThai",
                table: "PhieuGiaHans",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CapBac",
                table: "DocGias",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LoaiDocGia",
                table: "DocGias",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LyDoKhoa",
                table: "DocGias",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayCapNhat",
                table: "DocGias",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayKhoa",
                table: "DocGias",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PhiThanhVien",
                table: "DocGias",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "SoLanGiaHanToiDa",
                table: "DocGias",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SoNgayGiaHan",
                table: "DocGias",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SoNgayKhoa",
                table: "DocGias",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SoNgayMuonToiDa",
                table: "DocGias",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SoSachToiDa",
                table: "DocGias",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<DateTime>(
                name: "NgayMuon",
                table: "PhieuMuon",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DocGiaMaDG",
                table: "PhieuMuon",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GhiChu",
                table: "PhieuMuon",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "HanTra",
                table: "PhieuMuon",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayCapNhat",
                table: "PhieuMuon",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayTao",
                table: "PhieuMuon",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "TrangThai",
                table: "PhieuMuon",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PhieuMuon",
                table: "PhieuMuon",
                column: "MaPhieuMuon");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuThus_BaoCaoViPhamId",
                table: "PhieuThus",
                column: "BaoCaoViPhamId");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuThus_PhieuMuonMaPhieuMuon",
                table: "PhieuThus",
                column: "PhieuMuonMaPhieuMuon");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuThus_SachMaSach",
                table: "PhieuThus",
                column: "SachMaSach");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuGiaHans_MaDG",
                table: "PhieuGiaHans",
                column: "MaDG");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuMuon_DocGiaMaDG",
                table: "PhieuMuon",
                column: "DocGiaMaDG");

            migrationBuilder.AddForeignKey(
                name: "FK_CT_PhieuMuons_PhieuMuon_MaPhieuMuon",
                table: "CT_PhieuMuons",
                column: "MaPhieuMuon",
                principalTable: "PhieuMuon",
                principalColumn: "MaPhieuMuon",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PhieuGiaHans_DocGias_MaDG",
                table: "PhieuGiaHans",
                column: "MaDG",
                principalTable: "DocGias",
                principalColumn: "MaDG",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PhieuGiaHans_PhieuMuon_MaPhieuMuon",
                table: "PhieuGiaHans",
                column: "MaPhieuMuon",
                principalTable: "PhieuMuon",
                principalColumn: "MaPhieuMuon",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PhieuMuon_DocGias_DocGiaMaDG",
                table: "PhieuMuon",
                column: "DocGiaMaDG",
                principalTable: "DocGias",
                principalColumn: "MaDG");

            migrationBuilder.AddForeignKey(
                name: "FK_PhieuMuon_DocGias_MaDG",
                table: "PhieuMuon",
                column: "MaDG",
                principalTable: "DocGias",
                principalColumn: "MaDG",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PhieuThus_BaoCaoViPhams_BaoCaoViPhamId",
                table: "PhieuThus",
                column: "BaoCaoViPhamId",
                principalTable: "BaoCaoViPhams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PhieuThus_PhieuMuon_PhieuMuonMaPhieuMuon",
                table: "PhieuThus",
                column: "PhieuMuonMaPhieuMuon",
                principalTable: "PhieuMuon",
                principalColumn: "MaPhieuMuon",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PhieuThus_Saches_SachMaSach",
                table: "PhieuThus",
                column: "SachMaSach",
                principalTable: "Saches",
                principalColumn: "MaSach",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PhieuTras_PhieuMuon_MaPhieuMuon",
                table: "PhieuTras",
                column: "MaPhieuMuon",
                principalTable: "PhieuMuon",
                principalColumn: "MaPhieuMuon",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CT_PhieuMuons_PhieuMuon_MaPhieuMuon",
                table: "CT_PhieuMuons");

            migrationBuilder.DropForeignKey(
                name: "FK_PhieuGiaHans_DocGias_MaDG",
                table: "PhieuGiaHans");

            migrationBuilder.DropForeignKey(
                name: "FK_PhieuGiaHans_PhieuMuon_MaPhieuMuon",
                table: "PhieuGiaHans");

            migrationBuilder.DropForeignKey(
                name: "FK_PhieuMuon_DocGias_DocGiaMaDG",
                table: "PhieuMuon");

            migrationBuilder.DropForeignKey(
                name: "FK_PhieuMuon_DocGias_MaDG",
                table: "PhieuMuon");

            migrationBuilder.DropForeignKey(
                name: "FK_PhieuThus_BaoCaoViPhams_BaoCaoViPhamId",
                table: "PhieuThus");

            migrationBuilder.DropForeignKey(
                name: "FK_PhieuThus_PhieuMuon_PhieuMuonMaPhieuMuon",
                table: "PhieuThus");

            migrationBuilder.DropForeignKey(
                name: "FK_PhieuThus_Saches_SachMaSach",
                table: "PhieuThus");

            migrationBuilder.DropForeignKey(
                name: "FK_PhieuTras_PhieuMuon_MaPhieuMuon",
                table: "PhieuTras");

            migrationBuilder.DropIndex(
                name: "IX_PhieuThus_BaoCaoViPhamId",
                table: "PhieuThus");

            migrationBuilder.DropIndex(
                name: "IX_PhieuThus_PhieuMuonMaPhieuMuon",
                table: "PhieuThus");

            migrationBuilder.DropIndex(
                name: "IX_PhieuThus_SachMaSach",
                table: "PhieuThus");

            migrationBuilder.DropIndex(
                name: "IX_PhieuGiaHans_MaDG",
                table: "PhieuGiaHans");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PhieuMuon",
                table: "PhieuMuon");

            migrationBuilder.DropIndex(
                name: "IX_PhieuMuon_DocGiaMaDG",
                table: "PhieuMuon");

            migrationBuilder.DropColumn(
                name: "GiaSach",
                table: "Saches");

            migrationBuilder.DropColumn(
                name: "BaoCaoViPhamId",
                table: "PhieuThus");

            migrationBuilder.DropColumn(
                name: "GhiChu",
                table: "PhieuThus");

            migrationBuilder.DropColumn(
                name: "HinhThucThanhToan",
                table: "PhieuThus");

            migrationBuilder.DropColumn(
                name: "LoaiViPham",
                table: "PhieuThus");

            migrationBuilder.DropColumn(
                name: "MaBaoCaoViPham",
                table: "PhieuThus");

            migrationBuilder.DropColumn(
                name: "MaGiaoDich",
                table: "PhieuThus");

            migrationBuilder.DropColumn(
                name: "MaPhieuMuon",
                table: "PhieuThus");

            migrationBuilder.DropColumn(
                name: "MaSach",
                table: "PhieuThus");

            migrationBuilder.DropColumn(
                name: "NgayCapNhat",
                table: "PhieuThus");

            migrationBuilder.DropColumn(
                name: "NgayTao",
                table: "PhieuThus");

            migrationBuilder.DropColumn(
                name: "NguoiThu",
                table: "PhieuThus");

            migrationBuilder.DropColumn(
                name: "PhieuMuonMaPhieuMuon",
                table: "PhieuThus");

            migrationBuilder.DropColumn(
                name: "SachMaSach",
                table: "PhieuThus");

            migrationBuilder.DropColumn(
                name: "SoNgayTre",
                table: "PhieuThus");

            migrationBuilder.DropColumn(
                name: "TenSach",
                table: "PhieuThus");

            migrationBuilder.DropColumn(
                name: "TrangThai",
                table: "PhieuThus");

            migrationBuilder.DropColumn(
                name: "GhiChu",
                table: "PhieuGiaHans");

            migrationBuilder.DropColumn(
                name: "LanGiaHan",
                table: "PhieuGiaHans");

            migrationBuilder.DropColumn(
                name: "LyDoTuChoi",
                table: "PhieuGiaHans");

            migrationBuilder.DropColumn(
                name: "MaDG",
                table: "PhieuGiaHans");

            migrationBuilder.DropColumn(
                name: "NgayCapNhat",
                table: "PhieuGiaHans");

            migrationBuilder.DropColumn(
                name: "NgayGiaHan",
                table: "PhieuGiaHans");

            migrationBuilder.DropColumn(
                name: "NgayHetHanCu",
                table: "PhieuGiaHans");

            migrationBuilder.DropColumn(
                name: "NgayTao",
                table: "PhieuGiaHans");

            migrationBuilder.DropColumn(
                name: "NguoiDuyet",
                table: "PhieuGiaHans");

            migrationBuilder.DropColumn(
                name: "SoNgayGiaHan",
                table: "PhieuGiaHans");

            migrationBuilder.DropColumn(
                name: "TrangThai",
                table: "PhieuGiaHans");

            migrationBuilder.DropColumn(
                name: "CapBac",
                table: "DocGias");

            migrationBuilder.DropColumn(
                name: "LoaiDocGia",
                table: "DocGias");

            migrationBuilder.DropColumn(
                name: "LyDoKhoa",
                table: "DocGias");

            migrationBuilder.DropColumn(
                name: "NgayCapNhat",
                table: "DocGias");

            migrationBuilder.DropColumn(
                name: "NgayKhoa",
                table: "DocGias");

            migrationBuilder.DropColumn(
                name: "PhiThanhVien",
                table: "DocGias");

            migrationBuilder.DropColumn(
                name: "SoLanGiaHanToiDa",
                table: "DocGias");

            migrationBuilder.DropColumn(
                name: "SoNgayGiaHan",
                table: "DocGias");

            migrationBuilder.DropColumn(
                name: "SoNgayKhoa",
                table: "DocGias");

            migrationBuilder.DropColumn(
                name: "SoNgayMuonToiDa",
                table: "DocGias");

            migrationBuilder.DropColumn(
                name: "SoSachToiDa",
                table: "DocGias");

            migrationBuilder.DropColumn(
                name: "DocGiaMaDG",
                table: "PhieuMuon");

            migrationBuilder.DropColumn(
                name: "GhiChu",
                table: "PhieuMuon");

            migrationBuilder.DropColumn(
                name: "HanTra",
                table: "PhieuMuon");

            migrationBuilder.DropColumn(
                name: "NgayCapNhat",
                table: "PhieuMuon");

            migrationBuilder.DropColumn(
                name: "NgayTao",
                table: "PhieuMuon");

            migrationBuilder.DropColumn(
                name: "TrangThai",
                table: "PhieuMuon");

            migrationBuilder.RenameTable(
                name: "PhieuMuon",
                newName: "PhieuMuons");

            migrationBuilder.RenameColumn(
                name: "NgayDuyet",
                table: "PhieuGiaHans",
                newName: "NgayMuonCu");

            migrationBuilder.RenameColumn(
                name: "TenDG",
                table: "DocGias",
                newName: "MemberType");

            migrationBuilder.RenameColumn(
                name: "NgayTra",
                table: "PhieuMuons",
                newName: "NgayTraDuKien");

            migrationBuilder.RenameIndex(
                name: "IX_PhieuMuon_MaDG",
                table: "PhieuMuons",
                newName: "IX_PhieuMuons_MaDG");

            migrationBuilder.AlterColumn<decimal>(
                name: "SoTien",
                table: "PhieuThus",
                type: "decimal(18,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "NgayThu",
                table: "PhieuThus",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<string>(
                name: "LoaiThu",
                table: "PhieuThus",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AlterColumn<DateTime>(
                name: "NgayHetHanMoi",
                table: "PhieuGiaHans",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "NgayMuon",
                table: "PhieuMuons",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PhieuMuons",
                table: "PhieuMuons",
                column: "MaPhieuMuon");

            migrationBuilder.AddForeignKey(
                name: "FK_CT_PhieuMuons_PhieuMuons_MaPhieuMuon",
                table: "CT_PhieuMuons",
                column: "MaPhieuMuon",
                principalTable: "PhieuMuons",
                principalColumn: "MaPhieuMuon",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PhieuGiaHans_PhieuMuons_MaPhieuMuon",
                table: "PhieuGiaHans",
                column: "MaPhieuMuon",
                principalTable: "PhieuMuons",
                principalColumn: "MaPhieuMuon",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PhieuMuons_DocGias_MaDG",
                table: "PhieuMuons",
                column: "MaDG",
                principalTable: "DocGias",
                principalColumn: "MaDG",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PhieuTras_PhieuMuons_MaPhieuMuon",
                table: "PhieuTras",
                column: "MaPhieuMuon",
                principalTable: "PhieuMuons",
                principalColumn: "MaPhieuMuon",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
