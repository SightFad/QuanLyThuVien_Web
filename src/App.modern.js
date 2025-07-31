import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ModernSidebar from './components/ModernSidebar';
import ModernDashboard from './pages/ModernDashboard';
import { PageLoading } from './components/shared';
import './index.css';

// Mock user data - replace with real authentication
const mockUser = {
  id: 1,
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@email.com',
  role: 'Admin', // Admin, Độc giả, Thủ thư, Kế toán, Thủ kho, Quản lý
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
};

// Lazy load components for better performance
const BookManagement = React.lazy(() => import('./pages/BookManagement'));
const ReaderManagement = React.lazy(() => import('./pages/ReaderManagement'));
const BorrowManagement = React.lazy(() => import('./pages/BorrowManagement'));
const UserManagement = React.lazy(() => import('./pages/UserManagement'));
const SystemSettings = React.lazy(() => import('./pages/SystemSettings'));
const BackupManagement = React.lazy(() => import('./pages/BackupManagement'));

// Reader pages
const ReaderHome = React.lazy(() => import('./pages/reader/ReaderHome'));
const ReaderSearch = React.lazy(() => import('./pages/reader/ReaderSearch'));
const ReaderMyBooks = React.lazy(() => import('./pages/reader/ReaderMyBooks'));
const ReaderHistory = React.lazy(() => import('./pages/reader/ReaderHistory'));
const ReaderProfile = React.lazy(() => import('./pages/reader/ReaderProfile'));
const ReaderReservations = React.lazy(() => import('./pages/reader/ReaderReservations'));
const ReaderFines = React.lazy(() => import('./pages/reader/ReaderFines'));

// Librarian pages
const LibrarianDashboard = React.lazy(() => import('./pages/librarian/LibrarianDashboard'));
const LibrarianReports = React.lazy(() => import('./pages/librarian/LibrarianReports'));
const ReservationManagement = React.lazy(() => import('./pages/librarian/ReservationManagement'));

// Accountant pages
const AccountantDashboard = React.lazy(() => import('./pages/accountant/AccountantDashboard'));
const FinancialTransactions = React.lazy(() => import('./pages/accountant/FinancialTransactions'));
const PurchaseProposals = React.lazy(() => import('./pages/accountant/PurchaseProposals'));
const PurchaseOrders = React.lazy(() => import('./pages/accountant/PurchaseOrders'));
const SupplierManagement = React.lazy(() => import('./pages/accountant/SupplierManagement'));
const FinancialReports = React.lazy(() => import('./pages/accountant/FinancialReports'));

// Manager pages
const ManagerDashboard = React.lazy(() => import('./pages/manager/ManagerDashboard'));
const ManagerApprovals = React.lazy(() => import('./pages/manager/ManagerApprovals'));

// Warehouse pages
const WarehouseDashboard = React.lazy(() => import('./pages/warehouse/WarehouseDashboard'));
const InventoryManagement = React.lazy(() => import('./pages/warehouse/InventoryManagement'));
const StockReports = React.lazy(() => import('./pages/warehouse/StockReports'));
const BookImports = React.lazy(() => import('./pages/warehouse/BookImports'));
const InventoryChecks = React.lazy(() => import('./pages/warehouse/InventoryChecks'));

// Route configurations by role
const routeConfig = {
  'Admin': [
    { path: '/', component: ModernDashboard, exact: true },
    { path: '/books', component: BookManagement },
    { path: '/readers', component: ReaderManagement },
    { path: '/borrows', component: BorrowManagement },
    { path: '/users', component: UserManagement },
    { path: '/settings', component: SystemSettings },
    { path: '/backup', component: BackupManagement },
  ],
  'Độc giả': [
    { path: '/reader', component: ReaderHome, exact: true },
    { path: '/reader/search', component: ReaderSearch },
    { path: '/reader/my-books', component: ReaderMyBooks },
    { path: '/reader/reservations', component: ReaderReservations },
    { path: '/reader/history', component: ReaderHistory },
    { path: '/reader/profile', component: ReaderProfile },
    { path: '/reader/fines', component: ReaderFines },
  ],
  'Thủ thư': [
    { path: '/librarian', component: LibrarianDashboard, exact: true },
    { path: '/books', component: BookManagement },
    { path: '/borrows', component: BorrowManagement },
    { path: '/librarian/reservations', component: ReservationManagement },
    { path: '/librarian/reports', component: LibrarianReports },
  ],
  'Kế toán': [
    { path: '/accountant', component: AccountantDashboard, exact: true },
    { path: '/accountant/transactions', component: FinancialTransactions },
    { path: '/accountant/purchase-proposals', component: PurchaseProposals },
    { path: '/accountant/purchase-orders', component: PurchaseOrders },
    { path: '/accountant/suppliers', component: SupplierManagement },
    { path: '/accountant/reports', component: FinancialReports },
  ],
  'Thủ kho': [
    { path: '/warehouse', component: WarehouseDashboard, exact: true },
    { path: '/warehouse/inventory', component: InventoryManagement },
    { path: '/warehouse/imports', component: BookImports },
    { path: '/warehouse/checks', component: InventoryChecks },
    { path: '/warehouse/reports', component: StockReports },
  ],
  'Quản lý': [
    { path: '/manager', component: ManagerDashboard, exact: true },
    { path: '/manager/approvals', component: ManagerApprovals },
  ],
};

// Get default route by role
const getDefaultRoute = (role) => {
  const roleRoutes = {
    'Admin': '/',
    'Quản lý': '/manager',
    'Thủ thư': '/librarian',
    'Kế toán': '/accountant',
    'Thủ kho': '/warehouse',
    'Độc giả': '/reader',
  };
  return roleRoutes[role] || '/';
};

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole, userRole }) => {
  if (requiredRole && requiredRole !== userRole) {
    return <Navigate to={getDefaultRoute(userRole)} replace />;
  }
  return children;
};

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h1>Oops! Có lỗi xảy ra</h1>
            <p>Ứng dụng đã gặp phải một lỗi không mong muốn.</p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Tải lại trang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading component
const LoadingFallback = () => (
  <div className="loading-state">
    <div className="loading-spinner-lg"></div>
    <div className="loading-text">Đang tải...</div>
  </div>
);

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  // Initialize app
  useEffect(() => {
    // Simulate loading and authentication
    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 1000);

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Theme management
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (loading) {
    return <PageLoading text="Đang khởi tạo ứng dụng..." />;
  }

  if (!user) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>Đăng nhập</h1>
          <p>Vui lòng đăng nhập để tiếp tục</p>
          <button 
            className="btn btn-primary"
            onClick={() => setUser(mockUser)}
          >
            Đăng nhập Demo
          </button>
        </div>
      </div>
    );
  }

  const userRoutes = routeConfig[user.role] || routeConfig['Độc giả'];

  return (
    <ErrorBoundary>
      <Router>
        <div className="app">
          <ModernSidebar userRole={user.role} />
          
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Default redirect */}
              <Route 
                path="/" 
                element={<Navigate to={getDefaultRoute(user.role)} replace />} 
              />
              
              {/* User-specific routes */}
              {userRoutes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <ProtectedRoute requiredRole={user.role} userRole={user.role}>
                      <route.component userRole={user.role} />
                    </ProtectedRoute>
                  }
                />
              ))}
              
              {/* 404 Route */}
              <Route 
                path="*" 
                element={
                  <div className="error-page">
                    <div className="error-content">
                      <h1>404</h1>
                      <p>Trang bạn đang tìm kiếm không tồn tại.</p>
                      <button 
                        className="btn btn-primary"
                        onClick={() => window.history.back()}
                      >
                        Quay lại
                      </button>
                    </div>
                  </div>
                } 
              />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;