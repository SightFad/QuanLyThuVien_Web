import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ModernSidebar from './components/ModernSidebar';
import LoginModal from './components/LoginModal';
import ModernDashboard from './pages/ModernDashboard';
import BookManagement from './pages/BookManagement';
import ReaderManagement from './pages/ReaderManagement';
import BorrowManagement from './pages/BorrowManagement';
import UserManagement from './pages/UserManagement';
import SystemSettings from './pages/SystemSettings';
import BackupManagement from './pages/BackupManagement';

// Reader pages
import ReaderHome from './pages/reader/ReaderHome';
import ReaderSearch from './pages/reader/ReaderSearch';
import ReaderMyBooks from './pages/reader/ReaderMyBooks';
import ReaderProfile from './pages/reader/ReaderProfile';
import ReaderReservations from './pages/reader/ReaderReservations';
import ReaderFines from './pages/reader/ReaderFines';

// Librarian pages
import LibrarianDashboard from './pages/librarian/LibrarianDashboard';
import FineManagement from './pages/librarian/FineManagement';
import LibrarianReports from './pages/librarian/LibrarianReports';
import BookStatusManagement from './pages/librarian/BookStatusManagement';
import ReservationManagement from './pages/librarian/ReservationManagement';
import ViolationManagement from './pages/librarian/ViolationManagement';

// Accountant pages
import AccountantDashboard from './pages/accountant/AccountantDashboard';
import FinancialTransactions from './pages/accountant/FinancialTransactions';
import PurchaseProposals from './pages/accountant/PurchaseProposals';
import PurchaseOrders from './pages/accountant/PurchaseOrders';
import SupplierManagement from './pages/accountant/SupplierManagement';
import FinancialReports from './pages/accountant/FinancialReports';

// Warehouse pages
import WarehouseDashboard from './pages/warehouse/WarehouseDashboard';
import InventoryManagement from './pages/warehouse/InventoryManagement';
import StockReports from './pages/warehouse/StockReports';
import BookImports from './pages/warehouse/BookImports';
import InventoryChecks from './pages/warehouse/InventoryChecks';

// Manager pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManagerReports from './pages/manager/ManagerReports';
import ManagerApprovals from './pages/manager/ManagerApprovals';

// Director pages
import DirectorDashboard from './pages/director/DirectorDashboard';

// Technician pages
import TechnicianDashboard from './pages/technician/TechnicianDashboard';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
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
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app">
        {user ? (
          <>
            {/* Mobile Hamburger Menu Button */}
            <button 
              className="mobile-menu-toggle"
              onClick={handleMobileSidebarToggle}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            
            <ModernSidebar 
              userRole={user.role} 
              onLogout={handleLogout} 
              onToggle={handleSidebarToggle}
              isMobileOpen={isMobileSidebarOpen}
              onMobileToggle={handleMobileSidebarToggle}
            />
            <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>

              
              <Routes>
                {/* System Administrator Routes */}
                <Route path="/" element={
                  <ProtectedRoute allowedRoles={['Quản trị viên', 'Giám đốc', 'Trưởng thư viện', 'Thủ thư', 'Kế toán', 'Trưởng phòng kế toán', 'Nhân viên kế toán', 'Kỹ thuật viên', 'Nhân viên kho sách', 'Trưởng kho', 'warehouse', 'Warehouse', 'Độc giả']}>
                    {user && (
                      user.role === 'Quản trị viên' ? <ModernDashboard userRole={user.role} /> :
                      (() => {
                        const redirectPath = 
                          user.role === 'Độc giả' ? '/reader/home' :
                          user.role === 'Giám đốc' ? '/director/dashboard' :
                          user.role === 'Trưởng thư viện' ? '/manager/dashboard' :
                          user.role === 'Thủ thư' ? '/librarian/dashboard' :
                          user.role === 'Kế toán' || user.role === 'Trưởng phòng kế toán' || user.role === 'Nhân viên kế toán' ? '/accountant/dashboard' :
                          user.role === 'Kỹ thuật viên' ? '/technician/dashboard' :
                          user.role === 'Nhân viên kho sách' || user.role === 'Trưởng kho' || user.role === 'warehouse' || user.role === 'Warehouse' ? '/warehouse/dashboard' : '/';
                        
                        console.log('=== Redirect Logic ===');
                        console.log('User role:', user.role);
                        console.log('Redirect path:', redirectPath);
                        
                        return <Navigate to={redirectPath} replace />;
                      })()
                    )}
                  </ProtectedRoute>
                } />
                
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['Quản trị viên']}>
                    <ModernDashboard userRole="Quản trị viên" />
                  </ProtectedRoute>
                } />
                
                <Route path="/system/users" element={
                  <ProtectedRoute allowedRoles={['Quản trị viên']}>
                    <UserManagement />
                  </ProtectedRoute>
                } />
                
                <Route path="/system/settings" element={
                  <ProtectedRoute allowedRoles={['Quản trị viên']}>
                    <SystemSettings />
                  </ProtectedRoute>
                } />
                
                <Route path="/system/backup" element={
                  <ProtectedRoute allowedRoles={['Quản trị viên']}>
                    <BackupManagement />
                  </ProtectedRoute>
                } />
                
                {/* Shared Routes */}
                <Route path="/books" element={
                  <ProtectedRoute allowedRoles={['Quản trị viên', 'Thủ thư', 'Trưởng thư viện', 'Nhân viên kho sách', 'Trưởng kho']}>
                    <BookManagement />
                  </ProtectedRoute>
                } />
                
                <Route path="/readers" element={
                  <ProtectedRoute allowedRoles={['Quản trị viên', 'Thủ thư', 'Trưởng thư viện']}>
                    <ReaderManagement />
                  </ProtectedRoute>
                } />
                
                <Route path="/borrows" element={
                  <ProtectedRoute allowedRoles={['Quản trị viên', 'Thủ thư', 'Trưởng thư viện', 'Kế toán', 'Nhân viên kế toán']}>
                    <BorrowManagement />
                  </ProtectedRoute>
                } />
                
                {/* Reader Routes */}
                <Route path="/reader" element={
                  <ProtectedRoute allowedRoles={['Độc giả']}>
                    <Navigate to="/reader/home" replace />
                  </ProtectedRoute>
                } />
                
                {/* Librarian Routes */}
                <Route path="/librarian" element={
                  <ProtectedRoute allowedRoles={['Thủ thư']}>
                    <Navigate to="/librarian/dashboard" replace />
                  </ProtectedRoute>
                } />
                
                {/* Accountant Routes */}
                <Route path="/accountant" element={
                  <ProtectedRoute allowedRoles={['Kế toán', 'Nhân viên kế toán']}>
                    <Navigate to="/accountant/dashboard" replace />
                  </ProtectedRoute>
                } />
                
                {/* Warehouse Routes */}
                <Route path="/warehouse" element={
                  <ProtectedRoute allowedRoles={['Nhân viên kho sách', 'Trưởng kho', 'warehouse']}>
                    <Navigate to="/warehouse/dashboard" replace />
                  </ProtectedRoute>
                } />
                
                {/* Manager Routes */}
                <Route path="/manager" element={
                  <ProtectedRoute allowedRoles={['Trưởng thư viện']}>
                    <Navigate to="/manager/dashboard" replace />
                  </ProtectedRoute>
                } />
                
                <Route path="/reader/home" element={
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
                
                <Route path="/reader/reservations" element={
                  <ProtectedRoute allowedRoles={['Độc giả']}>
                    <ReaderReservations />
                  </ProtectedRoute>
                } />
                
                <Route path="/reader/fines" element={
                  <ProtectedRoute allowedRoles={['Độc giả']}>
                    <ReaderFines />
                  </ProtectedRoute>
                } />
                
                <Route path="/reader/profile" element={
                  <ProtectedRoute allowedRoles={['Độc giả']}>
                    <ReaderProfile />
                  </ProtectedRoute>
                } />
                
                {/* Librarian Routes */}
                <Route path="/librarian" element={
                  <ProtectedRoute allowedRoles={['Thủ thư']}>
                    <Navigate to="/librarian/dashboard" replace />
                  </ProtectedRoute>
                } />
                
                                <Route path="/librarian/dashboard" element={
                  <ProtectedRoute allowedRoles={['Thủ thư']}>
                    <LibrarianDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/librarian/fines" element={
                  <ProtectedRoute allowedRoles={['Thủ thư']}>
                    <FineManagement />
                  </ProtectedRoute>
                } />
                
                <Route path="/librarian/reports" element={
                  <ProtectedRoute allowedRoles={['Thủ thư']}>
                    <LibrarianReports />
                  </ProtectedRoute>
                } />
                
                <Route path="/librarian/book-status" element={
                  <ProtectedRoute allowedRoles={['Thủ thư']}>
                    <BookStatusManagement />
                  </ProtectedRoute>
                } />
                
                <Route path="/librarian/reservations" element={
                  <ProtectedRoute allowedRoles={['Thủ thư']}>
                    <ReservationManagement />
                  </ProtectedRoute>
                } />
                
                <Route path="/librarian/violations" element={
                  <ProtectedRoute allowedRoles={['Thủ thư']}>
                    <ViolationManagement />
                  </ProtectedRoute>
                } />
                
                {/* Accountant Routes */}
                <Route path="/accountant" element={
                  <ProtectedRoute allowedRoles={['Kế toán', 'Nhân viên kế toán']}>
                    <Navigate to="/accountant/dashboard" replace />
                  </ProtectedRoute>
                } />
                
                <Route path="/accountant/dashboard" element={
                  <ProtectedRoute allowedRoles={['Kế toán', 'Nhân viên kế toán']}>
                    <AccountantDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/accountant/transactions" element={
                  <ProtectedRoute allowedRoles={['Kế toán', 'Nhân viên kế toán']}>
                    <FinancialTransactions />
                  </ProtectedRoute>
                } />
                
                <Route path="/accountant/proposals" element={
                  <ProtectedRoute allowedRoles={['Kế toán']}>
                    <PurchaseProposals />
                  </ProtectedRoute>
                } />
                
                <Route path="/accountant/orders" element={
                  <ProtectedRoute allowedRoles={['Kế toán', 'Nhân viên kế toán']}>
                    <PurchaseOrders />
                  </ProtectedRoute>
                } />
                
                <Route path="/accountant/suppliers" element={
                  <ProtectedRoute allowedRoles={['Kế toán', 'Nhân viên kế toán']}>
                    <SupplierManagement />
                  </ProtectedRoute>
                } />
                
                <Route path="/accountant/reports" element={
                  <ProtectedRoute allowedRoles={['Kế toán', 'Nhân viên kế toán']}>
                    <FinancialReports />
                  </ProtectedRoute>
                } />
                
                {/* Warehouse Routes */}
                <Route path="/warehouse" element={
                  <ProtectedRoute allowedRoles={['Nhân viên kho sách', 'Trưởng kho', 'warehouse']}>
                    <Navigate to="/warehouse/dashboard" replace />
                  </ProtectedRoute>
                } />
                
                <Route path="/warehouse/dashboard" element={
                  <ProtectedRoute allowedRoles={['Nhân viên kho sách', 'Trưởng kho', 'warehouse', 'Warehouse']}>
                    <WarehouseDashboard />
                  </ProtectedRoute>
                } />
                

                
                <Route path="/warehouse/inventory" element={
                  <ProtectedRoute allowedRoles={['Nhân viên kho sách', 'Trưởng kho', 'warehouse', 'Warehouse']}>
                    <InventoryManagement />
                  </ProtectedRoute>
                } />
                
                <Route path="/warehouse/reports" element={
                  <ProtectedRoute allowedRoles={['Nhân viên kho sách', 'Trưởng kho', 'warehouse', 'Warehouse']}>
                    <StockReports />
                  </ProtectedRoute>
                } />
                
                <Route path="/warehouse/imports" element={
                  <ProtectedRoute allowedRoles={['Nhân viên kho sách', 'Trưởng kho', 'warehouse', 'Warehouse']}>
                    <BookImports />
                  </ProtectedRoute>
                } />
                
                <Route path="/warehouse/checks" element={
                  <ProtectedRoute allowedRoles={['Nhân viên kho sách', 'Trưởng kho', 'warehouse', 'Warehouse']}>
                    <InventoryChecks />
                  </ProtectedRoute>
                } />
                
                {/* Manager Routes */}
                <Route path="/manager" element={
                  <ProtectedRoute allowedRoles={['Trưởng thư viện']}>
                    <Navigate to="/manager/dashboard" replace />
                  </ProtectedRoute>
                } />
                
                <Route path="/manager/dashboard" element={
                  <ProtectedRoute allowedRoles={['Trưởng thư viện']}>
                    <ManagerDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/manager/reports" element={
                  <ProtectedRoute allowedRoles={['Trưởng thư viện']}>
                    <ManagerReports />
                  </ProtectedRoute>
                } />
                
                <Route path="/manager/approvals" element={
                  <ProtectedRoute allowedRoles={['Trưởng thư viện']}>
                    <ManagerApprovals />
                  </ProtectedRoute>
                } />
                
                {/* Director Routes */}
                <Route path="/director" element={
                  <ProtectedRoute allowedRoles={['Giám đốc']}>
                    <Navigate to="/director/dashboard" replace />
                  </ProtectedRoute>
                } />
                
                <Route path="/director/dashboard" element={
                  <ProtectedRoute allowedRoles={['Giám đốc']}>
                    <DirectorDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Technician Routes */}
                <Route path="/technician" element={
                  <ProtectedRoute allowedRoles={['Kỹ thuật viên']}>
                    <Navigate to="/technician/dashboard" replace />
                  </ProtectedRoute>
                } />
                
                <Route path="/technician/dashboard" element={
                  <ProtectedRoute allowedRoles={['Kỹ thuật viên']}>
                    <TechnicianDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Catch-all route for authenticated users */}
                <Route path="*" element={
                  <ProtectedRoute allowedRoles={['Độc giả', 'Giám đốc', 'Trưởng thư viện', 'Thủ thư', 'Kế toán', 'Trưởng phòng kế toán', 'Nhân viên kế toán', 'Kỹ thuật viên', 'Nhân viên kho sách', 'Trưởng kho', 'warehouse', 'Warehouse', 'Quản trị viên']}>
                    {user && (
                      <Navigate to={
                        user.role === 'Độc giả' ? '/reader/home' :
                        user.role === 'Giám đốc' ? '/director/dashboard' :
                        user.role === 'Trưởng thư viện' ? '/manager/dashboard' :
                        user.role === 'Thủ thư' ? '/librarian/dashboard' :
                        user.role === 'Kế toán' || user.role === 'Trưởng phòng kế toán' || user.role === 'Nhân viên kế toán' ? '/accountant/dashboard' :
                        user.role === 'Kỹ thuật viên' ? '/technician/dashboard' :
                        user.role === 'Nhân viên kho sách' || user.role === 'Trưởng kho' || user.role === 'warehouse' || user.role === 'Warehouse' ? '/warehouse/dashboard' :
                        user.role === 'Quản trị viên' ? '/admin' : '/'
                      } replace />
                    )}
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