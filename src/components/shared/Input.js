import React from 'react';
import './Input.css';

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  readOnly = false,
  required = false,
  name,
  id,
  className = '',
  error,
  label,
  helperText,
  size = 'md',
  ...props
}) => {
  const inputId = id || name;
  
  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        className={`input-field input-${size} ${error ? 'input-error' : ''}`}
        {...props}
      />
      
      {error && <div className="input-error-message">{error}</div>}
      {helperText && !error && <div className="input-helper-text">{helperText}</div>}
    </div>
  );
};

export default Input; 