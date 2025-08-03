import React from 'react';

// Page Header Component
export const PageHeader = ({ title, subtitle, children }) => (
  <div className="page-header">
    <div className="page-header-content">
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
      {children}
    </div>
  </div>
);

// Stat Card Component
export const StatCard = ({ icon, title, value, subtitle, color = '#667eea', colorLight = '#764ba2', bgColor = 'rgba(102, 126, 234, 0.1)' }) => (
  <div 
    className="stat-card" 
    style={{ 
      '--stat-color': color, 
      '--stat-color-light': colorLight, 
      '--stat-bg': bgColor 
    }}
  >
    <div className="stat-card-header">
      <div className="stat-icon">
        {icon}
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </div>
  </div>
);

// Content Section Component
export const ContentSection = ({ title, icon, actions, children }) => (
  <div className="content-section">
    <div className="section-header">
      <h2 className="section-title">
        {icon} {title}
      </h2>
      {actions && <div className="section-actions">{actions}</div>}
    </div>
    {children}
  </div>
);

// Card Component
export const Card = ({ icon, title, subtitle, children, onClick, className = '' }) => {
  const CardContent = (
    <div className={`card ${className}`}>
      {(icon || title) && (
        <div className="card-header">
          {icon && <div className="card-icon">{icon}</div>}
          {title && <h3 className="card-title">{title}</h3>}
        </div>
      )}
      {subtitle && <p className="text-muted mb-2">{subtitle}</p>}
      <div className="card-content">
        {children}
      </div>
    </div>
  );

  if (onClick) {
    return (
      <div onClick={onClick} style={{ cursor: 'pointer' }}>
        {CardContent}
      </div>
    );
  }

  return CardContent;
};

// Table Component
export const Table = ({ title, headers, children, className = '' }) => (
  <div className={`table-container ${className}`}>
    {title && (
      <div className="table-header">
        <h3 className="table-title">{title}</h3>
      </div>
    )}
    <table className="table">
      {headers && (
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {children}
      </tbody>
    </table>
  </div>
);

// Form Container Component
export const FormContainer = ({ title, subtitle, children }) => (
  <div className="form-container">
    {(title || subtitle) && (
      <div className="form-header">
        {title && <h2 className="form-title">{title}</h2>}
        {subtitle && <p className="form-subtitle">{subtitle}</p>}
      </div>
    )}
    {children}
  </div>
);

// Form Group Component
export const FormGroup = ({ label, children, className = '' }) => (
  <div className={`form-group ${className}`}>
    {label && <label className="form-label">{label}</label>}
    {children}
  </div>
);

// Button Component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  onClick, 
  className = '', 
  disabled = false,
  type = 'button',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  return (
    <button
      type={type}
      className={`btn btn-${variant} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && icon}
      {children}
    </button>
  );
};

// Badge Component
export const Badge = ({ children, variant = 'info', icon, className = '' }) => (
  <span className={`badge badge-${variant} ${className}`}>
    {icon && icon}
    {children}
  </span>
);

// Empty State Component
export const EmptyState = ({ icon, title, description, action }) => (
  <div className="empty-state">
    {icon && <div className="empty-state-icon">{icon}</div>}
    {title && <h3>{title}</h3>}
    {description && <p>{description}</p>}
    {action && action}
  </div>
);

// Loading Component
export const Loading = ({ message = 'Đang tải...' }) => (
  <div className="loading-container">
    <div className="spinner"></div>
    {message && <p className="mt-3">{message}</p>}
  </div>
);

// Grid Components
export const StatsGrid = ({ children, className = '' }) => (
  <div className={`stats-grid ${className}`}>
    {children}
  </div>
);

export const CardsGrid = ({ children, className = '' }) => (
  <div className={`cards-grid ${className}`}>
    {children}
  </div>
);

export const FormRow = ({ children, className = '' }) => (
  <div className={`form-row ${className}`}>
    {children}
  </div>
);

// Utility Components
export const Flex = ({ children, direction = 'row', align = 'start', justify = 'start', gap = 0, className = '' }) => {
  const flexClasses = [
    'flex',
    direction === 'col' ? 'flex-col' : '',
    `items-${align}`,
    `justify-${justify}`,
    gap > 0 ? `gap-${gap}` : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={flexClasses}>
      {children}
    </div>
  );
};

export const Text = ({ children, size = 'base', weight = 'normal', color = 'default', className = '' }) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: '',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const weightClasses = {
    normal: '',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const colorClasses = {
    default: '',
    muted: 'text-muted',
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger'
  };

  const classes = [
    sizeClasses[size],
    weightClasses[weight],
    colorClasses[color],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {children}
    </span>
  );
}; 