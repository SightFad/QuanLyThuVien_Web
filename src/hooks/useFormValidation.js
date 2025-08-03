import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook để quản lý form validation
 * @param {object} initialValues - Giá trị ban đầu của form
 * @param {object} validationRules - Quy tắc validation
 * @returns {object} Form state và methods
 */
export const useFormValidation = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate một field cụ thể
  const validateField = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';

    // Required validation
    if (rules.required && (!value || value.toString().trim() === '')) {
      return rules.required === true ? `${name} là bắt buộc` : rules.required;
    }

    // Min length validation
    if (rules.minLength && value && value.length < rules.minLength) {
      return `${name} phải có ít nhất ${rules.minLength} ký tự`;
    }

    // Max length validation
    if (rules.maxLength && value && value.length > rules.maxLength) {
      return `${name} không được vượt quá ${rules.maxLength} ký tự`;
    }

    // Pattern validation
    if (rules.pattern && value && !rules.pattern.test(value)) {
      return rules.patternMessage || `${name} không đúng định dạng`;
    }

    // Email validation
    if (rules.email && value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        return 'Email không đúng định dạng';
      }
    }

    // Custom validation
    if (rules.custom && typeof rules.custom === 'function') {
      return rules.custom(value, values);
    }

    return '';
  }, [validationRules, values]);

  // Validate toàn bộ form
  const validateForm = useCallback(() => {
    const newErrors = {};
    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validateField, validationRules, values]);

  // Handle input change
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error khi user bắt đầu sửa
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Handle input blur
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField, values]);

  // Handle form submit
  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(validationRules).forEach(name => {
      allTouched[name] = true;
    });
    setTouched(allTouched);

    // Validate form
    const isValid = validateForm();
    
    if (isValid && onSubmit) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
    
    setIsSubmitting(false);
    return isValid;
  }, [validateForm, validationRules, values]);

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set specific field value
  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  // Set specific field error
  const setError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  // Check if form is valid
  const isValid = useMemo(() => {
    return Object.keys(errors).every(key => !errors[key]);
  }, [errors]);

  // Check if form has been modified
  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  }, [values, initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValue,
    setError,
    validateField,
    validateForm,
  };
};

// Validation rules helpers
export const validationRules = {
  required: (message) => ({ required: message || true }),
  minLength: (length, message) => ({ minLength: length, minLengthMessage: message }),
  maxLength: (length, message) => ({ maxLength: length, maxLengthMessage: message }),
  pattern: (regex, message) => ({ pattern: regex, patternMessage: message }),
  email: (message) => ({ email: true, emailMessage: message }),
  custom: (validator) => ({ custom: validator }),
};