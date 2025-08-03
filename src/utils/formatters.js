/**
 * Utility functions cho formatting dữ liệu
 */

// Format tiền tệ VND
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 ₫';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Format số thành chuỗi có dấu phẩy
export const formatNumber = (number) => {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }
  return new Intl.NumberFormat('vi-VN').format(number);
};

// Format ngày tháng
export const formatDate = (date, format = 'dd/MM/yyyy') => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  switch (format) {
    case 'dd/MM/yyyy':
      return `${day}/${month}/${year}`;
    case 'MM/dd/yyyy':
      return `${month}/${day}/${year}`;
    case 'yyyy-MM-dd':
      return `${year}-${month}-${day}`;
    case 'dd/MM/yyyy HH:mm':
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    case 'relative':
      return formatRelativeTime(d);
    default:
      return d.toLocaleDateString('vi-VN');
  }
};

// Format thời gian tương đối (vd: "2 giờ trước")
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return formatDate(date);
  } else if (days > 0) {
    return `${days} ngày trước`;
  } else if (hours > 0) {
    return `${hours} giờ trước`;
  } else if (minutes > 0) {
    return `${minutes} phút trước`;
  } else {
    return 'Vừa xong';
  }
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as Vietnamese phone number
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  } else if (cleaned.length === 11 && cleaned.startsWith('84')) {
    return '+84 ' + cleaned.slice(2).replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  
  return phone;
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Format book ID (pad with zeros)
export const formatBookId = (id, length = 6) => {
  if (!id) return '';
  return String(id).padStart(length, '0');
};

// Format member ID
export const formatMemberId = (id) => {
  if (!id) return '';
  return `TV${String(id).padStart(4, '0')}`;
};

// Format status text
export const formatStatus = (status) => {
  const statusMap = {
    'active': 'Hoạt động',
    'inactive': 'Không hoạt động',
    'pending': 'Chờ xử lý',
    'completed': 'Hoàn thành',
    'cancelled': 'Đã hủy',
    'processing': 'Đang xử lý',
    'overdue': 'Quá hạn',
    'borrowed': 'Đang mượn',
    'returned': 'Đã trả',
    'reserved': 'Đã đặt trước',
    'available': 'Có sẵn',
    'unavailable': 'Không có sẵn'
  };
  
  return statusMap[status] || status;
};

// Format boolean as Yes/No
export const formatBoolean = (value) => {
  return value ? 'Có' : 'Không';
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  return `${value.toFixed(decimals)}%`;
};