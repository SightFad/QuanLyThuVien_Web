import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  className = '', 
  title, 
  subtitle, 
  headerActions,
  footer,
  padding = 'p-4',
  shadow = 'shadow-sm',
  border = 'border',
  ...props 
}) => {
  return (
    <div 
      className={`card ${shadow} ${border} ${padding} ${className}`}
      {...props}
    >
      {(title || subtitle || headerActions) && (
        <div className="card-header">
          <div className="card-title-section">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {headerActions && (
            <div className="card-header-actions">
              {headerActions}
            </div>
          )}
        </div>
      )}
      
      <div className="card-body">
        {children}
      </div>
      
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 