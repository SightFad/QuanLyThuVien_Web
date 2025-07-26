import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginModal from './components/LoginModal';
import Dashboard from './pages/Dashboard';
import BookManagement from './pages/BookManagement';
import ReaderManagement from './pages/ReaderManagement';
import BorrowManagement from './pages/BorrowManagement';
import UserManagement from './pages/UserManagement';
import ReaderHome from './pages/reader/ReaderHome';
import ReaderSearch from './pages/reader/ReaderSearch';
import ReaderMyBooks from './pages/reader/ReaderMyBooks';
import ReaderHistory from './pages/reader/ReaderHistory';
import ReaderProfile from './pages/reader/ReaderProfile';
import LibrarianDashboard from './pages/librarian/LibrarianDashboard';
import AccountantDashboard from './pages/accountant/AccountantDashboard';
import WarehouseDashboard from './pages/warehouse/WarehouseDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        {user ? (
          <>
            <Sidebar user={user} onLogout={handleLogout} />
            <main className="main-content">
              <Routes>
                {/* Admin Routes */}
                <Route path="/" element={
                  <ProtectedRoute allowedRoles={['Quản trị viên']}>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/books" element={
                  <ProtectedRoute allowedRoles={['Quản trị viên', 'Thủ thư', 'Nhân viên kho sách']}>
                    <BookManagement />
                  </ProtectedRoute>
                } />
                
                <Route path="/readers" element={
                  <ProtectedRoute allowedRoles={['Quản trị viên', 'Thủ thư']}>
                    <ReaderManagement />
                  </ProtectedRoute>
                } />
                
                <Route path="/borrows" element={
                  <ProtectedRoute allowedRoles={['Quản trị viên', 'Thủ thư', 'Kế toán']}>
                    <BorrowManagement />
                  </ProtectedRoute>
                } />
                
                <Route path="/users" element={
                  <ProtectedRoute allowedRoles={['Quản trị viên']}>
                    <UserManagement />
                  </ProtectedRoute>
                } />
                
                {/* Librarian Routes */}
                <Route path="/librarian" element={
                  <ProtectedRoute allowedRoles={['Thủ thư']}>
                    <LibrarianDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/librarian/activities" element={
                  <ProtectedRoute allowedRoles={['Thủ thư']}>
                    <div style={{ padding: '20px' }}>
                      <h1>Hoạt động thư viện</h1>
                      <p>Trang quản lý hoạt động thư viện</p>
                    </div>
                  </ProtectedRoute>
                } />
                
                {/* Accountant Routes */}
                <Route path="/accountant" element={
                  <ProtectedRoute allowedRoles={['Kế toán']}>
                    <AccountantDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/accountant/finance" element={
                  <ProtectedRoute allowedRoles={['Kế toán']}>
                    <div style={{ padding: '20px' }}>
                      <h1>Quản lý tài chính</h1>
                      <p>Trang quản lý tài chính thư viện</p>
                    </div>
                  </ProtectedRoute>
                } />
                
                <Route path="/accountant/fines" element={
                  <ProtectedRoute allowedRoles={['Kế toán']}>
                    <div style={{ padding: '20px' }}>
                      <h1>Quản lý tiền phạt</h1>
                      <p>Trang quản lý tiền phạt mượn sách</p>
                    </div>
                  </ProtectedRoute>
                } />
                
                <Route path="/accountant/reports" element={
                  <ProtectedRoute allowedRoles={['Kế toán']}>
                    <div style={{ padding: '20px' }}>
                      <h1>Báo cáo tài chính</h1>
                      <p>Trang báo cáo tài chính</p>
                    </div>
                  </ProtectedRoute>
                } />
                
                {/* Warehouse Routes */}
                <Route path="/warehouse" element={
                  <ProtectedRoute allowedRoles={['Nhân viên kho sách']}>
                    <WarehouseDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/warehouse/inventory" element={
                  <ProtectedRoute allowedRoles={['Nhân viên kho sách']}>
                    <div style={{ padding: '20px' }}>
                      <h1>Quản lý kho</h1>
                      <p>Trang quản lý kho sách</p>
                    </div>
                  </ProtectedRoute>
                } />
                
                <Route path="/warehouse/orders" element={
                  <ProtectedRoute allowedRoles={['Nhân viên kho sách']}>
                    <div style={{ padding: '20px' }}>
                      <h1>Quản lý đơn hàng</h1>
                      <p>Trang quản lý đơn hàng sách</p>
                    </div>
                  </ProtectedRoute>
                } />
                
                <Route path="/warehouse/check" element={
                  <ProtectedRoute allowedRoles={['Nhân viên kho sách']}>
                    <div style={{ padding: '20px' }}>
                      <h1>Kiểm kê kho</h1>
                      <p>Trang kiểm kê kho sách</p>
                    </div>
                  </ProtectedRoute>
                } />
                
                {/* Reader Routes */}
                <Route path="/reader" element={
                  <ProtectedRoute allowedRoles={['Độc giả']}>
                    <ReaderHome />
                  </ProtectedRoute>
                } />
                
                <Route path="/reader/search" element={
                  <ProtectedRoute allowedRoles={['Độc giả']}>
                    <ReaderSearch />
                  </ProtectedRoute>
                } />
                
                <Route path="/reader/my-books" element={
                  <ProtectedRoute allowedRoles={['Độc giả']}>
                    <ReaderMyBooks />
                  </ProtectedRoute>
                } />
                
                <Route path="/reader/history" element={
                  <ProtectedRoute allowedRoles={['Độc giả']}>
                    <ReaderHistory />
                  </ProtectedRoute>
                } />
                
                <Route path="/reader/profile" element={
                  <ProtectedRoute allowedRoles={['Độc giả']}>
                    <ReaderProfile />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
          </>
        ) : (
          <div className="welcome-screen">
            <div className="welcome-content">
              <h1>Hệ Thống Quản Lý Thư Viện</h1>
              <p>Vui lòng đăng nhập để tiếp tục</p>
              <button 
                className="login-btn-large"
                onClick={() => setShowLogin(true)}
              >
                Đăng nhập
              </button>
            </div>
          </div>
        )}
        
        <LoginModal 
          isOpen={showLogin} 
          onClose={() => setShowLogin(false)} 
          onLogin={handleLogin} 
        />
      </div>
    </Router>
  );
}

export default App; 