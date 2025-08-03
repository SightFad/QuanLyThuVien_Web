import React from 'react';
import BookCover from './BookCover';
import './BookCard.css';

const BookCard = ({ book, onBorrow, onReserve, onViewDetails }) => {
  const {
    id,
    title,
    author,
    category,
    shelf,
    status,
    coverImage,
    description,
    publishedYear,
    isbn
  } = book;

  const handleBorrow = () => {
    if (onBorrow) {
      onBorrow(book);
    }
  };

  const handleReserve = () => {
    if (onReserve) {
      onReserve(book);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(book);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'có sẵn':
      case 'available':
        return 'success';
      case 'đã mượn':
      case 'borrowed':
        return 'warning';
      case 'đã đặt':
      case 'reserved':
        return 'info';
      case 'hư hỏng':
      case 'damaged':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="book-card">
      <div className="book-cover-container">
        <BookCover
          src={coverImage}
          title={title}
          alt={`${title} by ${author}`}
          className="book-cover"
        />
        <div className="book-status-badge">
          <span className={`status-dot ${getStatusColor(status)}`}></span>
          <span className="status-text">{status || 'Không xác định'}</span>
        </div>
      </div>

      <div className="book-info">
        <h3 className="book-title" onClick={handleViewDetails}>
          {title}
        </h3>
        <p className="book-author">Tác giả: {author}</p>
        <p className="book-category">Thể loại: {category}</p>
        <p className="book-shelf">Kệ: {shelf}</p>
        
        {publishedYear && (
          <p className="book-year">Năm xuất bản: {publishedYear}</p>
        )}
        
        {isbn && (
          <p className="book-isbn">ISBN: {isbn}</p>
        )}

        {description && (
          <p className="book-description">
            {description.length > 100 
              ? `${description.substring(0, 100)}...` 
              : description
            }
          </p>
        )}
      </div>

      <div className="book-actions">
        {status?.toLowerCase() === 'có sẵn' && (
          <button 
            className="action-btn borrow-btn"
            onClick={handleBorrow}
            title="Mượn sách"
          >
            Mượn sách
          </button>
        )}
        
        {status?.toLowerCase() !== 'đã đặt' && (
          <button 
            className="action-btn reserve-btn"
            onClick={handleReserve}
            title="Đặt trước"
          >
            Đặt trước
          </button>
        )}
        
        <button 
          className="action-btn details-btn"
          onClick={handleViewDetails}
          title="Xem chi tiết"
        >
          Chi tiết
        </button>
      </div>
    </div>
  );
};

export default BookCard; 