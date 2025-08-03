/**
 * Reader Service - Quản lý các API calls dành riêng cho Reader
 */
import apiService from './api';
import { userService } from './index';

class ReaderService {
  constructor() {
    this.baseUrl = '/api/Reader';
  }

  // Lấy Reader Dashboard Data
  async getDashboard(readerId = null) {
    try {
      const id = readerId || userService.getCurrentDocGiaId();
      if (!id) {
        throw new Error('Reader ID not found. Please login again.');
      }

      const data = await apiService.get(`${this.baseUrl}/dashboard/${id}`);
      return this.mapDashboardFromApi(data);
    } catch (error) {
      console.error('Error fetching reader dashboard:', error);
      throw error;
    }
  }

  // Lấy My Books Data (sách đang mượn + lịch sử)
  async getMyBooks(readerId = null) {
    try {
      const id = readerId || userService.getCurrentDocGiaId();
      if (!id) {
        throw new Error('Reader ID not found. Please login again.');
      }

      const data = await apiService.get(`${this.baseUrl}/my-books/${id}`);
      return this.mapMyBooksFromApi(data);
    } catch (error) {
      console.error('Error fetching my books:', error);
      throw error;
    }
  }

  // Lấy Reader Profile
  async getProfile(readerId = null) {
    try {
      const id = readerId || userService.getCurrentDocGiaId();
      if (!id) {
        throw new Error('Reader ID not found. Please login again.');
      }

      const data = await apiService.get(`${this.baseUrl}/profile/${id}`);
      return this.mapProfileFromApi(data);
    } catch (error) {
      console.error('Error fetching reader profile:', error);
      throw error;
    }
  }

  // Cập nhật Reader Profile
  async updateProfile(profileData, readerId = null) {
    try {
      const id = readerId || userService.getCurrentDocGiaId();
      if (!id) {
        throw new Error('Reader ID not found. Please login again.');
      }

      const mappedData = this.mapProfileToApi(profileData);
      await apiService.put(`${this.baseUrl}/profile/${id}`, mappedData);
      return { success: true, message: 'Cập nhật thành công' };
    } catch (error) {
      console.error('Error updating reader profile:', error);
      throw error;
    }
  }

  // Lấy Reader Fines
  async getFines(readerId = null) {
    try {
      const id = readerId || userService.getCurrentDocGiaId();
      if (!id) {
        throw new Error('Reader ID not found. Please login again.');
      }

      // Sử dụng FineController API có sẵn
      const data = await apiService.get(`/api/Fine/reader/${id}`);
      return this.mapFinesFromApi(data);
    } catch (error) {
      console.error('Error fetching reader fines:', error);
      throw error;
    }
  }

  // Lấy Reader Reservations
  async getReservations(readerId = null) {
    try {
      const id = readerId || userService.getCurrentDocGiaId();
      if (!id) {
        throw new Error('Reader ID not found. Please login again.');
      }

      // Sử dụng ReservationController API có sẵn
      const data = await apiService.get(`/api/Reservation/reader/${id}`);
      return this.mapReservationsFromApi(data);
    } catch (error) {
      console.error('Error fetching reader reservations:', error);
      throw error;
    }
  }

  // Hủy Reservation
  async cancelReservation(reservationId, readerId = null) {
    try {
      const id = readerId || userService.getCurrentDocGiaId();
      if (!id) {
        throw new Error('Reader ID not found. Please login again.');
      }

      await apiService.delete(`/api/Reservation/${reservationId}?readerId=${id}`);
      return { success: true, message: 'Hủy đặt trước thành công' };
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      throw error;
    }
  }

  // Gia hạn sách
  async renewBook(phieuMuonId, sachId, readerId = null) {
    try {
      const id = readerId || userService.getCurrentDocGiaId();
      if (!id) {
        throw new Error('Reader ID not found. Please login again.');
      }

      const result = await apiService.post('/api/Borrow/renew', {
        maPhieuMuon: phieuMuonId,
        maSach: sachId,
        maDG: id
      });
      return result;
    } catch (error) {
      console.error('Error renewing book:', error);
      throw error;
    }
  }

  // Return book
  async returnBook(phieuMuonId, sachId, readerId = null) {
    try {
      const id = readerId || userService.getCurrentDocGiaId();
      if (!id) {
        throw new Error('Reader ID not found. Please login again.');
      }

      // Sử dụng BorrowController API có sẵn
      const result = await apiService.post('/api/Borrow/return', {
        MaPhieuMuon: phieuMuonId,
        MaSach: sachId,
        MaDG: id
      });
      return result;
    } catch (error) {
      console.error('Error returning book:', error);
      throw error;
    }
  }

  // === MAPPING FUNCTIONS ===

  // Map Dashboard data từ API format sang frontend format
  mapDashboardFromApi(apiData) {
    return {
      readerInfo: {
        id: apiData.readerInfo.id,
        name: apiData.readerInfo.name,
        email: apiData.readerInfo.email,
        memberSince: apiData.readerInfo.memberSince,
        memberStatus: apiData.readerInfo.memberStatus,
        loaiDocGia: apiData.readerInfo.loaiDocGia,
        capBac: apiData.readerInfo.capBac,
        totalBorrows: apiData.readerInfo.totalBorrows,
        currentBorrows: apiData.readerInfo.currentBorrows,
        overdueBooks: apiData.readerInfo.overdueBooks,
        fines: apiData.readerInfo.fines
      },
      currentBorrows: apiData.currentBorrows.map(book => ({
        id: book.id,
        phieuMuonId: book.phieuMuonId,
        bookTitle: book.bookTitle,
        author: book.author,
        category: book.category,
        borrowDate: book.borrowDate,
        returnDate: book.returnDate,
        daysLeft: book.daysLeft,
        status: book.status,
        location: book.location
      })),
      recentBooks: apiData.recentBooks.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        available: book.available,
        total: book.total,
        location: book.location,
        coverImage: book.coverImage
      }))
    };
  }

  // Map My Books data từ API format sang frontend format
  mapMyBooksFromApi(apiData) {
    return {
      currentBooks: apiData.currentBooks.map(book => ({
        id: book.id,
        phieuMuonId: book.phieuMuonId,
        bookTitle: book.bookTitle,
        author: book.author,
        category: book.category,
        isbn: book.isbn,
        location: book.location,
        borrowDate: book.borrowDate,
        returnDate: book.returnDate,
        daysLeft: book.daysLeft,
        status: book.status,
        coverImage: book.coverImage
      })),
      borrowHistory: apiData.borrowHistory.map(book => ({
        id: book.id,
        phieuMuonId: book.phieuMuonId,
        bookTitle: book.bookTitle,
        author: book.author,
        category: book.category,
        isbn: book.isbn,
        location: book.location,
        borrowDate: book.borrowDate,
        returnDate: book.returnDate,
        actualReturnDate: book.actualReturnDate,
        status: book.status,
        fine: book.fine,
        coverImage: book.coverImage
      }))
    };
  }

  // Map Profile data từ API format sang frontend format
  mapProfileFromApi(apiData) {
    return {
      id: apiData.id,
      hoTen: apiData.hoTen,
      email: apiData.email,
      sdt: apiData.sdt,
      diaChi: apiData.diaChi,
      gioiTinh: apiData.gioiTinh,
      ngaySinh: apiData.ngaySinh,
      loaiDocGia: apiData.loaiDocGia,
      capBac: apiData.capBac,
      memberStatus: apiData.memberStatus,
      ngayDangKy: apiData.ngayDangKy,
      ngayHetHan: apiData.ngayHetHan,
      phiThanhVien: apiData.phiThanhVien,
      soSachToiDa: apiData.soSachToiDa,
      soNgayMuonToiDa: apiData.soNgayMuonToiDa,
      soLanGiaHanToiDa: apiData.soLanGiaHanToiDa,
      soNgayGiaHan: apiData.soNgayGiaHan,
      statistics: apiData.statistics
    };
  }

  // Map Profile data từ frontend format sang API format
  mapProfileToApi(frontendData) {
    return {
      Email: frontendData.email,
      SDT: frontendData.sdt,
      DiaChi: frontendData.diaChi,
      NgaySinh: frontendData.ngaySinh ? new Date(frontendData.ngaySinh) : null
    };
  }

  // Map Fines data từ API format sang frontend format
  mapFinesFromApi(apiData) {
    return apiData.map(fine => ({
      id: fine.maPhieuThu,
      bookTitle: fine.tenSach || 'N/A',
      dueDate: fine.ngayTao,
      returnDate: fine.ngayThu || '',
      amount: fine.soTien,
      reason: fine.lyDo || 'Phí phạt',
      status: fine.trangThai === 'DaThu' ? 'paid' : 'pending',
      fineType: fine.loaiThu === 'PhiPhat' ? 'late_return' : 'other',
      paidDate: fine.trangThai === 'DaThu' ? fine.ngayThu : null
    }));
  }

  // Map Reservations data từ API format sang frontend format
  mapReservationsFromApi(apiData) {
    return apiData.map(reservation => ({
      id: reservation.maPhieuDat,
      bookTitle: reservation.tenSach || reservation.sach?.tenSach,
      author: reservation.tacGia || reservation.sach?.tacGia,
      category: reservation.theLoai || reservation.sach?.theLoai,
      location: reservation.viTriLuuTru || reservation.sach?.viTriLuuTru,
      reservationDate: reservation.ngayDat,
      status: reservation.trangThai,
      isbn: reservation.isbn || reservation.sach?.isbn
    }));
  }
}

export default new ReaderService();