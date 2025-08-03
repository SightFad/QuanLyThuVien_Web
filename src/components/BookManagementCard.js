import React from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import BookCover from './BookCover';
import './BookManagementCard.css';

const BookManagementCard = ({ book, onEdit, onDelete, onViewDetails }) => {
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
    isbn,
    quantity,
    available
  } = book;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(book);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
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

  const getAvailabilityText = () => {
    if (quantity && available !== undefined) {
      return `${available}/${quantity}`;
    }
    return status || 'Không xác định';
  };

  return (
    <div className="book-management-card">
      <div className="book-cover-container">
        <BookCover
          src={coverImage}
          title={title}
          alt={`${title} by ${author}`}
          className="book-cover"
        />
        <div className="book-status-badge">
          <span className={`status-dot ${getStatusColor(status)}`}></span>
          <span className="status-text">{getAvailabilityText()}</span>
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

        {/* Inventory Information */}
        <div className="inventory-info">
          <p className="inventory-item">
            <span className="label">Tổng số:</span>
            <span className="value">{quantity || 0}</span>
          </p>
          <p className="inventory-item">
            <span className="label">Có sẵn:</span>
            <span className="value">{available || 0}</span>
          </p>
          <p className="inventory-item">
            <span className="label">Đã mượn:</span>
            <span className="value">{(quantity || 0) - (available || 0)}</span>
          </p>
        </div>
      </div>

      <div className="book-actions">
        <button 
          className="action-btn edit-btn"
          onClick={handleEdit}
          title="Chỉnh sửa sách"
        >
          <FaEdit /> Chỉnh sửa
        </button>
        
        <button 
          className="action-btn delete-btn"
          onClick={handleDelete}
          title="Xóa sách"
        >
          <FaTrash /> Xóa
        </button>
        
        <button 
          className="action-btn details-btn"
          onClick={handleViewDetails}
          title="Xem chi tiết"
        >
          <FaEye /> Chi tiết
        </button>
      </div>
    </div>
  );
};

export default BookManagementCard; 