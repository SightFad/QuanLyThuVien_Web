// Mock Data cho Hệ thống Quản lý Thư viện

// Mock Members (Thành viên)
export const mockMembers = [
  {
    id: 1,
    memberId: "TV001",
    name: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    phone: "0901234567",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    membershipDate: "2024-01-15",
    status: "active"
  },
  {
    id: 2,
    memberId: "TV002",
    name: "Trần Thị Bình",
    email: "tranthibinh@email.com",
    phone: "0901234568",
    address: "456 Đường XYZ, Quận 2, TP.HCM",
    membershipDate: "2024-02-20",
    status: "active"
  },
  {
    id: 3,
    memberId: "TV003",
    name: "Lê Văn Cường",
    email: "levancuong@email.com",
    phone: "0901234569",
    address: "789 Đường DEF, Quận 3, TP.HCM",
    membershipDate: "2024-03-10",
    status: "active"
  },
  {
    id: 4,
    memberId: "TV004",
    name: "Phạm Thị Dung",
    email: "phamthidung@email.com",
    phone: "0901234570",
    address: "321 Đường GHI, Quận 4, TP.HCM",
    membershipDate: "2024-04-05",
    status: "active"
  },
  {
    id: 5,
    memberId: "TV005",
    name: "Hoàng Văn Em",
    email: "hoangvanem@email.com",
    phone: "0901234571",
    address: "654 Đường JKL, Quận 5, TP.HCM",
    membershipDate: "2024-05-12",
    status: "active"
  }
];

// Mock Books (Sách)
export const mockBooks = [
  {
    id: 1,
    bookId: "S001",
    title: "Đắc Nhân Tâm",
    author: "Dale Carnegie",
    category: "Kỹ năng sống",
    publisher: "NXB Tổng hợp TP.HCM",
    publishYear: 2020,
    isbn: "978-604-323-456-7",
    quantity: 5,
    availableQuantity: 3,
    location: "Kệ A1",
    price: 85000,
    coverImage: "/images/book-covers/dac-nhan-tam.jpg"
  },
  {
    id: 2,
    bookId: "S002",
    title: "Nhà Giả Kim",
    author: "Paulo Coelho",
    category: "Tiểu thuyết",
    publisher: "NXB Văn học",
    publishYear: 2019,
    isbn: "978-604-323-457-4",
    quantity: 3,
    availableQuantity: 2,
    location: "Kệ A2",
    price: 75000,
    coverImage: "/images/book-covers/nha-gia-kim.jpg"
  },
  {
    id: 3,
    bookId: "S003",
    title: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
    author: "Rosie Nguyễn",
    category: "Du lịch",
    publisher: "NXB Hội nhà văn",
    publishYear: 2021,
    isbn: "978-604-323-458-1",
    quantity: 4,
    availableQuantity: 4,
    location: "Kệ B1",
    price: 95000,
    coverImage: "/images/book-covers/tuoi-tre-dang-gia-bao-nhieu.jpg"
  },
  {
    id: 4,
    bookId: "S004",
    title: "Cách Nghĩ Để Thành Công",
    author: "Napoleon Hill",
    category: "Kinh doanh",
    publisher: "NXB Lao động",
    publishYear: 2018,
    isbn: "978-604-323-459-8",
    quantity: 6,
    availableQuantity: 5,
    location: "Kệ B2",
    price: 120000,
    coverImage: "/images/book-covers/cach-nghi-de-thanh-cong.jpg"
  },
  {
    id: 5,
    bookId: "S005",
    title: "7 Thói Quen Hiệu Quả",
    author: "Stephen R. Covey",
    category: "Kỹ năng sống",
    publisher: "NXB Tổng hợp TP.HCM",
    publishYear: 2022,
    isbn: "978-604-323-460-4",
    quantity: 4,
    availableQuantity: 2,
    location: "Kệ A3",
    price: 110000,
    coverImage: "/images/book-covers/7-thoi-quen-hieu-qua.jpg"
  },
  {
    id: 6,
    bookId: "S006",
    title: "Nghĩ Giàu Làm Giàu",
    author: "Napoleon Hill",
    category: "Kinh doanh",
    publisher: "NXB Lao động",
    publishYear: 2020,
    isbn: "978-604-323-461-1",
    quantity: 3,
    availableQuantity: 1,
    location: "Kệ B3",
    price: 88000,
    coverImage: "/images/book-covers/nghi-giau-lam-giau.jpg"
  },
  {
    id: 7,
    bookId: "S007",
    title: "Đọc Vị Bất Kỳ Ai",
    author: "David J. Lieberman",
    category: "Tâm lý học",
    publisher: "NXB Lao động",
    publishYear: 2021,
    isbn: "978-604-323-462-8",
    quantity: 5,
    availableQuantity: 3,
    location: "Kệ C1",
    price: 92000,
    coverImage: "/images/book-covers/doc-vi-bat-ky-ai.jpg"
  },
  {
    id: 8,
    bookId: "S008",
    title: "Sức Mạnh Của Thói Quen",
    author: "Charles Duhigg",
    category: "Kỹ năng sống",
    publisher: "NXB Lao động",
    publishYear: 2019,
    isbn: "978-604-323-463-5",
    quantity: 4,
    availableQuantity: 2,
    location: "Kệ C2",
    price: 105000,
    coverImage: "/images/book-covers/suc-manh-cua-thoi-quen.jpg"
  }
];

// Mock Borrow Slips (Phiếu mượn)
export const mockBorrowSlips = [
  {
    id: 1,
    borrowId: "PM001",
    memberId: "TV001",
    memberName: "Nguyễn Văn An",
    borrowDate: "2025-07-01",
    dueDate: "2025-08-01",
    status: "borrowed",
    books: [
      {
        bookId: "S001",
        bookTitle: "Đắc Nhân Tâm",
        category: "Kỹ năng sống",
        author: "Dale Carnegie"
      },
      {
        bookId: "S005",
        bookTitle: "7 Thói Quen Hiệu Quả",
        category: "Kỹ năng sống",
        author: "Stephen R. Covey"
      }
    ]
  },
  {
    id: 2,
    borrowId: "PM002",
    memberId: "TV002",
    memberName: "Trần Thị Bình",
    borrowDate: "2025-07-05",
    dueDate: "2025-08-05",
    status: "borrowed",
    books: [
      {
        bookId: "S002",
        bookTitle: "Nhà Giả Kim",
        category: "Tiểu thuyết",
        author: "Paulo Coelho"
      }
    ]
  },
  {
    id: 3,
    borrowId: "PM003",
    memberId: "TV003",
    memberName: "Lê Văn Cường",
    borrowDate: "2025-07-10",
    dueDate: "2025-08-10",
    status: "borrowed",
    books: [
      {
        bookId: "S003",
        bookTitle: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
        category: "Du lịch",
        author: "Rosie Nguyễn"
      },
      {
        bookId: "S007",
        bookTitle: "Đọc Vị Bất Kỳ Ai",
        category: "Tâm lý học",
        author: "David J. Lieberman"
      }
    ]
  },
  {
    id: 4,
    borrowId: "PM004",
    memberId: "TV004",
    memberName: "Phạm Thị Dung",
    borrowDate: "2025-06-15",
    dueDate: "2025-07-15",
    status: "overdue",
    books: [
      {
        bookId: "S004",
        bookTitle: "Cách Nghĩ Để Thành Công",
        category: "Kinh doanh",
        author: "Napoleon Hill"
      }
    ]
  },
  {
    id: 5,
    borrowId: "PM005",
    memberId: "TV005",
    memberName: "Hoàng Văn Em",
    borrowDate: "2025-06-20",
    dueDate: "2025-07-20",
    status: "overdue",
    books: [
      {
        bookId: "S006",
        bookTitle: "Nghĩ Giàu Làm Giàu",
        category: "Kinh doanh",
        author: "Napoleon Hill"
      },
      {
        bookId: "S008",
        bookTitle: "Sức Mạnh Của Thói Quen",
        category: "Kỹ năng sống",
        author: "Charles Duhigg"
      }
    ]
  }
];

// Mock Return Slips (Phiếu trả)
export const mockReturnSlips = [
  {
    id: 1,
    returnId: "PT001",
    memberId: "TV001",
    memberName: "Nguyễn Văn An",
    returnDate: "2025-07-31",
    totalFine: 50000,
    totalDebt: 50000,
    paymentMethod: "cash",
    transactionCode: "",
    status: "completed",
    books: [
      {
        bookId: "S001",
        bookTitle: "Đắc Nhân Tâm",
        borrowDate: "2025-07-01",
        borrowedDays: 30,
        fine: 50000
      },
      {
        bookId: "S005",
        bookTitle: "7 Thói Quen Hiệu Quả",
        borrowDate: "2025-07-01",
        borrowedDays: 30,
        fine: 0
      }
    ]
  },
  {
    id: 2,
    returnId: "PT002",
    memberId: "TV002",
    memberName: "Trần Thị Bình",
    returnDate: "2025-07-30",
    totalFine: 0,
    totalDebt: 0,
    paymentMethod: "cash",
    transactionCode: "",
    status: "completed",
    books: [
      {
        bookId: "S002",
        bookTitle: "Nhà Giả Kim",
        borrowDate: "2025-07-05",
        borrowedDays: 25,
        fine: 0
      }
    ]
  },
  {
    id: 3,
    returnId: "PT003",
    memberId: "TV004",
    memberName: "Phạm Thị Dung",
    returnDate: "2025-07-25",
    totalFine: 150000,
    totalDebt: 150000,
    paymentMethod: "bank",
    transactionCode: "TX123456789",
    status: "completed",
    books: [
      {
        bookId: "S004",
        bookTitle: "Cách Nghĩ Để Thành Công",
        borrowDate: "2025-06-15",
        borrowedDays: 40,
        fine: 150000
      }
    ]
  },
  {
    id: 4,
    returnId: "PT004",
    memberId: "TV005",
    memberName: "Hoàng Văn Em",
    returnDate: "2025-07-28",
    totalFine: 200000,
    totalDebt: 200000,
    paymentMethod: "cash",
    transactionCode: "",
    status: "pending",
    books: [
      {
        bookId: "S006",
        bookTitle: "Nghĩ Giàu Làm Giàu",
        borrowDate: "2025-06-20",
        borrowedDays: 38,
        fine: 120000
      },
      {
        bookId: "S008",
        bookTitle: "Sức Mạnh Của Thói Quen",
        borrowDate: "2025-06-20",
        borrowedDays: 38,
        fine: 80000
      }
    ]
  }
];

// Mock Borrowed Books (Sách đang được mượn)
export const mockBorrowedBooks = [
  {
    id: 1,
    bookId: "S001",
    bookTitle: "Đắc Nhân Tâm",
    memberId: "TV001",
    memberName: "Nguyễn Văn An",
    borrowDate: "2025-07-01",
    dueDate: "2025-08-01",
    borrowedDays: 30,
    fine: 50000,
    status: "borrowed"
  },
  {
    id: 2,
    bookId: "S002",
    bookTitle: "Nhà Giả Kim",
    memberId: "TV002",
    memberName: "Trần Thị Bình",
    borrowDate: "2025-07-05",
    dueDate: "2025-08-05",
    borrowedDays: 25,
    fine: 0,
    status: "borrowed"
  },
  {
    id: 3,
    bookId: "S003",
    bookTitle: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
    memberId: "TV003",
    memberName: "Lê Văn Cường",
    borrowDate: "2025-07-10",
    dueDate: "2025-08-10",
    borrowedDays: 20,
    fine: 0,
    status: "borrowed"
  },
  {
    id: 4,
    bookId: "S004",
    bookTitle: "Cách Nghĩ Để Thành Công",
    memberId: "TV004",
    memberName: "Phạm Thị Dung",
    borrowDate: "2025-06-15",
    dueDate: "2025-07-15",
    borrowedDays: 40,
    fine: 150000,
    status: "overdue"
  },
  {
    id: 5,
    bookId: "S006",
    bookTitle: "Nghĩ Giàu Làm Giàu",
    memberId: "TV005",
    memberName: "Hoàng Văn Em",
    borrowDate: "2025-06-20",
    dueDate: "2025-07-20",
    borrowedDays: 38,
    fine: 120000,
    status: "overdue"
  },
  {
    id: 6,
    bookId: "S008",
    bookTitle: "Sức Mạnh Của Thói Quen",
    memberId: "TV005",
    memberName: "Hoàng Văn Em",
    borrowDate: "2025-06-20",
    dueDate: "2025-07-20",
    borrowedDays: 38,
    fine: 80000,
    status: "overdue"
  }
];

// Helper functions
export const calculateFine = (borrowDate, dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const daysLate = Math.max(0, Math.ceil((today - due) / (1000 * 60 * 60 * 24)));
  return daysLate * 5000; // 5000 VND per day
};

export const getBorrowedDays = (borrowDate) => {
  const today = new Date();
  const borrow = new Date(borrowDate);
  return Math.ceil((today - borrow) / (1000 * 60 * 60 * 24));
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};

// Mock data cho phiếu mượn sách (định dạng API) - Mỗi phiếu có thể chứa nhiều sách
export const mockBorrowData = [
  // Phiếu mượn 1: Nguyễn Văn A - 1 sách
  {
    id: 1,
    idDocGia: "TV001",
    tenDocGia: "Nguyễn Văn A",
    idSach: "S001",
    tenSach: "Cơ sở dữ liệu",
    ngayMuon: "2024-01-15",
    hanTra: "2024-02-15",
    ngayTra: null,
    trangThai: "borrowed",
    ghiChu: "Sách mượn cho dự án nghiên cứu",
    renewalCount: 0
  },
  
  // Phiếu mượn 2: Trần Thị B - 2 sách
  {
    id: 2,
    idDocGia: "TV002",
    tenDocGia: "Trần Thị B", 
    idSach: "S002",
    tenSach: "Lập trình Java",
    ngayMuon: "2024-01-10",
    hanTra: "2024-02-10",
    ngayTra: null,
    trangThai: "renewed",
    ghiChu: "Học tập môn lập trình",
    renewalCount: 1
  },
  {
    id: 3,
    idDocGia: "TV002",
    tenDocGia: "Trần Thị B", 
    idSach: "S005",
    tenSach: "7 Thói Quen Hiệu Quả",
    ngayMuon: "2024-01-10",
    hanTra: "2024-02-10",
    ngayTra: null,
    trangThai: "renewed",
    ghiChu: "Học tập kỹ năng sống",
    renewalCount: 1
  },
  
  // Phiếu mượn 3: Phạm Văn C - 3 sách
  {
    id: 4,
    idDocGia: "TV003",
    tenDocGia: "Phạm Văn C",
    idSach: "S003", 
    tenSach: "Toán học cao cấp",
    ngayMuon: "2024-01-20",
    hanTra: "2024-02-20",
    ngayTra: null,
    trangThai: "borrowed",
    ghiChu: "Nghiên cứu toán học",
    renewalCount: 0
  },
  {
    id: 5,
    idDocGia: "TV003",
    tenDocGia: "Phạm Văn C",
    idSach: "S007", 
    tenSach: "Đọc Vị Bất Kỳ Ai",
    ngayMuon: "2024-01-20",
    hanTra: "2024-02-20",
    ngayTra: null,
    trangThai: "borrowed",
    ghiChu: "Học tâm lý học",
    renewalCount: 0
  },
  {
    id: 6,
    idDocGia: "TV003",
    tenDocGia: "Phạm Văn C",
    idSach: "S008", 
    tenSach: "Sức Mạnh Của Thói Quen",
    ngayMuon: "2024-01-20",
    hanTra: "2024-02-20",
    ngayTra: null,
    trangThai: "borrowed",
    ghiChu: "Phát triển bản thân",
    renewalCount: 0
  },
  
  // Phiếu mượn 4: Lê Thị D - 1 sách (đã trả)
  {
    id: 7,
    idDocGia: "TV004",
    tenDocGia: "Lê Thị D",
    idSach: "S004",
    tenSach: "Văn học Việt Nam", 
    ngayMuon: "2024-01-05",
    hanTra: "2024-02-05",
    ngayTra: "2024-02-03",
    trangThai: "returned",
    ghiChu: "Đã trả sách đúng hạn",
    renewalCount: 0
  },
  
  // Phiếu mượn 5: Hoàng Văn E - 2 sách
  {
    id: 8,
    idDocGia: "TV005",
    tenDocGia: "Hoàng Văn E",
    idSach: "S005",
    tenSach: "Lịch sử thế giới",
    ngayMuon: "2024-01-12", 
    hanTra: "2024-02-12",
    ngayTra: null,
    trangThai: "borrowed",
    ghiChu: "Tìm hiểu lịch sử",
    renewalCount: 0
  },
  {
    id: 9,
    idDocGia: "TV005",
    tenDocGia: "Hoàng Văn E",
    idSach: "S006",
    tenSach: "Nghĩ Giàu Làm Giàu",
    ngayMuon: "2024-01-12", 
    hanTra: "2024-02-12",
    ngayTra: null,
    trangThai: "borrowed",
    ghiChu: "Học kinh doanh",
    renewalCount: 0
  },
  
  // Phiếu mượn 6: Nguyễn Văn V - 3 sách (lập trình)
  {
    id: 10,
    idDocGia: "TV021",
    tenDocGia: "Nguyễn Văn V",
    idSach: "S021",
    tenSach: "Lập trình Python",
    ngayMuon: "2025-07-15",
    hanTra: "2025-08-15",
    ngayTra: null,
    trangThai: "borrowed",
    ghiChu: "Học lập trình Python",
    renewalCount: 0
  },
  {
    id: 11,
    idDocGia: "TV021",
    tenDocGia: "Nguyễn Văn V",
    idSach: "S022",
    tenSach: "Cơ sở dữ liệu MySQL",
    ngayMuon: "2025-07-15",
    hanTra: "2025-08-15",
    ngayTra: null,
    trangThai: "borrowed",
    ghiChu: "Học cơ sở dữ liệu",
    renewalCount: 0
  },
  {
    id: 12,
    idDocGia: "TV021",
    tenDocGia: "Nguyễn Văn V",
    idSach: "S023",
    tenSach: "Thiết kế web với HTML/CSS",
    ngayMuon: "2025-07-15",
    hanTra: "2025-08-15",
    ngayTra: null,
    trangThai: "borrowed",
    ghiChu: "Học thiết kế web",
    renewalCount: 0
  },
  
  // Phiếu mượn 7: Trần Thị W - 4 sách (tiếng Anh)
  {
    id: 13,
    idDocGia: "TV022",
    tenDocGia: "Trần Thị W",
    idSach: "S024",
    tenSach: "Tiếng Anh giao tiếp",
    ngayMuon: "2025-07-20",
    hanTra: "2025-08-20",
    ngayTra: null,
    trangThai: "borrowed",
    ghiChu: "Học tiếng Anh",
    renewalCount: 0
  },
  {
    id: 14,
    idDocGia: "TV022",
    tenDocGia: "Trần Thị W",
    idSach: "S025",
    tenSach: "Ngữ pháp tiếng Anh",
    ngayMuon: "2025-07-20",
    hanTra: "2025-08-20",
    ngayTra: null,
    trangThai: "borrowed",
    ghiChu: "Học ngữ pháp",
    renewalCount: 0
  },
  {
    id: 15,
    idDocGia: "TV022",
    tenDocGia: "Trần Thị W",
    idSach: "S026",
    tenSach: "Từ vựng tiếng Anh",
    ngayMuon: "2025-07-20",
    hanTra: "2025-08-20",
    ngayTra: null,
    trangThai: "borrowed",
    ghiChu: "Học từ vựng",
    renewalCount: 0
  },
  {
    id: 16,
    idDocGia: "TV022",
    tenDocGia: "Trần Thị W",
    idSach: "S027",
    tenSach: "Luyện nghe tiếng Anh",
    ngayMuon: "2025-07-20",
    hanTra: "2025-08-20",
    ngayTra: null,
    trangThai: "borrowed",
    ghiChu: "Luyện kỹ năng nghe",
    renewalCount: 0
  },
  
  // Phiếu mượn 8: Lê Văn X - 5 sách (các môn cơ bản)
  {
    id: 17,
    idDocGia: "TV023",
    tenDocGia: "Lê Văn X",
    idSach: "S028",
    tenSach: "Toán học cơ bản",
    ngayMuon: "2025-07-25",
    hanTra: "2025-08-25",
    ngayTra: null,
    trangThai: "borrowed",
    ghiChu: "Ôn tập toán học",
    renewalCount: 0
  },
  {
    id: 18,
    idDocGia: "TV023",
    tenDocGia: "Lê Văn X",
    idSach: "S029",
    tenSach: "Vật lý cơ bản",
    ngayMuon: "2025-07-25",
    hanTra: "2025-08-25",
    ngayTra: null,
    trangThai: "borrowed",
    ghiChu: "Ôn tập vật lý",
    renewalCount: 0
  },
  {
    id: 19,
    idDocGia: "TV023",
    tenDocGia: "Lê Văn X",
    idSach: "S030",
    tenSach: "Hóa học cơ bản",
    ngayMuon: "2025-07-25",
    hanTra: "2025-08-25",
    ngayTra: null,
    trangThai: "borrowed",
    ghiChu: "Ôn tập hóa học",
    renewalCount: 0
  },
  {
    id: 20,
    idDocGia: "TV023",
    tenDocGia: "Lê Văn X",
    idSach: "S031",
    tenSach: "Sinh học cơ bản",
    ngayMuon: "2025-07-25",
    hanTra: "2025-08-25",
    ngayTra: null,
    trangThai: "borrowed",
    ghiChu: "Ôn tập sinh học",
    renewalCount: 0
  },
  {
    id: 21,
    idDocGia: "TV023",
    tenDocGia: "Lê Văn X",
    idSach: "S032",
    tenSach: "Lịch sử Việt Nam",
    ngayMuon: "2025-07-25",
    hanTra: "2025-08-25",
    ngayTra: null,
    trangThai: "borrowed",
    ghiChu: "Ôn tập lịch sử",
    renewalCount: 0
  },
  
  // Phiếu mượn 9: Võ Văn I - 1 sách (đã gia hạn tối đa)
  {
    id: 22,
    idDocGia: "TV009",
    tenDocGia: "Võ Văn I",
    idSach: "S009",
    tenSach: "Sinh học phân tử",
    ngayMuon: "2024-01-08",
    hanTra: "2024-03-08",
    ngayTra: null,
    trangThai: "renewed",
    ghiChu: "Nghiên cứu sinh học",
    renewalCount: 2
  },
  
  // Phiếu mượn 10: Phạm Thị U - 1 sách (đã gia hạn tối đa)
  {
    id: 23,
    idDocGia: "TV020",
    tenDocGia: "Phạm Thị U",
    idSach: "S020",
    tenSach: "Du lịch bụi",
    ngayMuon: "2025-07-05",
    hanTra: "2025-08-05",
    ngayTra: null,
    trangThai: "renewed",
    ghiChu: "Chuẩn bị du lịch",
    renewalCount: 2
  }
]; 