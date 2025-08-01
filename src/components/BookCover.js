import React, { useState } from 'react';
import './BookCover.css';

const BookCover = ({ src, alt, title, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  const getFallbackImage = () => {
    // Tạo hình ảnh fallback dựa trên title
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#f5576c',
      '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
      '#fa709a', '#fee140', '#a8edea', '#fed6e3'
    ];
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const initials = title ? title.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) : 'BK';
    
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="300" fill="${randomColor}"/>
        <text x="100" y="150" font-family="Arial, sans-serif" font-size="48" 
              fill="white" text-anchor="middle" dominant-baseline="middle">
          ${initials}
        </text>
        <text x="100" y="200" font-family="Arial, sans-serif" font-size="16" 
              fill="white" text-anchor="middle" dominant-baseline="middle">
          ${title || 'Book Cover'}
        </text>
      </svg>
    `)}`;
  };

  return (
    <div className={`book-cover ${className} ${isLoading ? 'loading' : ''}`}>
      {isLoading && (
        <div className="book-cover-skeleton">
          <div className="skeleton-animation"></div>
        </div>
      )}
      
      <img
        src={imageError ? getFallbackImage() : (src || getFallbackImage())}
        alt={alt || title || 'Book Cover'}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`book-cover-image ${imageError ? 'fallback' : ''}`}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </div>
  );
};

export default BookCover; 