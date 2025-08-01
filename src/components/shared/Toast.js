import React, { useState, useEffect } from 'react';
import { FaCheck, FaExclamationTriangle, FaInfo, FaTimes } from 'react-icons/fa';
import './Toast.css';

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose, 
  position = 'top-right',
  show = false 
}) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose && onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheck />;
      case 'error':
        return <FaExclamationTriangle />;
      case 'warning':
        return <FaExclamationTriangle />;
      default:
        return <FaInfo />;
    }
  };

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'toast-success';
      case 'error':
        return 'toast-error';
      case 'warning':
        return 'toast-warning';
      default:
        return 'toast-info';
    }
  };

  return (
    <div className={`toast-container toast-${position}`}>
      <div className={`toast ${getTypeClass()}`}>
        <div className="toast-icon">
          {getIcon()}
        </div>
        <div className="toast-content">
          <div className="toast-message">{message}</div>
        </div>
        <button 
          className="toast-close" 
          onClick={() => {
            setIsVisible(false);
            onClose && onClose();
          }}
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default Toast; 