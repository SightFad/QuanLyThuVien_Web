using Microsoft.EntityFrameworkCore.Migrations;
using System;

namespace LibraryApi.Migrations
{
    public partial class UpdateBookModelFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add new columns to Sach table
            migrationBuilder.AddColumn<decimal>(
                name: "GiaTien",
                table: "Sach",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayTao",
                table: "Sach",
                type: "datetime2",
                nullable: false,
                defaultValue: DateTime.Now);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayCapNhat",
                table: "Sach",
                type: "datetime2",
                nullable: true);

            // Update existing records to set NgayTao to current date if null
            migrationBuilder.Sql("UPDATE Sach SET NgayTao = GETDATE() WHERE NgayTao IS NULL");

            // Copy existing GiaSach values to GiaTien for compatibility
            migrationBuilder.Sql("UPDATE Sach SET GiaTien = GiaSach WHERE GiaTien IS NULL AND GiaSach IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GiaTien",
                table: "Sach");

            migrationBuilder.DropColumn(
                name: "NgayTao",
                table: "Sach");

            migrationBuilder.DropColumn(
                name: "NgayCapNhat",
                table: "Sach");
        }
    }
}