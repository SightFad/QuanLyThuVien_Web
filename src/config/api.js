// API Configuration
const API_CONFIG = {
  BASE_URL: 'http://localhost:5280',
  ENDPOINTS: {
    LOGIN: '/api/Auth/login',
    LOGOUT: '/api/Auth/logout',
    USERS: '/api/Users',
    BOOKS: '/api/Books',
    READERS: '/api/Readers',
    BORROWS: '/api/Borrows',
    FINES: '/api/Fines',
    REPORTS: '/api/Reports'
  },
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3
};

// API Helper Functions
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    timeout: API_CONFIG.TIMEOUT
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, finalOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Mock data for fallback
export const MOCK_DATA = {
  users: {
    'admin': { username: 'admin', role: 'Quản trị viên', email: 'admin@library.com' },
    'librarian': { username: 'librarian', role: 'Thủ thư', email: 'librarian@library.com' },
    'reader': { username: 'reader', role: 'Độc giả', email: 'reader@library.com' },
    'accountant': { username: 'accountant', role: 'Kế toán', email: 'accountant@library.com' },
    'warehouse': { username: 'warehouse', role: 'Nhân viên kho sách', email: 'warehouse@library.com' }
  },
  books: [
    {
      id: 1,
      title: 'Đắc Nhân Tâm',
      author: 'Dale Carnegie',
      category: 'Kỹ năng sống',
      shelf: 'Kệ A1',
      status: 'Có sẵn',
      coverImage: '/images/book-covers/python.jpg',
      description: 'Cuốn sách kinh điển về nghệ thuật đối nhân xử thế và kỹ năng giao tiếp.',
      publishedYear: 1936,
      isbn: '978-0-671-02703-2'
    },
    {
      id: 2,
      title: 'Nhà Giả Kim',
      author: 'Paulo Coelho',
      category: 'Tiểu thuyết',
      shelf: 'Kệ B2',
      status: 'Có sẵn',
      coverImage: '/images/book-covers/ml.jpg',
      description: 'Câu chuyện về hành trình tìm kiếm kho báu và ý nghĩa cuộc sống.',
      publishedYear: 1988,
      isbn: '978-0-06-231500-7'
    },
    {
      id: 3,
      title: 'React Programming',
      author: 'John Doe',
      category: 'Công nghệ',
      shelf: 'Kệ C3',
      status: 'Đã mượn',
      coverImage: '/images/book-covers/react.jpg',
      description: 'Hướng dẫn chi tiết về React.js và các best practices.',
      publishedYear: 2023,
      isbn: '978-1-234-56789-0'
    },
    {
      id: 4,
      title: 'Database Design',
      author: 'Jane Smith',
      category: 'Công nghệ',
      shelf: 'Kệ D4',
      status: 'Có sẵn',
      coverImage: '/images/book-covers/database.jpg',
      description: 'Nguyên lý thiết kế cơ sở dữ liệu và tối ưu hóa hiệu suất.',
      publishedYear: 2022,
      isbn: '978-0-987-65432-1'
    },
    {
      id: 5,
      title: 'Web Development',
      author: 'Mike Johnson',
      category: 'Công nghệ',
      shelf: 'Kệ E5',
      status: 'Đã đặt',
      coverImage: '/images/book-covers/web.jpg',
      description: 'Toàn diện về phát triển web hiện đại với các công nghệ mới nhất.',
      publishedYear: 2023,
      isbn: '978-5-432-10987-6'
    }
  ]
};

export default API_CONFIG; 