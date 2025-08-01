import React from 'react';
import './Badge.css';

/**
 * Shared Badge Component
 * @param {object} props
 * @param {string} props.variant - Badge variant: 'primary', 'secondary', 'success', 'warning', 'danger', 'info'
 * @param {React.ReactNode} props.children - Badge content
 * @param {React.ReactNode} props.icon - Icon element
 * @param {string} props.className - Additional CSS classes
 */
const Badge = ({
  variant = 'primary',
  children,
  icon = null,
  className = '',
  ...props
}) => {
  const baseClasses = 'badge';
  const variantClasses = `badge-${variant}`;

  return (
    <span 
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {icon && <span className="badge-icon">{icon}</span>}
      {children}
    </span>
  );
};

// Specialized badge variants
export const PrimaryBadge = (props) => <Badge {...props} variant="primary" />;
export const SecondaryBadge = (props) => <Badge {...props} variant="secondary" />;
export const SuccessBadge = (props) => <Badge {...props} variant="success" />;
export const WarningBadge = (props) => <Badge {...props} variant="warning" />;
export const DangerBadge = (props) => <Badge {...props} variant="danger" />;
export const InfoBadge = (props) => <Badge {...props} variant="info" />;

// Status badges với icon sẵn
export const StatusBadge = ({ status, ...props }) => {
  const statusConfig = {
    active: { variant: 'success', text: 'Hoạt động' },
    inactive: { variant: 'secondary', text: 'Không hoạt động' },
    pending: { variant: 'warning', text: 'Chờ xử lý' },
    completed: { variant: 'success', text: 'Hoàn thành' },
    cancelled: { variant: 'danger', text: 'Đã hủy' },
    processing: { variant: 'info', text: 'Đang xử lý' },
    overdue: { variant: 'danger', text: 'Quá hạn' },
    borrowed: { variant: 'warning', text: 'Đang mượn' },
    returned: { variant: 'success', text: 'Đã trả' },
    reserved: { variant: 'info', text: 'Đã đặt trước' },
    // Book status configurations
    available: { variant: 'success', text: 'Có sẵn' },
    maintenance: { variant: 'warning', text: 'Bảo trì' },
    lost: { variant: 'danger', text: 'Mất' },
    damaged: { variant: 'danger', text: 'Hỏng' },
  };

  const config = statusConfig[status] || { variant: 'secondary', text: status };

  return (
    <Badge variant={config.variant} {...props}>
      {config.text}
    </Badge>
  );
};

export default Badge;