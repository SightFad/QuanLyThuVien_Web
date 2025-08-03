import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheck, FaBook, FaUser, FaCalendarAlt, FaIdCard, FaInfoCircle } from 'react-icons/fa';
import './RenewalModal.css';

const RenewalModal = ({ isOpen, onClose, borrowData, onConfirm }) => {
  const [renewalData, setRenewalData] = useState({
    renewalId: '',
    memberId: '',
    memberName: '',
    books: [
      {
        stt: 1,
        bookId: '',
        bookTitle: '',
        oldBorrowDate: '',
        oldDueDate: '',
        newDueDate: '',
        renewalDays: 0
      }
    ],
    totalRenewalDays: 0,
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [maxRenewalDays] = useState(30); // Số ngày gia hạn tối đa
  const [maxRenewalCount] = useState(2); // Số lần gia hạn tối đa

  useEffect(() => {
    if (isOpen && borrowData) {
      const today = new Date();
      const newDueDate = new Date(borrowData.returnDate);
      newDueDate.setDate(newDueDate.getDate() + 14); // Gia hạn thêm 14 ngày mặc định

      setRenewalData({
        renewalId: `GH${Date.now()}`,
        memberId: borrowData.readerId,
        memberName: borrowData.readerName,
        books: [
          {
            stt: 1,
            bookId: borrowData.bookId,
            bookTitle: borrowData.bookTitle,
            oldBorrowDate: borrowData.borrowDate,
            oldDueDate: borrowData.returnDate,
            newDueDate: newDueDate.toISOString().split('T')[0],
            renewalDays: 14
          }
        ],
        totalRenewalDays: 14,
        notes: '',
        currentRenewalCount: borrowData.renewalCount || 0
      });
    }
  }, [isOpen, borrowData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRenewalData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBookChange = (index, field, value) => {
    const updatedBooks = [...renewalData.books];
    updatedBooks[index] = {
      ...updatedBooks[index],
      [field]: value
    };

    // Tính toán số ngày gia hạn khi thay đổi ngày hết hạn mới
    if (field === 'newDueDate') {
      const oldDueDate = new Date(updatedBooks[index].oldDueDate);
      const newDueDate = new Date(value);
      const renewalDays = Math.floor((newDueDate - oldDueDate) / (1000 * 60 * 60 * 24));
      
      updatedBooks[index].renewalDays = Math.max(0, renewalDays);
    }

    setRenewalData(prev => ({
      ...prev,
      books: updatedBooks
    }));

    // Tính tổng số ngày gia hạn
    const totalRenewalDays = updatedBooks.reduce((total, book) => total + book.renewalDays, 0);
    setRenewalData(prev => ({
      ...prev,
      totalRenewalDays
    }));
  };

  // Đã xóa chức năng addBookRow và removeBookRow

  const validateForm = () => {
    const newErrors = {};
    
    if (!renewalData.memberId) {
      newErrors.memberId = 'Mã thành viên là bắt buộc';
    }
    
    if (!renewalData.books || renewalData.books.length === 0) {
      newErrors.books = 'Phải có ít nhất một sách để gia hạn';
    }

    // Kiểm tra từng sách
    renewalData.books.forEach((book, index) => {
      if (!book.bookId) {
        newErrors[`book${index}Id`] = 'Mã sách là bắt buộc';
      }
      if (!book.newDueDate) {
        newErrors[`book${index}NewDueDate`] = 'Ngày hết hạn mới là bắt buộc';
      }
      if (book.renewalDays > maxRenewalDays) {
        newErrors[`book${index}RenewalDays`] = `Số ngày gia hạn không được vượt quá ${maxRenewalDays} ngày`;
      }
      if (book.renewalDays < 0) {
        newErrors[`book${index}RenewalDays`] = 'Số ngày gia hạn không được âm';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Tạo phiếu gia hạn
    const renewalSlip = {
      id: renewalData.renewalId,
      memberId: renewalData.memberId,
      memberName: renewalData.memberName,
      books: renewalData.books,
      totalRenewalDays: renewalData.totalRenewalDays,
      notes: renewalData.notes,
      status: 'approved',
      createdAt: new Date().toISOString()
    };

    console.log('Phiếu gia hạn:', renewalSlip);
    
    // Thông báo thành công
    alert(`✅ Phiếu gia hạn mượn sách đã được tạo thành công!

📋 Thông tin gia hạn:
• Mã phiếu: ${renewalSlip.id}
• Thành viên: ${renewalSlip.memberName}
• Số sách gia hạn: ${renewalSlip.books.length} cuốn
• Tổng số ngày gia hạn: ${renewalSlip.totalRenewalDays} ngày
• Lần gia hạn: ${renewalData.currentRenewalCount + 1}/${maxRenewalCount}

📚 Chi tiết sách:
${renewalSlip.books.map(book => 
  `• ${book.bookTitle}: ${book.renewalDays} ngày (từ ${new Date(book.oldDueDate).toLocaleDateString('vi-VN')} đến ${new Date(book.newDueDate).toLocaleDateString('vi-VN')})`
).join('\n')}

💡 Gia hạn đã được xác nhận!`);

    // Gọi callback để cập nhật dữ liệu
    if (onConfirm) {
      onConfirm(renewalSlip);
    }
    
    onClose();
  };

  const formatDateRange = (startDate, endDate) => {
    return `từ ${new Date(startDate).toLocaleDateString('vi-VN')} đến ${new Date(endDate).toLocaleDateString('vi-VN')}`;
  };

  if (!isOpen || !borrowData) return null;

  return (
    <div className="renewal-modal-overlay">
      <div className="renewal-modal">
        <div className="renewal-modal-header">
          <h2>
            <FaBook className="header-icon" />
            Phiếu Gia Hạn Mượn Sách
          </h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="renewal-form">
          {/* Thông tin thành viên */}
          <div className="form-section">
            <h3 className="section-title">
              <FaUser className="section-icon" />
              Thông Tin Thành Viên
            </h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="memberId">
                  <FaIdCard className="input-icon" />
                  Mã thành viên
                </label>
                <input
                  type="text"
                  id="memberId"
                  name="memberId"
                  value={renewalData.memberId}
                  onChange={handleInputChange}
                  readOnly
                  className="readonly"
                />
                <small className="field-note">Tự động điền từ phiếu mượn</small>
              </div>

              <div className="form-group">
                <label htmlFor="memberName">
                  <FaUser className="input-icon" />
                  Tên thành viên
                </label>
                <input
                  type="text"
                  id="memberName"
                  name="memberName"
                  value={renewalData.memberName}
                  onChange={handleInputChange}
                  readOnly
                  className="readonly"
                />
              </div>
            </div>
          </div>

          {/* Bảng sách gia hạn */}
          <div className="form-section">
            <h3 className="section-title">
              <FaBook className="section-icon" />
              Danh Sách Sách Gia Hạn
            </h3>
            
            <div className="renewal-table-container">
              <table className="renewal-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã sách</th>
                    <th>Tên sách</th>
                    <th>Ngày mượn cũ</th>
                    <th>Ngày hết hạn mới</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {renewalData.books.map((book, index) => (
                    <tr key={index}>
                      <td>{book.stt}</td>
                      <td>
                        <input
                          type="text"
                          value={book.bookId}
                          onChange={(e) => handleBookChange(index, 'bookId', e.target.value)}
                          className={errors[`book${index}Id`] ? 'error' : ''}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={book.bookTitle}
                          onChange={(e) => handleBookChange(index, 'bookTitle', e.target.value)}
                          readOnly
                        />
                      </td>
                      <td>
                        <span className="date-range">
                          {formatDateRange(book.oldBorrowDate, book.oldDueDate)}
                        </span>
                      </td>
                      <td>
                        <input
                          type="date"
                          value={book.newDueDate}
                          onChange={(e) => handleBookChange(index, 'newDueDate', e.target.value)}
                          className={errors[`book${index}NewDueDate`] ? 'error' : ''}
                          min={book.oldDueDate}
                        />
                        {errors[`book${index}NewDueDate`] && (
                          <span className="error-message">{errors[`book${index}NewDueDate`]}</span>
                        )}
                        {errors[`book${index}RenewalDays`] && (
                          <span className="error-message">{errors[`book${index}RenewalDays`]}</span>
                        )}
                      </td>
                      <td>-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Đã xóa chức năng thêm sách */}

            <div className="renewal-summary">
              <div className="summary-item">
                <label>Tổng số sách:</label>
                <span>{renewalData.books.length} cuốn</span>
              </div>
              <div className="summary-item">
                <label>Tổng số ngày gia hạn:</label>
                <span>{renewalData.totalRenewalDays} ngày</span>
              </div>
              <div className="summary-item">
                <label>Số ngày tối đa cho phép:</label>
                <span>{maxRenewalDays} ngày</span>
              </div>
              <div className="summary-item">
                <label>Số lần gia hạn hiện tại:</label>
                <span>{renewalData.currentRenewalCount + 1}/{maxRenewalCount}</span>
              </div>
            </div>
          </div>

          {/* Ghi chú */}
          <div className="form-section">
            <h3 className="section-title">
              <FaInfoCircle className="section-icon" />
              Ghi Chú
            </h3>
            <div className="form-group">
              <textarea
                name="notes"
                value={renewalData.notes}
                onChange={handleInputChange}
                rows="3"
                placeholder="Ghi chú về việc gia hạn (nếu có)..."
              />
            </div>
          </div>

          {/* Nút hành động */}
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              <FaTimes />
              Hủy
            </button>
            <button type="submit" className="submit-button">
              <FaCheck />
              Xác Nhận Gia Hạn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenewalModal; 