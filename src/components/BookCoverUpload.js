import React, { useState } from 'react';
import { FaUpload, FaImage, FaTimes } from 'react-icons/fa';
import './BookCoverUpload.css';

const BookCoverUpload = ({ onImageUpload, currentImage, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(currentImage);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Chỉ chấp nhận file hình ảnh (JPG, PNG, GIF)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 5MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://libraryapi20250714182231-dvf7buahgwdmcmg7.southeastasia-01.azurewebsites.net/api/Sach/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setPreviewImage(result.imageUrl);
        onImageUpload(result.imageUrl);
      } else {
        const error = await response.text();
        alert(`Lỗi upload: ${error}`);
      }
    } catch (error) {
      console.error('Lỗi upload hình ảnh:', error);
      alert('Có lỗi xảy ra khi upload hình ảnh');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    onImageUpload('');
  };

  return (
    <div className="book-cover-upload">
      <label className="upload-label">Hình ảnh bìa sách</label>
      
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewImage ? (
          <div className="image-preview">
            <img
              src={previewImage}
              alt="Bìa sách"
              className="preview-image"
            />
            {!disabled && (
              <button
                type="button"
                className="remove-image"
                onClick={removeImage}
                title="Xóa hình ảnh"
              >
                <FaTimes />
              </button>
            )}
          </div>
        ) : (
          <div className="upload-placeholder">
            {uploading ? (
              <div className="uploading">
                <div className="spinner"></div>
                <p>Đang upload...</p>
              </div>
            ) : (
              <>
                <FaImage className="upload-icon" />
                <p className="upload-text">
                  Kéo thả hình ảnh vào đây hoặc <span className="browse-text">chọn file</span>
                </p>
                <p className="upload-hint">
                  Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="file-input"
                  disabled={disabled}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCoverUpload; 