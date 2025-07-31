/**
 * Constants used throughout the application
 */

// API Endpoints
export const API_ENDPOINTS = {
  BOOKS: '/api/Sach',
  MEMBERS: '/api/DocGia',
  BORROWS: '/api/PhieuMuon',
  RETURNS: '/api/PhieuTra',
  RESERVATIONS: '/api/DatTruoc',
  FINES: '/api/TienPhat',
  USERS: '/api/Users',
  AUTH: '/api/Auth',
  DASHBOARD: '/api/Dashboard',
  REPORTS: '/api/BaoCao'
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Quản lý',
  LIBRARIAN: 'Thủ thư',
  ACCOUNTANT: 'Kế toán',
  WAREHOUSE: 'Thủ kho',
  READER: 'Độc giả'
};

// Book Status
export const BOOK_STATUS = {
  AVAILABLE: 'available',
  BORROWED: 'borrowed',
  RESERVED: 'reserved',
  MAINTENANCE: 'maintenance',
  LOST: 'lost',
  DAMAGED: 'damaged'
};

// Borrow Status
export const BORROW_STATUS = {
  ACTIVE: 'borrowed',
  RETURNED: 'returned',
  OVERDUE: 'overdue',
  RENEWED: 'renewed'
};

// Reservation Status
export const RESERVATION_STATUS = {
  PENDING: 'pending',
  NOTIFIED: 'notified',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

// Fine Status
export const FINE_STATUS = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  WAIVED: 'waived'
};

// Fine Types
export const FINE_TYPES = {
  OVERDUE: 'overdue',
  DAMAGED: 'damaged',
  LOST: 'lost'
};

// Fine Amounts (VND)
export const FINE_AMOUNTS = {
  OVERDUE_PER_DAY: 10000,
  DAMAGED_BOOK: 100000,
  LOST_BOOK: 200000
};

// Member Status
export const MEMBER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  EXPIRED: 'expired'
};

// Book Categories
export const BOOK_CATEGORIES = [
  'Khoa học tự nhiên',
  'Khoa học xã hội',
  'Văn học',
  'Lịch sử',
  'Địa lý',
  'Tâm lý học',
  'Triết học',
  'Tôn giáo',
  'Nghệ thuật',
  'Âm nhạc',
  'Thể thao',
  'Công nghệ thông tin',
  'Kinh tế',
  'Luật pháp',
  'Y học',
  'Giáo dục',
  'Ngôn ngữ',
  'Tiểu thuyết',
  'Truyện ngắn',
  'Thơ ca',
  'Sách thiếu nhi',
  'Sách tham khảo',
  'Từ điển',
  'Bách khoa toàn thư'
];

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: 'dd/MM/yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
  TIME_ONLY: 'HH:mm',
  RELATIVE: 'relative'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_PAGE_BUTTONS: 7
};

// Validation Limits
export const VALIDATION_LIMITS = {
  BOOK_TITLE_MAX: 200,
  AUTHOR_NAME_MAX: 100,
  PUBLISHER_MAX: 100,
  ISBN_LENGTH: [10, 13],
  MEMBER_NAME_MAX: 50,
  PHONE_LENGTH: [10, 11],
  EMAIL_MAX: 100,
  ADDRESS_MAX: 200,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 128,
  SEARCH_TERM_MAX: 100,
  BORROW_DAYS_DEFAULT: 14,
  BORROW_DAYS_MAX: 30,
  RENEWAL_LIMIT: 2,
  RESERVATION_LIMIT: 3
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_INFO: 'user_info',
  THEME: 'theme',
  LANGUAGE: 'language',
  RECENT_SEARCHES: 'recent_searches',
  TABLE_SETTINGS: 'table_settings',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed'
};

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// Language Options
export const LANGUAGES = {
  VI: 'vi',
  EN: 'en'
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng thử lại.',
  SERVER_ERROR: 'Lỗi server. Vui lòng liên hệ quản trị viên.',
  UNAUTHORIZED: 'Bạn không có quyền truy cập.',
  NOT_FOUND: 'Không tìm thấy dữ liệu.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ.',
  GENERIC_ERROR: 'Có lỗi xảy ra. Vui lòng thử lại.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Tạo mới thành công!',
  UPDATED: 'Cập nhật thành công!',
  DELETED: 'Xóa thành công!',
  SAVED: 'Lưu thành công!',
  SENT: 'Gửi thành công!',
  IMPORTED: 'Import thành công!',
  EXPORTED: 'Export thành công!'
};

// Animation Durations (ms)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

// Breakpoints (px)
export const BREAKPOINTS = {
  XS: 480,
  SM: 768,
  MD: 1024,
  LG: 1280,
  XL: 1536
};

// Z-index layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070
};