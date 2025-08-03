/**
 * ReaderTestPage - Trang test các API của Reader sau khi fix
 */
import React, { useState, useEffect } from 'react';
import { readerService, userService } from '../services';
import './ReaderTestPage.css';

const ReaderTestPage = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Lấy thông tin user hiện tại
    const user = userService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const runAllTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Kiểm tra thông tin user hiện tại
      console.log('=== Test 1: Thông tin user hiện tại ===');
      const user = userService.getCurrentUser();
      const docGiaId = userService.getCurrentDocGiaId();
      const isReader = userService.isReader();
      
      results.userInfo = {
        success: true,
        data: {
          userId: user?.userId,
          docGiaId: docGiaId,
          isReader: isReader,
          role: user?.role,
          hoTen: user?.hoTen
        }
      };
      console.log('User Info:', results.userInfo.data);

      // Test 2: Lấy Dashboard
      console.log('=== Test 2: Reader Dashboard ===');
      try {
        const dashboard = await readerService.getDashboard();
        results.dashboard = { success: true, data: dashboard };
        console.log('Dashboard:', dashboard);
      } catch (error) {
        results.dashboard = { success: false, error: error.message };
        console.error('Dashboard Error:', error);
      }

      // Test 3: Lấy My Books
      console.log('=== Test 3: My Books ===');
      try {
        const myBooks = await readerService.getMyBooks();
        results.myBooks = { success: true, data: myBooks };
        console.log('My Books:', myBooks);
      } catch (error) {
        results.myBooks = { success: false, error: error.message };
        console.error('My Books Error:', error);
      }

      // Test 4: Lấy Profile
      console.log('=== Test 4: Reader Profile ===');
      try {
        const profile = await readerService.getProfile();
        results.profile = { success: true, data: profile };
        console.log('Profile:', profile);
      } catch (error) {
        results.profile = { success: false, error: error.message };
        console.error('Profile Error:', error);
      }

      // Test 5: Lấy Fines
      console.log('=== Test 5: Reader Fines ===');
      try {
        const fines = await readerService.getFines();
        results.fines = { success: true, data: fines };
        console.log('Fines:', fines);
      } catch (error) {
        results.fines = { success: false, error: error.message };
        console.error('Fines Error:', error);
      }

      // Test 6: Test với docGiaId cụ thể (nếu có)
      if (docGiaId) {
        console.log('=== Test 6: Test với docGiaId cụ thể ===');
        try {
          const profileWithId = await readerService.getProfile(docGiaId);
          results.profileWithId = { success: true, data: profileWithId };
          console.log('Profile with ID:', profileWithId);
        } catch (error) {
          results.profileWithId = { success: false, error: error.message };
          console.error('Profile with ID Error:', error);
        }
      }

    } catch (error) {
      console.error('Test Error:', error);
      results.generalError = error.message;
    }

    setTestResults(results);
    setLoading(false);
  };

  const testProfileUpdate = async () => {
    try {
      const testData = {
        email: 'test@example.com',
        sdt: '0987654321',
        diaChi: '123 Test Street',
        ngaySinh: '1990-01-01'
      };
      
      const result = await readerService.updateProfile(testData);
      alert('Test update profile thành công!');
      console.log('Update result:', result);
    } catch (error) {
      alert('Test update profile thất bại: ' + error.message);
      console.error('Update error:', error);
    }
  };

  const clearResults = () => {
    setTestResults({});
  };

  return (
    <div className="reader-test-page">
      <div className="page-header">
        <h1>🧪 Reader API Test Page</h1>
        <p>Kiểm tra các API của Reader role và xác minh docGiaId</p>
      </div>

      {/* Current User Info */}
      <div className="user-info-section">
        <h2>👤 Thông tin User hiện tại</h2>
        {currentUser ? (
          <div className="user-details">
            <div className="detail-row">
              <strong>User ID:</strong> {currentUser.userId}
            </div>
            <div className="detail-row">
              <strong>DocGia ID:</strong> {currentUser.docGiaId || 'Không có'}
            </div>
            <div className="detail-row">
              <strong>Role:</strong> {currentUser.role}
            </div>
            <div className="detail-row">
              <strong>Họ tên:</strong> {currentUser.hoTen || 'N/A'}
            </div>
            <div className="detail-row">
              <strong>Is Reader:</strong> {userService.isReader() ? '✅ Có' : '❌ Không'}
            </div>
            <div className="detail-row">
              <strong>Is VIP Reader:</strong> {userService.isVipReader() ? '✅ Có' : '❌ Không'}
            </div>
            <div className="detail-row">
              <strong>Is Active Reader:</strong> {userService.isActiveReader() ? '✅ Có' : '❌ Không'}
            </div>
          </div>
        ) : (
          <p className="error">❌ Không tìm thấy thông tin user</p>
        )}
      </div>

      {/* Test Controls */}
      <div className="test-controls">
        <button 
          className="btn btn-primary" 
          onClick={runAllTests}
          disabled={loading}
        >
          {loading ? '🔄 Đang test...' : '🚀 Chạy tất cả tests'}
        </button>
        
        <button 
          className="btn btn-secondary" 
          onClick={testProfileUpdate}
          disabled={loading}
        >
          📝 Test Update Profile
        </button>
        
        <button 
          className="btn btn-outline" 
          onClick={clearResults}
        >
          🗑️ Xóa kết quả
        </button>
      </div>

      {/* Test Results */}
      {Object.keys(testResults).length > 0 && (
        <div className="test-results">
          <h2>📊 Kết quả Tests</h2>
          
          {testResults.userInfo && (
            <div className="test-section">
              <h3>👤 User Info</h3>
              <div className={`test-result ${testResults.userInfo.success ? 'success' : 'error'}`}>
                <pre>{JSON.stringify(testResults.userInfo.data, null, 2)}</pre>
              </div>
            </div>
          )}

          {testResults.dashboard && (
            <div className="test-section">
              <h3>📊 Dashboard</h3>
              <div className={`test-result ${testResults.dashboard.success ? 'success' : 'error'}`}>
                {testResults.dashboard.success ? (
                  <pre>{JSON.stringify(testResults.dashboard.data, null, 2)}</pre>
                ) : (
                  <p className="error">❌ {testResults.dashboard.error}</p>
                )}
              </div>
            </div>
          )}

          {testResults.myBooks && (
            <div className="test-section">
              <h3>📚 My Books</h3>
              <div className={`test-result ${testResults.myBooks.success ? 'success' : 'error'}`}>
                {testResults.myBooks.success ? (
                  <pre>{JSON.stringify(testResults.myBooks.data, null, 2)}</pre>
                ) : (
                  <p className="error">❌ {testResults.myBooks.error}</p>
                )}
              </div>
            </div>
          )}

          {testResults.profile && (
            <div className="test-section">
              <h3>👤 Profile</h3>
              <div className={`test-result ${testResults.profile.success ? 'success' : 'error'}`}>
                {testResults.profile.success ? (
                  <pre>{JSON.stringify(testResults.profile.data, null, 2)}</pre>
                ) : (
                  <p className="error">❌ {testResults.profile.error}</p>
                )}
              </div>
            </div>
          )}

          {testResults.fines && (
            <div className="test-section">
              <h3>💰 Fines</h3>
              <div className={`test-result ${testResults.fines.success ? 'success' : 'error'}`}>
                {testResults.fines.success ? (
                  <pre>{JSON.stringify(testResults.fines.data, null, 2)}</pre>
                ) : (
                  <p className="error">❌ {testResults.fines.error}</p>
                )}
              </div>
            </div>
          )}

          {testResults.profileWithId && (
            <div className="test-section">
              <h3>👤 Profile (với docGiaId cụ thể)</h3>
              <div className={`test-result ${testResults.profileWithId.success ? 'success' : 'error'}`}>
                {testResults.profileWithId.success ? (
                  <pre>{JSON.stringify(testResults.profileWithId.data, null, 2)}</pre>
                ) : (
                  <p className="error">❌ {testResults.profileWithId.error}</p>
                )}
              </div>
            </div>
          )}

          {testResults.generalError && (
            <div className="test-section">
              <h3>❌ General Error</h3>
              <div className="test-result error">
                <p>{testResults.generalError}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="instructions">
        <h2>📋 Hướng dẫn sử dụng</h2>
        <div className="instruction-list">
          <div className="instruction-item">
            <strong>1. Kiểm tra thông tin user:</strong> Xem docGiaId có được lưu đúng từ login không
          </div>
          <div className="instruction-item">
            <strong>2. Test Dashboard:</strong> Kiểm tra API dashboard có hoạt động không
          </div>
          <div className="instruction-item">
            <strong>3. Test My Books:</strong> Kiểm tra API my books có hoạt động không
          </div>
          <div className="instruction-item">
            <strong>4. Test Profile:</strong> Kiểm tra API profile có trả về đúng thông tin của user hiện tại không
          </div>
          <div className="instruction-item">
            <strong>5. Test Fines:</strong> Kiểm tra API fines có hoạt động không
          </div>
          <div className="instruction-item">
            <strong>6. Test Update Profile:</strong> Kiểm tra chức năng cập nhật profile
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderTestPage;