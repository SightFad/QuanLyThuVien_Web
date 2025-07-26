using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LibraryApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DocGiaId",
                table: "NguoiDungs",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MemberStatus",
                table: "DocGias",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MemberType",
                table: "DocGias",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayDangKy",
                table: "DocGias",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayHetHan",
                table: "DocGias",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DocGiaId",
                table: "NguoiDungs");

            migrationBuilder.DropColumn(
                name: "MemberStatus",
                table: "DocGias");

            migrationBuilder.DropColumn(
                name: "MemberType",
                table: "DocGias");

            migrationBuilder.DropColumn(
                name: "NgayDangKy",
                table: "DocGias");

            migrationBuilder.DropColumn(
                name: "NgayHetHan",
                table: "DocGias");
        }
    }
}
