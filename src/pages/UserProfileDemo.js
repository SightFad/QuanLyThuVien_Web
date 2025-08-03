/**
 * User Profile Demo Page - Để test hệ thống authentication mới
 */
import React from 'react';
import UserInfo from '../components/UserInfo';
import { userService } from '../services';

const UserProfileDemo = () => {
  const user = userService.getCurrentUser();

  const handleLogout = () => {
    userService.clearUserData();
    window.location.href = '/';
  };

  const testFunctions = () => {
    console.log('=== USER SERVICE TESTS ===');
    console.log('Current User ID:', userService.getCurrentUserId());
    console.log('Current DocGia ID:', userService.getCurrentDocGiaId());
    console.log('Is Reader?', userService.isReader());
    console.log('Is VIP Reader?', userService.isVipReader());
    console.log('Is Active Reader?', userService.isActiveReader());
    console.log('Reader Type:', userService.getReaderType());
    console.log('Reader Level:', userService.getReaderLevel());
    console.log('Member Status:', userService.getMemberStatus());
    console.log('Borrow Limit:', userService.getBorrowLimit());
    console.log('Display Name:', userService.getDisplayName());
    console.log('Has Reader Role?', userService.hasRole('Reader'));
    console.log('Reader Permissions:', userService.getReaderPermissions());
    console.log('Token Expired?', userService.isTokenExpired());
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#333' }}>🔐 User Authentication Demo</h1>
          <p style={{ margin: '8px 0 0 0', color: '#666' }}>
            Test tính năng kiểm tra userId và phân biệt các loại độc giả
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={testFunctions}
            style={{
              padding: '8px 16px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🧪 Test Functions
          </button>
          {user && (
            <button 
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🚪 Logout
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {user && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ 
            background: '#e3f2fd', 
            padding: '16px', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>User ID</h3>
            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
              {userService.getCurrentUserId()}
            </p>
          </div>

          {userService.isReader() && (
            <div style={{ 
              background: '#f3e5f5', 
              padding: '16px', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#7b1fa2' }}>Reader ID</h3>
              <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
                {userService.getCurrentDocGiaId()}
              </p>
            </div>
          )}

          <div style={{ 
            background: userService.isReader() ? '#e8f5e8' : '#fff3e0', 
            padding: '16px', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: userService.isReader() ? '#388e3c' : '#f57c00' }}>
              User Type
            </h3>
            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
              {userService.isReader() ? `Reader (${userService.getReaderType()})` : user.role}
            </p>
          </div>

          {userService.isVipReader() && (
            <div style={{ 
              background: 'linear-gradient(45deg, #fff8e1, #fff3e0)', 
              padding: '16px', 
              borderRadius: '8px',
              textAlign: 'center',
              border: '2px solid #ff9800'
            }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#ef6c00' }}>⭐ VIP Status</h3>
              <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#ef6c00' }}>
                {userService.getReaderLevel()}
              </p>
            </div>
          )}
        </div>
      )}

      {/* User Info Component */}
      <UserInfo />

      {/* Instructions */}
      <div style={{
        background: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '8px',
        padding: '16px',
        marginTop: '20px'
      }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#856404' }}>📝 Hướng dẫn test:</h3>
        <ol style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
          <li>Đăng nhập với các tài khoản khác nhau để test</li>
          <li>Kiểm tra thông tin User ID và Reader ID</li>
          <li>Xem phân biệt các loại độc giả: Thuong, VIP, HocSinh, GiaoVien</li>
          <li>Kiểm tra quyền hạn dựa trên loại Reader</li>
          <li>Click "Test Functions" để xem console logs</li>
          <li>VIP Reader sẽ có quyền hạn mở rộng (thêm sách, thêm ngày)</li>
        </ol>
      </div>
    </div>
  );
};

export default UserProfileDemo;