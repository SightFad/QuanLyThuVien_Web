import React from 'react';

/**
 * Loading Spinner Component
 * @param {object} props
 * @param {string} props.size - Size of spinner: 'sm', 'md', 'lg'
 * @param {string} props.color - Color theme: 'primary', 'secondary', 'white'
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.overlay - Show as overlay
 * @param {string} props.text - Loading text
 */
const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  className = '', 
  overlay = false,
  text = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  };

  const colorClasses = {
    primary: 'border-gray-200 border-t-blue-600',
    secondary: 'border-gray-200 border-t-gray-600',
    white: 'border-gray-400 border-t-white'
  };

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]} 
        rounded-full animate-spin
      `} />
      {text && (
        <span className="mt-2 text-sm text-gray-600">{text}</span>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          {spinnerContent}
        </div>
      </div>
    );
  }

  return spinnerContent;
};

// Loading overlay cho components
export const LoadingOverlay = ({ loading, children, text = 'Đang tải...' }) => {
  return (
    <div className="relative">
      {children}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <LoadingSpinner size="lg" text={text} />
        </div>
      )}
    </div>
  );
};

// Loading state cho toàn trang
export const PageLoading = ({ text = 'Đang tải trang...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};

export default LoadingSpinner;