using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LibraryApi.Migrations
{
    /// <inheritdoc />
    public partial class InitNewDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BaoCaos",
                columns: table => new
                {
                    MaBaoCao = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LoaiBaoCao = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NgayLap = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NoiDung = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FilePDF = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BaoCaos", x => x.MaBaoCao);
                });

            migrationBuilder.CreateTable(
                name: "DocGias",
                columns: table => new
                {
                    MaDG = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HoTen = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NgaySinh = table.Column<DateTime>(type: "datetime2", nullable: true),
                    GioiTinh = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DiaChi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SDT = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocGias", x => x.MaDG);
                });

            migrationBuilder.CreateTable(
                name: "NguoiDungs",
                columns: table => new
                {
                    MaND = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenDangNhap = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MatKhau = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ChucVu = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NguoiDungs", x => x.MaND);
                });

            migrationBuilder.CreateTable(
                name: "PhanHoiNCCs",
                columns: table => new
                {
                    MaPhieu = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NhaCungCap = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NgayNhan = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PhanHoi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NgayGiaoDuKien = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhanHoiNCCs", x => x.MaPhieu);
                });

            migrationBuilder.CreateTable(
                name: "PhieuKiemKes",
                columns: table => new
                {
                    MaPhieuKK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NgayKK = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NguoiKK = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuKiemKes", x => x.MaPhieuKK);
                });

            migrationBuilder.CreateTable(
                name: "PhieuNhapKhos",
                columns: table => new
                {
                    MaPhieuNhap = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NhaCungCap = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NgayNhap = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuNhapKhos", x => x.MaPhieuNhap);
                });

            migrationBuilder.CreateTable(
                name: "Saches",
                columns: table => new
                {
                    MaSach = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenSach = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TacGia = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TheLoai = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NamXB = table.Column<int>(type: "int", nullable: true),
                    ISBN = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SoLuong = table.Column<int>(type: "int", nullable: true),
                    TrangThai = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Saches", x => x.MaSach);
                });

            migrationBuilder.CreateTable(
                name: "PhieuMuons",
                columns: table => new
                {
                    MaPhieuMuon = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaDG = table.Column<int>(type: "int", nullable: false),
                    NgayMuon = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NgayTraDuKien = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NguoiLap = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuMuons", x => x.MaPhieuMuon);
                    table.ForeignKey(
                        name: "FK_PhieuMuons_DocGias_MaDG",
                        column: x => x.MaDG,
                        principalTable: "DocGias",
                        principalColumn: "MaDG",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PhieuPhats",
                columns: table => new
                {
                    MaPhieuPhat = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaDG = table.Column<int>(type: "int", nullable: false),
                    LoaiPhat = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SoTien = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    NgayLap = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuPhats", x => x.MaPhieuPhat);
                    table.ForeignKey(
                        name: "FK_PhieuPhats_DocGias_MaDG",
                        column: x => x.MaDG,
                        principalTable: "DocGias",
                        principalColumn: "MaDG",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PhieuThus",
                columns: table => new
                {
                    MaPhieuThu = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaDG = table.Column<int>(type: "int", nullable: false),
                    LoaiThu = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SoTien = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    NgayThu = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuThus", x => x.MaPhieuThu);
                    table.ForeignKey(
                        name: "FK_PhieuThus_DocGias_MaDG",
                        column: x => x.MaDG,
                        principalTable: "DocGias",
                        principalColumn: "MaDG",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TheThuViens",
                columns: table => new
                {
                    MaThe = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaDG = table.Column<int>(type: "int", nullable: false),
                    LoaiThe = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NgayDK = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NgayHetHan = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TrangThai = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TheThuViens", x => x.MaThe);
                    table.ForeignKey(
                        name: "FK_TheThuViens_DocGias_MaDG",
                        column: x => x.MaDG,
                        principalTable: "DocGias",
                        principalColumn: "MaDG",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NhatKyHoatDongs",
                columns: table => new
                {
                    MaNK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaND = table.Column<int>(type: "int", nullable: false),
                    ThoiGian = table.Column<DateTime>(type: "datetime2", nullable: true),
                    HanhDong = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NhatKyHoatDongs", x => x.MaNK);
                    table.ForeignKey(
                        name: "FK_NhatKyHoatDongs_NguoiDungs_MaND",
                        column: x => x.MaND,
                        principalTable: "NguoiDungs",
                        principalColumn: "MaND",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PhieuCapQuyens",
                columns: table => new
                {
                    MaPhieuQuyen = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaND = table.Column<int>(type: "int", nullable: false),
                    QuyenDuocCap = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ThoiHan = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuCapQuyens", x => x.MaPhieuQuyen);
                    table.ForeignKey(
                        name: "FK_PhieuCapQuyens_NguoiDungs_MaND",
                        column: x => x.MaND,
                        principalTable: "NguoiDungs",
                        principalColumn: "MaND",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CT_KiemKes",
                columns: table => new
                {
                    MaPhieuKK = table.Column<int>(type: "int", nullable: false),
                    MaSach = table.Column<int>(type: "int", nullable: false),
                    SL_HeThong = table.Column<int>(type: "int", nullable: true),
                    SL_ThucTe = table.Column<int>(type: "int", nullable: true),
                    ChenhLech = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CT_KiemKes", x => new { x.MaPhieuKK, x.MaSach });
                    table.ForeignKey(
                        name: "FK_CT_KiemKes_PhieuKiemKes_MaPhieuKK",
                        column: x => x.MaPhieuKK,
                        principalTable: "PhieuKiemKes",
                        principalColumn: "MaPhieuKK",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CT_KiemKes_Saches_MaSach",
                        column: x => x.MaSach,
                        principalTable: "Saches",
                        principalColumn: "MaSach",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CT_PhieuNhapKhos",
                columns: table => new
                {
                    MaPhieuNhap = table.Column<int>(type: "int", nullable: false),
                    MaSach = table.Column<int>(type: "int", nullable: false),
                    SoLuong = table.Column<int>(type: "int", nullable: true),
                    DonGia = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
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

            migrationBuilder.CreateTable(
                name: "PhieuDatTruocs",
                columns: table => new
                {
                    MaPhieuDat = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaDG = table.Column<int>(type: "int", nullable: false),
                    MaSach = table.Column<int>(type: "int", nullable: false),
                    NgayDat = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TrangThai = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuDatTruocs", x => x.MaPhieuDat);
                    table.ForeignKey(
                        name: "FK_PhieuDatTruocs_DocGias_MaDG",
                        column: x => x.MaDG,
                        principalTable: "DocGias",
                        principalColumn: "MaDG",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PhieuDatTruocs_Saches_MaSach",
                        column: x => x.MaSach,
                        principalTable: "Saches",
                        principalColumn: "MaSach",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PhieuDeXuatMuaSachs",
                columns: table => new
                {
                    MaDeXuat = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaSach = table.Column<int>(type: "int", nullable: false),
                    SoLuong = table.Column<int>(type: "int", nullable: true),
                    LyDo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TrangThai = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuDeXuatMuaSachs", x => x.MaDeXuat);
                    table.ForeignKey(
                        name: "FK_PhieuDeXuatMuaSachs_Saches_MaSach",
                        column: x => x.MaSach,
                        principalTable: "Saches",
                        principalColumn: "MaSach",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CT_PhieuMuons",
                columns: table => new
                {
                    MaPhieuMuon = table.Column<int>(type: "int", nullable: false),
                    MaSach = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CT_PhieuMuons", x => new { x.MaPhieuMuon, x.MaSach });
                    table.ForeignKey(
                        name: "FK_CT_PhieuMuons_PhieuMuons_MaPhieuMuon",
                        column: x => x.MaPhieuMuon,
                        principalTable: "PhieuMuons",
                        principalColumn: "MaPhieuMuon",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CT_PhieuMuons_Saches_MaSach",
                        column: x => x.MaSach,
                        principalTable: "Saches",
                        principalColumn: "MaSach",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PhieuGiaHans",
                columns: table => new
                {
                    MaGiaHan = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaPhieuMuon = table.Column<int>(type: "int", nullable: false),
                    MaSach = table.Column<int>(type: "int", nullable: false),
                    NgayMuonCu = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NgayHetHanMoi = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuGiaHans", x => x.MaGiaHan);
                    table.ForeignKey(
                        name: "FK_PhieuGiaHans_PhieuMuons_MaPhieuMuon",
                        column: x => x.MaPhieuMuon,
                        principalTable: "PhieuMuons",
                        principalColumn: "MaPhieuMuon",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PhieuGiaHans_Saches_MaSach",
                        column: x => x.MaSach,
                        principalTable: "Saches",
                        principalColumn: "MaSach",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PhieuTras",
                columns: table => new
                {
                    MaPhieuTra = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaDG = table.Column<int>(type: "int", nullable: false),
                    NgayTra = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NguoiLap = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MaPhieuMuon = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuTras", x => x.MaPhieuTra);
                    table.ForeignKey(
                        name: "FK_PhieuTras_DocGias_MaDG",
                        column: x => x.MaDG,
                        principalTable: "DocGias",
                        principalColumn: "MaDG",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PhieuTras_PhieuMuons_MaPhieuMuon",
                        column: x => x.MaPhieuMuon,
                        principalTable: "PhieuMuons",
                        principalColumn: "MaPhieuMuon",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CT_PhieuTras",
                columns: table => new
                {
                    MaPhieuTra = table.Column<int>(type: "int", nullable: false),
                    MaSach = table.Column<int>(type: "int", nullable: false),
                    SoNgayMuon = table.Column<int>(type: "int", nullable: true),
                    TienPhat = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    TinhTrang = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NgayTraThucTe = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CT_PhieuTras", x => new { x.MaPhieuTra, x.MaSach });
                    table.ForeignKey(
                        name: "FK_CT_PhieuTras_PhieuTras_MaPhieuTra",
                        column: x => x.MaPhieuTra,
                        principalTable: "PhieuTras",
                        principalColumn: "MaPhieuTra",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CT_PhieuTras_Saches_MaSach",
                        column: x => x.MaSach,
                        principalTable: "Saches",
                        principalColumn: "MaSach",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CT_KiemKes_MaSach",
                table: "CT_KiemKes",
                column: "MaSach");

            migrationBuilder.CreateIndex(
                name: "IX_CT_PhieuMuons_MaSach",
                table: "CT_PhieuMuons",
                column: "MaSach");

            migrationBuilder.CreateIndex(
                name: "IX_CT_PhieuNhapKhos_MaSach",
                table: "CT_PhieuNhapKhos",
                column: "MaSach");

            migrationBuilder.CreateIndex(
                name: "IX_CT_PhieuTras_MaSach",
                table: "CT_PhieuTras",
                column: "MaSach");

            migrationBuilder.CreateIndex(
                name: "IX_NhatKyHoatDongs_MaND",
                table: "NhatKyHoatDongs",
                column: "MaND");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuCapQuyens_MaND",
                table: "PhieuCapQuyens",
                column: "MaND");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuDatTruocs_MaDG",
                table: "PhieuDatTruocs",
                column: "MaDG");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuDatTruocs_MaSach",
                table: "PhieuDatTruocs",
                column: "MaSach");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuDeXuatMuaSachs_MaSach",
                table: "PhieuDeXuatMuaSachs",
                column: "MaSach");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuGiaHans_MaPhieuMuon",
                table: "PhieuGiaHans",
                column: "MaPhieuMuon");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuGiaHans_MaSach",
                table: "PhieuGiaHans",
                column: "MaSach");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuMuons_MaDG",
                table: "PhieuMuons",
                column: "MaDG");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuPhats_MaDG",
                table: "PhieuPhats",
                column: "MaDG");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuThus_MaDG",
                table: "PhieuThus",
                column: "MaDG");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuTras_MaDG",
                table: "PhieuTras",
                column: "MaDG");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuTras_MaPhieuMuon",
                table: "PhieuTras",
                column: "MaPhieuMuon");

            migrationBuilder.CreateIndex(
                name: "IX_TheThuViens_MaDG",
                table: "TheThuViens",
                column: "MaDG",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BaoCaos");

            migrationBuilder.DropTable(
                name: "CT_KiemKes");

            migrationBuilder.DropTable(
                name: "CT_PhieuMuons");

            migrationBuilder.DropTable(
                name: "CT_PhieuNhapKhos");

            migrationBuilder.DropTable(
                name: "CT_PhieuTras");

            migrationBuilder.DropTable(
                name: "NhatKyHoatDongs");

            migrationBuilder.DropTable(
                name: "PhanHoiNCCs");

            migrationBuilder.DropTable(
                name: "PhieuCapQuyens");

            migrationBuilder.DropTable(
                name: "PhieuDatTruocs");

            migrationBuilder.DropTable(
                name: "PhieuDeXuatMuaSachs");

            migrationBuilder.DropTable(
                name: "PhieuGiaHans");

            migrationBuilder.DropTable(
                name: "PhieuPhats");

            migrationBuilder.DropTable(
                name: "PhieuThus");

            migrationBuilder.DropTable(
                name: "TheThuViens");

            migrationBuilder.DropTable(
                name: "PhieuKiemKes");

            migrationBuilder.DropTable(
                name: "PhieuNhapKhos");

            migrationBuilder.DropTable(
                name: "PhieuTras");

            migrationBuilder.DropTable(
                name: "NguoiDungs");

            migrationBuilder.DropTable(
                name: "Saches");

            migrationBuilder.DropTable(
                name: "PhieuMuons");

            migrationBuilder.DropTable(
                name: "DocGias");
        }
    }
}
