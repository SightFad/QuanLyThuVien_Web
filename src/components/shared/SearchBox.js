import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useDebounce } from '../../hooks';

/**
 * Shared SearchBox Component
 * @param {object} props
 * @param {string} props.value - Search value
 * @param {function} props.onChange - Change handler
 * @param {function} props.onSearch - Search handler (triggered after debounce)
 * @param {string} props.placeholder - Placeholder text
 * @param {number} props.debounceMs - Debounce delay in milliseconds
 * @param {boolean} props.clearable - Show clear button
 * @param {string} props.className - Additional CSS classes
 */
const SearchBox = ({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Tìm kiếm...',
  debounceMs = 300,
  clearable = true,
  className = '',
  ...props
}) => {
  const [searchValue, setSearchValue] = useState(value);
  const debouncedSearchValue = useDebounce(searchValue, debounceMs);

  // Sync với prop value
  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  // Trigger search sau khi debounce
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchValue);
    }
  }, [debouncedSearchValue, onSearch]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleClear = () => {
    setSearchValue('');
    if (onChange) {
      onChange('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(searchValue);
    }
  };

  return (
    <div className={`search-box ${className}`}>
      <div className="relative">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          value={searchValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          {...props}
        />
        {clearable && searchValue && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={handleClear}
          >
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
};

// Advanced SearchBox with filters
export const AdvancedSearchBox = ({
  value = '',
  onChange,
  onSearch,
  filters = [],
  selectedFilters = {},
  onFilterChange,
  placeholder = 'Tìm kiếm...',
  debounceMs = 300,
  className = ''
}) => {
  return (
    <div className={`search-filters ${className}`}>
      <SearchBox
        value={value}
        onChange={onChange}
        onSearch={onSearch}
        placeholder={placeholder}
        debounceMs={debounceMs}
      />
      
      {filters.length > 0 && (
        <div className="filter-group">
          {filters.map((filter) => (
            <select
              key={filter.key}
              className="filter-select"
              value={selectedFilters[filter.key] || ''}
              onChange={(e) => onFilterChange(filter.key, e.target.value)}
            >
              <option value="">{filter.placeholder || `Chọn ${filter.label}`}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;