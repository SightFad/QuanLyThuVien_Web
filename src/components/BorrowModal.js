import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaCalendar, FaBook, FaPlus, FaTrash, FaIdCard, FaTag, FaUserEdit } from 'react-icons/fa';

const BorrowModal = ({ borrow, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    memberId: '',
    memberName: '',
    borrowDate: new Date().toISOString().split('T')[0],
    returnDate: '',
    expectedReturnDate: new Date().toISOString().split('T')[0],
    books: [
      {
        stt: 1,
        bookId: '',
        bookTitle: '',
        category: '',
        author: ''
      }
    ]
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Mock data for members and books
  const mockMembers = [
    { 
      id: 1, 
      memberId: 'TV001', 
      name: 'Nguyễn Văn A'
    },
    { 
      id: 2, 
      memberId: 'TV002', 
      name: 'Trần Thị B'
    },
    { 
      id: 3, 
      memberId: 'TV003', 
      name: 'Lê Văn C'
    },
    { 
      id: 4, 
      memberId: 'TV004', 
      name: 'Phạm Thị D'
    },
    { 
      id: 5, 
      memberId: 'TV005', 
      name: 'Hoàng Văn E'
    }
  ];

  const mockBooks = [
    { 
      id: 1, 
      bookId: 'S001', 
      title: 'Đắc Nhân Tâm', 
      category: 'Kỹ năng sống', 
      author: 'Dale Carnegie'
    },
    { 
      id: 2, 
      bookId: 'S002', 
      title: 'Nhà Giả Kim', 
      category: 'Tiểu thuyết', 
      author: 'Paulo Coelho'
    },
    { 
      id: 3, 
      bookId: 'S003', 
      title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', 
      category: 'Kỹ năng sống', 
      author: 'Rosie Nguyễn'
    },
    { 
      id: 4, 
      bookId: 'S004', 
      title: 'Cách Nghĩ Để Thành Công', 
      category: 'Kinh doanh', 
      author: 'Napoleon Hill'
    },
    { 
      id: 5, 
      bookId: 'S005', 
      title: 'Đọc Vị Bất Kỳ Ai', 
      category: 'Tâm lý học', 
      author: 'David J. Lieberman'
    }
  ];

  useEffect(() => {
    if (borrow) {
      setFormData(borrow);
    } else {
      // Set default expected return date (30 days from borrow date)
      const defaultReturnDate = new Date();
      defaultReturnDate.setDate(defaultReturnDate.getDate() + 30);
      setFormData(prev => ({
        ...prev,
        expectedReturnDate: defaultReturnDate.toISOString().split('T')[0]
      }));
    }
  }, [borrow]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

    // Auto-fill member name when member ID changes
    if (name === 'memberId') {
      const member = mockMembers.find(m => m.memberId === value);
      if (member) {
        setSelectedMember(member);
        setFormData(prev => ({
          ...prev,
          memberName: member.name
        }));
      } else {
        setSelectedMember(null);
        setFormData(prev => ({
          ...prev,
          memberName: ''
        }));
      }
    }
  };

  const handleBookChange = (index, field, value) => {
    const updatedBooks = [...formData.books];
    updatedBooks[index] = {
      ...updatedBooks[index],
      [field]: value
    };

    // Auto-fill book details when book ID changes
    if (field === 'bookId') {
      const selectedBook = mockBooks.find(b => b.bookId === value);
      if (selectedBook) {
        updatedBooks[index] = {
          ...updatedBooks[index],
          bookTitle: selectedBook.title,
          category: selectedBook.category,
          author: selectedBook.author
        };
        console.log('Book selected:', selectedBook); // Debug log
      } else {
        updatedBooks[index] = {
          ...updatedBooks[index],
          bookTitle: '',
          category: '',
          author: ''
        };
      }
    }

    setFormData(prev => ({
      ...prev,
      books: updatedBooks
    }));
  };

  const addBookRow = () => {
    const newBook = {
      stt: formData.books.length + 1,
      bookId: '',
      bookTitle: '',
      category: '',
      author: ''
    };
    setFormData(prev => ({
      ...prev,
      books: [...prev.books, newBook]
    }));
  };

  const removeBookRow = (index) => {
    if (formData.books.length > 1) {
      const updatedBooks = formData.books.filter((_, i) => i !== index);
      // Reorder STT
      updatedBooks.forEach((book, i) => {
        book.stt = i + 1;
      });
      setFormData(prev => ({
        ...prev,
        books: updatedBooks
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate member ID
    if (!formData.memberId.trim()) {
      newErrors.memberId = 'Vui lòng nhập mã thành viên';
    } else {
      const member = mockMembers.find(m => m.memberId === formData.memberId);
      if (!member) {
        newErrors.memberId = 'Mã thành viên không tồn tại';
      }
    }

    // Validate borrow date
    if (!formData.borrowDate) {
      newErrors.borrowDate = 'Vui lòng chọn ngày mượn';
    }

    // Validate expected return date
    if (!formData.expectedReturnDate) {
      newErrors.expectedReturnDate = 'Vui lòng chọn ngày dự kiến trả';
    } else {
      const borrowDate = new Date(formData.borrowDate);
      const returnDate = new Date(formData.expectedReturnDate);
      if (returnDate <= borrowDate) {
        newErrors.expectedReturnDate = 'Ngày trả phải sau ngày mượn';
      }
    }

    // Validate books
    const bookErrors = [];
    formData.books.forEach((book, index) => {
      const bookError = {};
      if (!book.bookId.trim()) {
        bookError.bookId = 'Vui lòng nhập mã sách';
      } else {
        const selectedBook = mockBooks.find(b => b.bookId === book.bookId);
        if (!selectedBook) {
          bookError.bookId = 'Mã sách không tồn tại';
        }
      }
      if (Object.keys(bookError).length > 0) {
        bookErrors[index] = bookError;
      }
    });

    if (bookErrors.length > 0) {
      newErrors.books = bookErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Transform form data to match API expectations
      const transformedData = {
        readerId: formData.memberId,
        readerName: formData.memberName,
        borrowDate: formData.borrowDate,
        expectedReturnDate: formData.expectedReturnDate,
        returnDate: formData.returnDate || null,
        notes: formData.notes || '',
        books: formData.books.filter(book => book.bookId.trim() !== '')
      };

      await onSave(transformedData);
      onClose();
    } catch (error) {
      setErrors({ submit: 'Lỗi khi lưu phiếu mượn. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal borrow-modal" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '1600px',
          width: '98%',
          maxHeight: '95vh'
        }}
      >
        <div className="modal-header">
          <h2 className="modal-title">
            {borrow ? 'Chỉnh sửa phiếu mượn' : 'PHIẾU MƯỢN SÁCH'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {errors.submit && (
          <div className="error-message">
            <FaTimes />
            <span>{errors.submit}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="borrow-form">
          {/* Member and Date Information Section */}
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="memberId">
                  <FaIdCard /> Mã thành viên <span className="required">*</span>
                </label>
                <select
                  id="memberId"
                  name="memberId"
                  value={formData.memberId}
                  onChange={handleChange}
                  className={errors.memberId ? 'error' : ''}
                >
                  <option value="">Chọn mã thành viên</option>
                  {mockMembers.map(member => (
                    <option key={member.id} value={member.memberId}>
                      {member.memberId} - {member.name}
                    </option>
                  ))}
                </select>
                {errors.memberId && <span className="error-text">{errors.memberId}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="borrowDate">
                  <FaCalendar /> Ngày mượn <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="borrowDate"
                  name="borrowDate"
                  value={formData.borrowDate}
                  onChange={handleChange}
                  className={errors.borrowDate ? 'error' : ''}
                />
                {errors.borrowDate && <span className="error-text">{errors.borrowDate}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="memberName">
                  <FaUser /> Họ tên thành viên
                </label>
                <input
                  type="text"
                  id="memberName"
                  name="memberName"
                  value={formData.memberName}
                  readOnly
                  className="readonly"
                  placeholder="Tự động hiển thị từ mã thành viên"
                />
              </div>

              <div className="form-group">
                <label htmlFor="expectedReturnDate">
                  <FaCalendar /> Ngày dự kiến trả <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="expectedReturnDate"
                  name="expectedReturnDate"
                  value={formData.expectedReturnDate}
                  onChange={handleChange}
                  className={errors.expectedReturnDate ? 'error' : ''}
                />
                {errors.expectedReturnDate && <span className="error-text">{errors.expectedReturnDate}</span>}
              </div>
            </div>
          </div>

          {/* Books Section */}
          <div className="form-section">
            <div className="section-header-with-action">
              <h3>
                <FaBook /> Danh sách sách mượn
              </h3>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={addBookRow}
              >
                <FaPlus /> Thêm sách
              </button>
            </div>



            <div className="books-table-container">
              <table className="books-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã sách <span className="required">*</span></th>
                    <th>Tên sách</th>
                    <th>Thể loại</th>
                    <th>Tác giả</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.books.map((book, index) => (
                    <tr key={index}>
                      <td className="stt-cell">{book.stt}</td>
                      <td>
                        <select
                          value={book.bookId}
                          onChange={(e) => handleBookChange(index, 'bookId', e.target.value)}
                          className={errors.books && errors.books[index] && errors.books[index].bookId ? 'error' : ''}
                        >
                          <option value="">Chọn mã sách</option>
                          {mockBooks.map(b => (
                            <option key={b.id} value={b.bookId}>
                              {b.bookId} - {b.title}
                            </option>
                          ))}
                        </select>
                        {errors.books && errors.books[index] && errors.books[index].bookId && (
                          <span className="error-text">{errors.books[index].bookId}</span>
                        )}
                      </td>
                      <td className="book-title-cell">
                        {book.bookTitle || 'Chọn mã sách để hiển thị thông tin'}
                      </td>
                      <td className="book-category-cell">
                        {book.category ? (
                          <span className="category-badge">
                            <FaTag className="book-icon" />
                            {book.category}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="book-author-cell">
                        {book.author ? (
                          <span className="author-badge">
                            <FaUserEdit className="book-icon" />
                            {book.author}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="action-cell">
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removeBookRow(index)}
                          title="Xóa sách này"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <FaBook />
                  {borrow ? 'Cập nhật phiếu mượn' : 'Tạo phiếu mượn'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowModal; 