import { useState, useEffect } from 'react';

/**
 * Custom hook để quản lý localStorage với React state
 * @param {string} key - Key trong localStorage
 * @param {any} initialValue - Giá trị mặc định
 * @returns {[any, function]} [value, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  // Lấy giá trị từ localStorage nếu có
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Hàm set value vào cả state và localStorage
  const setValue = (value) => {
    try {
      // Cho phép value là function để tương thích với useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

/**
 * Custom hook để quản lý sessionStorage với React state
 * @param {string} key - Key trong sessionStorage
 * @param {any} initialValue - Giá trị mặc định
 * @returns {[any, function]} [value, setValue]
 */
export const useSessionStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};