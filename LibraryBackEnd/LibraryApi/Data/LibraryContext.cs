using LibraryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryApi.Data
{
    public class LibraryContext : DbContext
    {
        public LibraryContext(DbContextOptions<LibraryContext> options) : base(options) { }

        public DbSet<DocGia> DocGias { get; set; }
        public DbSet<TheThuVien> TheThuViens { get; set; }
        public DbSet<Sach> Saches { get; set; }
        public DbSet<PhieuMuon> PhieuMuons { get; set; }
        public DbSet<CT_PhieuMuon> CT_PhieuMuons { get; set; }
        public DbSet<PhieuTra> PhieuTras { get; set; }
        public DbSet<CT_PhieuTra> CT_PhieuTras { get; set; }
        public DbSet<PhieuPhat> PhieuPhats { get; set; }
        public DbSet<PhieuThu> PhieuThus { get; set; }
        public DbSet<PhieuGiaHan> PhieuGiaHans { get; set; }
        public DbSet<PhieuDatTruoc> PhieuDatTruocs { get; set; }
        public DbSet<PhieuNhapKho> PhieuNhapKhos { get; set; }
        public DbSet<CT_PhieuNhapKho> CT_PhieuNhapKhos { get; set; }
        public DbSet<PhieuKiemKe> PhieuKiemKes { get; set; }
        public DbSet<CT_KiemKe> CT_KiemKes { get; set; }
        public DbSet<NguoiDung> NguoiDungs { get; set; }
        public DbSet<PhieuCapQuyen> PhieuCapQuyens { get; set; }
        public DbSet<NhatKyHoatDong> NhatKyHoatDongs { get; set; }
        public DbSet<PhieuDeXuatMuaSach> PhieuDeXuatMuaSachs { get; set; }
        public DbSet<PhanHoiNCC> PhanHoiNCCs { get; set; }
        public DbSet<BaoCao> BaoCaos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Composite keys
            modelBuilder.Entity<CT_PhieuMuon>()
                .HasKey(x => new { x.MaPhieuMuon, x.MaSach });
            modelBuilder.Entity<CT_PhieuTra>()
                .HasKey(x => new { x.MaPhieuTra, x.MaSach });
            modelBuilder.Entity<CT_PhieuNhapKho>()
                .HasKey(x => new { x.MaPhieuNhap, x.MaSach });
            modelBuilder.Entity<CT_KiemKe>()
                .HasKey(x => new { x.MaPhieuKK, x.MaSach });

            // Foreign keys & navigation (ví dụ điển hình, có thể cần bổ sung thêm nếu phát sinh lỗi khi migration)
            modelBuilder.Entity<TheThuVien>()
                .HasOne(t => t.DocGia)
                .WithOne(dg => dg.TheThuVien)
                .HasForeignKey<TheThuVien>(t => t.MaDG);

            modelBuilder.Entity<PhieuMuon>()
                .HasOne(pm => pm.DocGia)
                .WithMany(dg => dg.PhieuMuons)
                .HasForeignKey(pm => pm.MaDG);

            modelBuilder.Entity<CT_PhieuMuon>()
                .HasOne(ct => ct.PhieuMuon)
                .WithMany(pm => pm.CT_PhieuMuons)
                .HasForeignKey(ct => ct.MaPhieuMuon);
            modelBuilder.Entity<CT_PhieuMuon>()
                .HasOne(ct => ct.Sach)
                .WithMany(s => s.CT_PhieuMuons)
                .HasForeignKey(ct => ct.MaSach);

            modelBuilder.Entity<PhieuTra>()
                .HasOne(pt => pt.DocGia)
                .WithMany(dg => dg.PhieuTras)
                .HasForeignKey(pt => pt.MaDG);
            modelBuilder.Entity<PhieuTra>()
                .HasOne(pt => pt.PhieuMuon)
                .WithMany(pm => pm.PhieuTras)
                .HasForeignKey(pt => pt.MaPhieuMuon)
                .OnDelete(DeleteBehavior.Restrict); // Thêm dòng này để tránh multiple cascade paths

            modelBuilder.Entity<CT_PhieuTra>()
                .HasOne(ct => ct.PhieuTra)
                .WithMany(pt => pt.CT_PhieuTras)
                .HasForeignKey(ct => ct.MaPhieuTra);
            modelBuilder.Entity<CT_PhieuTra>()
                .HasOne(ct => ct.Sach)
                .WithMany(s => s.CT_PhieuTras)
                .HasForeignKey(ct => ct.MaSach);

            modelBuilder.Entity<PhieuPhat>()
                .HasOne(pp => pp.DocGia)
                .WithMany(dg => dg.PhieuPhats)
                .HasForeignKey(pp => pp.MaDG);

            modelBuilder.Entity<PhieuThu>()
                .HasOne(pt => pt.DocGia)
                .WithMany(dg => dg.PhieuThus)
                .HasForeignKey(pt => pt.MaDG);

            modelBuilder.Entity<PhieuGiaHan>()
                .HasOne(pg => pg.PhieuMuon)
                .WithMany(pm => pm.PhieuGiaHans)
                .HasForeignKey(pg => pg.MaPhieuMuon);
            modelBuilder.Entity<PhieuGiaHan>()
                .HasOne(pg => pg.Sach)
                .WithMany(s => s.PhieuGiaHans)
                .HasForeignKey(pg => pg.MaSach);

            modelBuilder.Entity<PhieuDatTruoc>()
                .HasOne(pd => pd.DocGia)
                .WithMany(dg => dg.PhieuDatTruocs)
                .HasForeignKey(pd => pd.MaDG);
            modelBuilder.Entity<PhieuDatTruoc>()
                .HasOne(pd => pd.Sach)
                .WithMany(s => s.PhieuDatTruocs)
                .HasForeignKey(pd => pd.MaSach);

            modelBuilder.Entity<PhieuNhapKho>()
                .HasMany(pn => pn.CT_PhieuNhapKhos)
                .WithOne(ct => ct.PhieuNhapKho)
                .HasForeignKey(ct => ct.MaPhieuNhap);
            modelBuilder.Entity<CT_PhieuNhapKho>()
                .HasOne(ct => ct.Sach)
                .WithMany(s => s.CT_PhieuNhapKhos)
                .HasForeignKey(ct => ct.MaSach);

            modelBuilder.Entity<PhieuKiemKe>()
                .HasMany(pk => pk.CT_KiemKes)
                .WithOne(ct => ct.PhieuKiemKe)
                .HasForeignKey(ct => ct.MaPhieuKK);
            modelBuilder.Entity<CT_KiemKe>()
                .HasOne(ct => ct.Sach)
                .WithMany(s => s.CT_KiemKes)
                .HasForeignKey(ct => ct.MaSach);

            modelBuilder.Entity<PhieuCapQuyen>()
                .HasOne(pcq => pcq.NguoiDung)
                .WithMany(nd => nd.PhieuCapQuyens)
                .HasForeignKey(pcq => pcq.MaND);

            modelBuilder.Entity<NhatKyHoatDong>()
                .HasOne(nk => nk.NguoiDung)
                .WithMany(nd => nd.NhatKyHoatDongs)
                .HasForeignKey(nk => nk.MaND);

            modelBuilder.Entity<PhieuDeXuatMuaSach>()
                .HasOne(dx => dx.Sach)
                .WithMany(s => s.PhieuDeXuatMuaSachs)
                .HasForeignKey(dx => dx.MaSach);
        }
    }
}
