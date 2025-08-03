import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import BookCoverUpload from './BookCoverUpload';
import './BookModal.css';

const BookModal = ({ book, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    publisher: '',
    publishYear: new Date().getFullYear(),
    quantity: 1,
    available: 1,
    location: '',
    coverImage: ''
  });

  useEffect(() => {
    if (book) {
      setFormData({
        ...book,
        coverImage: book.coverImage || ''
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      coverImage: imageUrl
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.author || !formData.isbn) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Ensure available doesn't exceed quantity
    const available = Math.min(formData.available, formData.quantity);
    
    onSave({
      ...formData,
      available
    });
  };

  const categories = [
    'Kỹ năng sống',
    'Tiểu thuyết',
    'Kinh doanh',
    'Tâm lý học',
    'Khoa học',
    'Lịch sử',
    'Văn học',
    'Giáo dục',
    'Công nghệ',
    'Khác'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {book ? 'Chỉnh sửa sách' : 'Thêm sách mới'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tên sách *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Nhập tên sách"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tác giả *</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Nhập tên tác giả"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">ISBN *</label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Nhập mã ISBN"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Thể loại</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Chọn thể loại</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nhà xuất bản</label>
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Nhập tên nhà xuất bản"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Năm xuất bản</label>
                <input
                  type="number"
                  name="publishYear"
                  value={formData.publishYear}
                  onChange={handleChange}
                  className="form-input"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Số lượng</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="form-input"
                  min="1"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Số lượng có sẵn</label>
                <input
                  type="number"
                  name="available"
                  value={formData.available}
                  onChange={handleChange}
                  className="form-input"
                  min="0"
                  max={formData.quantity}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Vị trí lưu trữ</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
                placeholder="Ví dụ: Kệ A1, Tủ B2..."
              />
            </div>

            {/* Book Cover Upload */}
            <BookCoverUpload
              onImageUpload={handleImageUpload}
              currentImage={formData.coverImage}
            />

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Hủy
              </button>
              <button type="submit" className="btn btn-primary">
                {book ? 'Cập nhật' : 'Thêm sách'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookModal; 