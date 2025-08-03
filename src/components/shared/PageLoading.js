import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import './PageLoading.css';

const PageLoading = ({ text = 'Đang tải...', size = 'md' }) => {
  return (
    <div className={`page-loading size-${size}`}>
      <div className="loading-spinner">
        <FaSpinner className="spinner-icon" />
      </div>
      {text && <div className="loading-text">{text}</div>}
    </div>
  );
};

export default PageLoading; 