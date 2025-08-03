/**
 * Utility functions cho validation
 */

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Vietnamese)
export const isValidPhoneNumber = (phone) => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Check Vietnamese phone patterns
  const patterns = [
    /^0[3|5|7|8|9]\d{8}$/, // Mobile: 03x, 05x, 07x, 08x, 09x
    /^84[3|5|7|8|9]\d{8}$/, // International format
    /^02[4|8]\d{8}$/, // Landline Hanoi/HCMC
    /^02[0-9]\d{8}$/ // Other landlines
  ];
  
  return patterns.some(pattern => pattern.test(cleaned));
};

// Validate ISBN
export const isValidISBN = (isbn) => {
  if (!isbn) return false;
  
  // Remove hyphens and spaces
  const cleaned = isbn.replace(/[-\s]/g, '');
  
  // Check length (ISBN-10 or ISBN-13)
  if (cleaned.length !== 10 && cleaned.length !== 13) {
    return false;
  }
  
  // Validate ISBN-10
  if (cleaned.length === 10) {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      if (!/\d/.test(cleaned[i])) return false;
      sum += parseInt(cleaned[i]) * (10 - i);
    }
    const checkDigit = cleaned[9].toUpperCase();
    const expectedCheckDigit = (11 - (sum % 11)) % 11;
    return checkDigit === (expectedCheckDigit === 10 ? 'X' : expectedCheckDigit.toString());
  }
  
  // Validate ISBN-13
  if (cleaned.length === 13) {
    if (!/^\d{13}$/.test(cleaned)) return false;
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleaned[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = parseInt(cleaned[12]);
    const expectedCheckDigit = (10 - (sum % 10)) % 10;
    return checkDigit === expectedCheckDigit;
  }
  
  return false;
};

// Validate required field
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

// Validate min length
export const minLength = (value, min) => {
  if (!value) return false;
  return value.toString().length >= min;
};

// Validate max length
export const maxLength = (value, max) => {
  if (!value) return true;
  return value.toString().length <= max;
};

// Validate number range
export const isInRange = (value, min, max) => {
  const num = Number(value);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
};

// Validate positive number
export const isPositiveNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

// Validate integer
export const isInteger = (value) => {
  return Number.isInteger(Number(value));
};

// Validate date
export const isValidDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

// Validate future date
export const isFutureDate = (date) => {
  if (!isValidDate(date)) return false;
  return new Date(date) > new Date();
};

// Validate past date
export const isPastDate = (date) => {
  if (!isValidDate(date)) return false;
  return new Date(date) < new Date();
};

// Validate date range
export const isDateInRange = (date, startDate, endDate) => {
  if (!isValidDate(date) || !isValidDate(startDate) || !isValidDate(endDate)) {
    return false;
  }
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return d >= start && d <= end;
};

// Validate Vietnamese name
export const isValidVietnameseName = (name) => {
  if (!name) return false;
  // Allow Vietnamese characters, spaces, and common punctuation
  const vietnameseRegex = /^[a-zA-ZÀ-ỹĂ-ỹĐđ\s\.\-\']+$/;
  return vietnameseRegex.test(name.trim());
};

// Validate strong password
export const isStrongPassword = (password) => {
  if (!password || password.length < 8) return false;
  
  // Check for at least one lowercase, one uppercase, one digit, and one special character
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return hasLowerCase && hasUpperCase && hasDigit && hasSpecialChar;
};

// Validate URL
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate card number (basic Luhn algorithm)
export const isValidCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit = digit % 10 + 1;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Create validation rule
export const createValidationRule = (validators, errorMessage) => {
  return (value) => {
    for (const validator of validators) {
      if (!validator(value)) {
        return errorMessage;
      }
    }
    return '';
  };
};

// Common validation rules
export const validationRules = {
  required: (message = 'Trường này là bắt buộc') => 
    createValidationRule([isRequired], message),
  
  email: (message = 'Email không hợp lệ') => 
    createValidationRule([isValidEmail], message),
  
  phoneNumber: (message = 'Số điện thoại không hợp lệ') => 
    createValidationRule([isValidPhoneNumber], message),
  
  isbn: (message = 'ISBN không hợp lệ') => 
    createValidationRule([isValidISBN], message),
  
  positiveNumber: (message = 'Phải là số dương') => 
    createValidationRule([isPositiveNumber], message),
  
  strongPassword: (message = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt') => 
    createValidationRule([isStrongPassword], message),
  
  minLength: (min, message) => 
    createValidationRule([(value) => minLength(value, min)], message || `Tối thiểu ${min} ký tự`),
  
  maxLength: (max, message) => 
    createValidationRule([(value) => maxLength(value, max)], message || `Tối đa ${max} ký tự`),
  
  range: (min, max, message) => 
    createValidationRule([(value) => isInRange(value, min, max)], message || `Giá trị phải từ ${min} đến ${max}`)
};