import React from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * Shared Table Component
 * @param {object} props
 * @param {array} props.columns - Array of column definitions
 * @param {array} props.data - Array of data rows
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.compact - Compact table style
 * @param {React.ReactNode} props.emptyMessage - Message when no data
 * @param {string} props.className - Additional CSS classes
 */
const Table = ({
  columns = [],
  data = [],
  loading = false,
  compact = false,
  emptyMessage = 'Không có dữ liệu',
  className = '',
  ...props
}) => {
  const tableClasses = `table ${compact ? 'table-sm' : ''} ${className}`;

  if (loading) {
    return (
      <div className="table-container">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" text="Đang tải dữ liệu..." />
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className={tableClasses} {...props}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key || index}
                style={{ width: column.width }}
                className={column.className}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex}>
                {columns.map((column, colIndex) => (
                  <td
                    key={`${rowIndex}-${column.key || colIndex}`}
                    className={column.cellClassName}
                  >
                    {column.render 
                      ? column.render(row[column.key], row, rowIndex)
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Table Header component for complex headers
export const TableHeader = ({ children, className = '' }) => {
  return (
    <div className={`table-header ${className}`}>
      {children}
    </div>
  );
};

// Table Footer component for pagination, etc.
export const TableFooter = ({ children, className = '' }) => {
  return (
    <div className={`table-footer ${className}`}>
      {children}
    </div>
  );
};

// Utility functions for common column types
export const createColumn = (key, title, options = {}) => ({
  key,
  title,
  ...options
});

export const createActionColumn = (actions, title = 'Thao tác') => ({
  key: 'actions',
  title,
  width: '120px',
  render: (_, row) => (
    <div className="action-buttons">
      {actions.map((action, index) => (
        <button
          key={index}
          className={`btn btn-sm ${action.className || 'btn-ghost'}`}
          onClick={() => action.onClick(row)}
          disabled={action.disabled && action.disabled(row)}
          title={action.title}
        >
          {action.icon}
          {action.text && <span className="ml-1">{action.text}</span>}
        </button>
      ))}
    </div>
  )
});

export const createDateColumn = (key, title, format = 'dd/MM/yyyy') => ({
  key,
  title,
  render: (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('vi-VN');
  }
});

export const createNumberColumn = (key, title, options = {}) => ({
  key,
  title,
  render: (value) => {
    if (value === null || value === undefined) return '-';
    return options.currency 
      ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
      : new Intl.NumberFormat('vi-VN').format(value);
  }
});

export default Table;