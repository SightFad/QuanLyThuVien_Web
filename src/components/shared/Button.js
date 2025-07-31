import React from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * Shared Button Component
 * @param {object} props
 * @param {string} props.variant - Button variant: 'primary', 'secondary', 'success', 'warning', 'danger', 'info', 'outline-primary', etc.
 * @param {string} props.size - Button size: 'sm', 'md', 'lg', 'xl'
 * @param {boolean} props.loading - Show loading state
 * @param {boolean} props.disabled - Disabled state
 * @param {React.ReactNode} props.icon - Icon element
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 * @param {function} props.onClick - Click handler
 * @param {string} props.type - Button type
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon = null,
  children,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClasses = `btn-${variant}`;
  const sizeClasses = size !== 'md' ? `btn-${size}` : '';
  
  const isDisabled = disabled || loading;

  const handleClick = (e) => {
    if (!isDisabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      disabled={isDisabled}
      onClick={handleClick}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" color="white" />
          {children && <span>Đang xử lý...</span>}
        </>
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

// Specialized button variants
export const PrimaryButton = (props) => <Button {...props} variant="primary" />;
export const SecondaryButton = (props) => <Button {...props} variant="secondary" />;
export const SuccessButton = (props) => <Button {...props} variant="success" />;
export const WarningButton = (props) => <Button {...props} variant="warning" />;
export const DangerButton = (props) => <Button {...props} variant="danger" />;
export const InfoButton = (props) => <Button {...props} variant="info" />;

export const OutlinePrimaryButton = (props) => <Button {...props} variant="outline-primary" />;
export const OutlineSecondaryButton = (props) => <Button {...props} variant="outline-secondary" />;

export const GhostButton = (props) => <Button {...props} variant="ghost" />;

export default Button;