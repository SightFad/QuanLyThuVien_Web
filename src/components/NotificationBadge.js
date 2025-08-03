import React from 'react';
import './NotificationBadge.css';

const NotificationBadge = ({ count, type = 'default' }) => {
  if (!count || count === 0) return null;

  return (
    <div className={`notification-badge ${type}`}>
      <span className="badge-count">{count > 99 ? '99+' : count}</span>
      <div className="badge-pulse"></div>
    </div>
  );
};

export default NotificationBadge; 