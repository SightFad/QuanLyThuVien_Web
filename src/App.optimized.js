import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { validateConfig } from './config';
import { routes, getDefaultRoute } from './router/routes';
import Sidebar from './components/Sidebar';
import LoginModal from './components/LoginModal';
import { PageLoading } from './components/shared';
import './App.css';

// Validate configuration on app start
try {
  validateConfig();
} catch (error) {
  console.error('Configuration validation failed:', error);
}

// Protected Route Component
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isAuthenticated } = useApp();
  
  if (!isAuthenticated) {
    return <LoginModal />;
  }
  
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to={getDefaultRoute(user?.role)} replace />;
  }
  
  return children;
};

// Main App Component
const AppContent = () => {
  const { user, isAuthenticated, loading, setLoading } = useApp();

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [setLoading]);

  if (loading) {
    return <PageLoading text="Đang khởi tạo ứng dụng..." />;
  }

  if (!isAuthenticated) {
    return <LoginModal />;
  }

  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <Suspense fallback={<PageLoading text="Đang tải trang..." />}>
          <Routes>
            {/* Default redirect */}
            <Route 
              path="/" 
              element={<Navigate to={getDefaultRoute(user?.role)} replace />} 
            />
            
            {/* Dynamic routes */}
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={
                  <ProtectedRoute roles={route.roles}>
                    <route.component />
                  </ProtectedRoute>
                }
              />
            ))}
            
            {/* 404 Route */}
            <Route 
              path="*" 
              element={
                <div className="error-page">
                  <h1>404 - Trang không tìm thấy</h1>
                  <p>Trang bạn đang tìm kiếm không tồn tại.</p>
                  <button 
                    onClick={() => window.history.back()}
                    className="btn btn-primary"
                  >
                    Quay lại
                  </button>
                </div>
              } 
            />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

// Error Boundary
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
    // You can log the error to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Có lỗi xảy ra</h1>
          <p>Ứng dụng đã gặp phải một lỗi không mong muốn.</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Tải lại trang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main App with Providers
const App = () => {
  return (
    <AppErrorBoundary>
      <AppProvider>
        <Router>
          <AppContent />
        </Router>
      </AppProvider>
    </AppErrorBoundary>
  );
};

export default App;