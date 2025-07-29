import React, { useState } from 'react';
import { FaHandshake, FaSearch, FaUser, FaBook, FaCalendar, FaCheck } from 'react-icons/fa';
import './BorrowingProcess.css';

const BorrowingProcess = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const handleMemberSearch = () => {
    // Simulate member search
    setSelectedMember({
      id: 1,
      name: 'Nguyễn Văn A',
      memberId: 'TV001',
      membershipType: 'student',
      maxBooks: 5,
      currentBooks: 2
    });
    setCurrentStep(2);
  };

  const handleBookSearch = () => {
    // Simulate book search
    const foundBooks = [
      { id: 1, title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', isbn: '978-604-1-00001-1', available: true },
      { id: 2, title: 'Nhà Giả Kim', author: 'Paulo Coelho', isbn: '978-604-1-00002-2', available: true }
    ];
    setSelectedBooks(foundBooks);
  };

  const handleConfirmBorrowing = () => {
    setCurrentStep(4);
  };

  return (
    <div className="borrowing-process">
      <div className="page-header">
        <h1><FaHandshake /> Quy trình mượn sách</h1>
        <p>Thực hiện quy trình lập phiếu mượn sách và bàn giao sách</p>
      </div>

      <div className="process-steps">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Tìm kiếm thành viên</h3>
            <p>Tìm kiếm thông tin thành viên</p>
          </div>
        </div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Chọn sách</h3>
            <p>Tìm kiếm và chọn sách cần mượn</p>
          </div>
        </div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Xác nhận</h3>
            <p>Xác nhận thông tin mượn sách</p>
          </div>
        </div>
        <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <div className="step-content">
            <h3>Hoàn thành</h3>
            <p>Bàn giao sách cho thành viên</p>
          </div>
        </div>
      </div>

      <div className="process-content">
        {currentStep === 1 && (
          <div className="step-panel">
            <h2>Tìm kiếm thành viên</h2>
            <div className="search-section">
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Nhập mã thẻ, tên hoặc số điện thoại thành viên"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleMemberSearch}>
                  <FaSearch /> Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && selectedMember && (
          <div className="step-panel">
            <h2>Thông tin thành viên</h2>
            <div className="member-info">
              <div className="info-card">
                <h3><FaUser /> {selectedMember.name}</h3>
                <p><strong>Mã thẻ:</strong> {selectedMember.memberId}</p>
                <p><strong>Loại thành viên:</strong> {selectedMember.membershipType}</p>
                <p><strong>Sách đang mượn:</strong> {selectedMember.currentBooks}/{selectedMember.maxBooks}</p>
              </div>
            </div>
            
            <h2>Tìm kiếm sách</h2>
            <div className="search-section">
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Nhập tên sách, tác giả hoặc ISBN"
                />
                <button onClick={handleBookSearch}>
                  <FaSearch /> Tìm kiếm
                </button>
              </div>
            </div>

            {selectedBooks.length > 0 && (
              <div className="books-list">
                <h3>Sách tìm thấy</h3>
                {selectedBooks.map(book => (
                  <div key={book.id} className="book-item">
                    <div className="book-info">
                      <h4>{book.title}</h4>
                      <p><strong>Tác giả:</strong> {book.author}</p>
                      <p><strong>ISBN:</strong> {book.isbn}</p>
                    </div>
                    <div className="book-status">
                      <span className="status-available">Có sẵn</span>
                    </div>
                  </div>
                ))}
                <button 
                  className="btn-primary"
                  onClick={() => setCurrentStep(3)}
                >
                  <FaCheck /> Tiếp tục
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="step-panel">
            <h2>Xác nhận thông tin mượn sách</h2>
            <div className="confirmation-details">
              <div className="detail-section">
                <h3>Thông tin thành viên</h3>
                <p><strong>Tên:</strong> {selectedMember?.name}</p>
                <p><strong>Mã thẻ:</strong> {selectedMember?.memberId}</p>
              </div>
              
              <div className="detail-section">
                <h3>Sách được mượn</h3>
                {selectedBooks.map(book => (
                  <div key={book.id} className="book-detail">
                    <p><strong>{book.title}</strong></p>
                    <p>Tác giả: {book.author}</p>
                  </div>
                ))}
              </div>
              
              <div className="detail-section">
                <h3>Thông tin mượn</h3>
                <p><strong>Ngày mượn:</strong> {new Date().toLocaleDateString('vi-VN')}</p>
                <p><strong>Ngày hẹn trả:</strong> {new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}</p>
                <p><strong>Số lượng:</strong> {selectedBooks.length} cuốn</p>
              </div>
            </div>
            
            <div className="confirmation-actions">
              <button 
                className="btn-secondary"
                onClick={() => setCurrentStep(2)}
              >
                Quay lại
              </button>
              <button 
                className="btn-primary"
                onClick={handleConfirmBorrowing}
              >
                <FaCheck /> Xác nhận mượn sách
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="step-panel">
            <div className="success-message">
              <FaCheck />
              <h2>Mượn sách thành công!</h2>
              <p>Phiếu mượn sách đã được tạo và sách đã được bàn giao cho thành viên.</p>
              
              <div className="borrowing-summary">
                <h3>Tóm tắt giao dịch</h3>
                <p><strong>Mã phiếu:</strong> PM20240115001</p>
                <p><strong>Thành viên:</strong> {selectedMember?.name}</p>
                <p><strong>Số sách:</strong> {selectedBooks.length} cuốn</p>
                <p><strong>Ngày hẹn trả:</strong> {new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}</p>
              </div>
              
              <button 
                className="btn-primary"
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedMember(null);
                  setSelectedBooks([]);
                  setSearchTerm('');
                }}
              >
                Tạo phiếu mượn mới
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowingProcess; 