using System;
using System.ComponentModel.DataAnnotations;

namespace LibraryApi.Models
{
    public class BaoCao
    {
        [Key]
        public int MaBaoCao { get; set; } // PRIMARY KEY
        public string LoaiBaoCao { get; set; }
        public DateTime? NgayLap { get; set; }
        public string NoiDung { get; set; }
        public byte[] FilePDF { get; set; }
    }
} 