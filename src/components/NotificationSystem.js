import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  FaBell, 
  FaTimes, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaExclamationCircle,
  FaCog,
  FaEye,
  FaEyeSlash,
  FaTrash,
  FaDownload
} from 'react-icons/fa';
import './NotificationSystem.css';

// Context for notifications
const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Notification Provider Component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [settings, setSettings] = useState({
    soundEnabled: true,
    desktopNotifications: true,
    autoHide: true,
    autoHideDelay: 5000
  });

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    const savedSettings = localStorage.getItem('notificationSettings');
    
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      setNotifications(parsed);
      setUnreadCount(parsed.filter(n => !n.read).length);
    }
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [notifications, settings]);

  // Add notification function
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep only last 50
    setUnreadCount(prev => prev + 1);

    // Auto-hide notification if enabled
    if (settings.autoHide && notification.type !== 'error') {
      setTimeout(() => {
        markAsRead(newNotification.id);
      }, settings.autoHideDelay);
    }

    // Play sound if enabled
    if (settings.soundEnabled) {
      playNotificationSound(notification.type);
    }

    // Show desktop notification if enabled
    if (settings.desktopNotifications && 'Notification' in window) {
      showDesktopNotification(notification);
    }

    return newNotification.id;
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      const newNotifications = prev.filter(n => n.id !== id);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      return newNotifications;
    });
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Play notification sound
  const playNotificationSound = (type) => {
    try {
      const audio = new Audio();
      switch (type) {
        case 'success':
          audio.src = '/sounds/notification-success.mp3';
          break;
        case 'warning':
          audio.src = '/sounds/notification-warning.mp3';
          break;
        case 'error':
          audio.src = '/sounds/notification-error.mp3';
          break;
        default:
          audio.src = '/sounds/notification-info.mp3';
      }
      audio.play().catch(() => {
        // Fallback: use system beep
        console.log('\u0007');
      });
    } catch (error) {
      console.log('Could not play notification sound');
    }
  };

  // Show desktop notification
  const showDesktopNotification = (notification) => {
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: notification.id,
        requireInteraction: notification.type === 'error'
      });
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showDesktopNotification(notification);
        }
      });
    }
  };

  // Update settings
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Export notifications
  const exportNotifications = () => {
    const dataStr = JSON.stringify(notifications, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notifications-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const value = {
    notifications,
    unreadCount,
    showPanel,
    settings,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updateSettings,
    exportNotifications,
    setShowPanel
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Notification Bell Component
export const NotificationBell = () => {
  const { unreadCount, showPanel, setShowPanel } = useNotifications();

  return (
    <div className="notification-bell">
      <button 
        className="bell-button"
        onClick={() => setShowPanel(!showPanel)}
        title="Thông báo"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

// Notification Panel Component
export const NotificationPanel = () => {
  const {
    notifications,
    unreadCount,
    showPanel,
    settings,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updateSettings,
    exportNotifications,
    setShowPanel
  } = useNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="notification-icon success" />;
      case 'warning':
        return <FaExclamationTriangle className="notification-icon warning" />;
      case 'error':
        return <FaExclamationCircle className="notification-icon error" />;
      default:
        return <FaInfoCircle className="notification-icon info" />;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return notificationTime.toLocaleDateString('vi-VN');
  };

  if (!showPanel) return null;

  return (
    <div className="notification-panel">
      <div className="panel-header">
        <h3>Thông báo</h3>
        <div className="panel-actions">
          {unreadCount > 0 && (
            <button 
              className="action-btn"
              onClick={markAllAsRead}
              title="Đánh dấu tất cả đã đọc"
            >
              <FaEye />
            </button>
          )}
          <button 
            className="action-btn"
            onClick={exportNotifications}
            title="Xuất thông báo"
          >
            <FaDownload />
          </button>
          <button 
            className="action-btn"
            onClick={() => setShowPanel(false)}
            title="Đóng"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      <div className="panel-content">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <FaBell className="empty-icon" />
            <p>Không có thông báo nào</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="notification-icon-wrapper">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <h4 className="notification-title">{notification.title}</h4>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">
                    {formatTime(notification.timestamp)}
                  </span>
                </div>
                <button 
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  title="Xóa thông báo"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="panel-footer">
          <button 
            className="clear-btn"
            onClick={clearAllNotifications}
          >
            Xóa tất cả
          </button>
          <button 
            className="settings-btn"
            onClick={() => updateSettings({ showSettings: true })}
          >
            <FaCog />
            Cài đặt
          </button>
        </div>
      )}
    </div>
  );
};

// Toast Notification Component
export const ToastNotification = ({ notification, onClose }) => {
  const { settings } = useNotifications();

  useEffect(() => {
    if (settings.autoHide && notification.type !== 'error') {
      const timer = setTimeout(onClose, settings.autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [notification, settings, onClose]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle />;
      case 'warning':
        return <FaExclamationTriangle />;
      case 'error':
        return <FaExclamationCircle />;
      default:
        return <FaInfoCircle />;
    }
  };

  return (
    <div className={`toast-notification ${notification.type}`}>
      <div className="toast-icon">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="toast-content">
        <h4 className="toast-title">{notification.title}</h4>
        <p className="toast-message">{notification.message}</p>
      </div>
      <button className="toast-close" onClick={onClose}>
        <FaTimes />
      </button>
    </div>
  );
};

// Toast Container Component
export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (notification) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { ...notification, id }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Listen for toast notifications
  useEffect(() => {
    const handleToast = (event) => {
      addToast(event.detail);
    };

    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <ToastNotification
          key={toast.id}
          notification={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default NotificationSystem; 