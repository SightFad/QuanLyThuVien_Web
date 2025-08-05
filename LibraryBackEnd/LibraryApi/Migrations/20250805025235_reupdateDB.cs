using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LibraryApi.Migrations
{
    /// <inheritdoc />
    public partial class reupdateDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GiaTien",
                table: "Saches");

            migrationBuilder.DropColumn(
                name: "NamXuatBan",
                table: "Saches");

            migrationBuilder.AddColumn<int>(
                name: "PhieuTraMaPhieuTra",
                table: "CT_PhieuMuons",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_CT_PhieuMuons_PhieuTraMaPhieuTra",
                table: "CT_PhieuMuons",
                column: "PhieuTraMaPhieuTra");

            migrationBuilder.AddForeignKey(
                name: "FK_CT_PhieuMuons_PhieuTras_PhieuTraMaPhieuTra",
                table: "CT_PhieuMuons",
                column: "PhieuTraMaPhieuTra",
                principalTable: "PhieuTras",
                principalColumn: "MaPhieuTra",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CT_PhieuMuons_PhieuTras_PhieuTraMaPhieuTra",
                table: "CT_PhieuMuons");

            migrationBuilder.DropIndex(
                name: "IX_CT_PhieuMuons_PhieuTraMaPhieuTra",
                table: "CT_PhieuMuons");

            migrationBuilder.DropColumn(
                name: "PhieuTraMaPhieuTra",
                table: "CT_PhieuMuons");

            migrationBuilder.AddColumn<decimal>(
                name: "GiaTien",
                table: "Saches",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NamXuatBan",
                table: "Saches",
                type: "INTEGER",
                nullable: true);
        }
    }
}
