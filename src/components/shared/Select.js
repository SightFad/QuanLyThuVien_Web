import React from 'react';
import './Select.css';

const Select = ({
  options = [],
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  required = false,
  name,
  id,
  className = '',
  error,
  label,
  helperText,
  placeholder = 'Chọn một tùy chọn',
  size = 'md',
  ...props
}) => {
  const selectId = id || name;
  
  return (
    <div className={`select-wrapper ${className}`}>
      {label && (
        <label htmlFor={selectId} className="select-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        required={required}
        className={`select-field select-${size} ${error ? 'select-error' : ''}`}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && <div className="select-error-message">{error}</div>}
      {helperText && !error && <div className="select-helper-text">{helperText}</div>}
    </div>
  );
};

export default Select; 