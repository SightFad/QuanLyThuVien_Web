/**
 * AdminTestPage - Trang test các API của Admin sau khi fix
 */
import React, { useState } from 'react';
import { adminService, userService } from '../services';

const AdminTestPage = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [error, setError] = useState('');
  const [testParams, setTestParams] = useState({
    analyticsPeriod: 'month',
    backupPage: 1,
    backupPageSize: 5,
    userId: '',
    newPassword: 'newpassword123',
    backupDescription: 'Test backup'
  });

  const currentUser = userService.getCurrentUser();
  const isAdmin = userService.isAdmin() || currentUser?.role === 'Admin';

  const testAPI = async (apiName, apiCall) => {
    try {
      setLoading(true);
      setError('');
      const result = await apiCall();
      setResults(prev => ({
        ...prev,
        [apiName]: { success: true, data: result }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [apiName]: { success: false, error: error.message }
      }));
      setError(`Error in ${apiName}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Admin Dashboard APIs
  const testAdminOverview = () => testAPI('adminOverview', () => 
    adminService.getAdminOverview()
  );
  
  const testSystemStatus = () => testAPI('systemStatus', () => 
    adminService.getSystemStatus()
  );
  
  const testAnalytics = () => testAPI('analytics', () => 
    adminService.getAnalytics(testParams.analyticsPeriod)
  );

  // User Management APIs
  const testGetUsers = () => testAPI('getUsers', () => 
    adminService.getUsers()
  );
  
  const testGetAvailableRoles = () => testAPI('availableRoles', () => 
    adminService.getAvailableRoles()
  );
  
  const testGetUserStatistics = () => testAPI('userStatistics', () => 
    adminService.getUserStatistics()
  );

  // Backup Management APIs
  const testGetBackupHistory = () => testAPI('backupHistory', () => 
    adminService.getBackupHistory({
      page: testParams.backupPage,
      pageSize: testParams.backupPageSize
    })
  );
  
  const testGetBackupStatus = () => testAPI('backupStatus', () => 
    adminService.getBackupStatus()
  );
  
  const testGetBackupSettings = () => testAPI('backupSettings', () => 
    adminService.getBackupSettings()
  );

  const testCreateBackup = () => testAPI('createBackup', () => 
    adminService.createBackup({
      description: testParams.backupDescription,
      type: 'manual'
    })
  );

  const testAllAdminAPIs = async () => {
    await testAdminOverview();
    await testSystemStatus();
    await testAnalytics();
    await testGetUsers();
    await testGetAvailableRoles();
    await testGetUserStatistics();
    await testGetBackupHistory();
    await testGetBackupStatus();
    await testGetBackupSettings();
    // Skip create backup in bulk test to avoid creating many backups
  };

  const clearResults = () => {
    setResults({});
    setError('');
  };

  const handleParamChange = (key, value) => {
    setTestParams(prev => ({ ...prev, [key]: value }));
  };

  if (!isAdmin) {
    return (
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>🔧 Admin API Test Page</h1>
        <div style={{ padding: '20px', background: '#ffebee', color: '#c62828', borderRadius: '8px' }}>
          <p>Vui lòng đăng nhập với tài khoản có vai trò "Admin" để sử dụng trang này.</p>
          <p><strong>Vai trò hiện tại:</strong> {currentUser?.role || 'Chưa đăng nhập'}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🔧 Admin API Test Page</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Current User Info:</h3>
        <pre>{JSON.stringify(currentUser, null, 2)}</pre>
        <p><strong>User Role:</strong> {currentUser?.role || 'Not found'}</p>
        <p><strong>Note:</strong> This page tests all Admin APIs</p>
      </div>

      {error && (
        <div style={{ padding: '10px', background: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Test Configuration */}
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
        <h3>Test Configuration:</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px' }}>
          <div>
            <label>Analytics Period:</label>
            <select 
              value={testParams.analyticsPeriod} 
              onChange={(e) => handleParamChange('analyticsPeriod', e.target.value)}
              style={{ width: '100%', padding: '5px' }}
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="quarter">Quarter</option>
              <option value="year">Year</option>
            </select>
          </div>
          
          <div>
            <label>Backup Page:</label>
            <input 
              type="number"
              value={testParams.backupPage} 
              onChange={(e) => handleParamChange('backupPage', parseInt(e.target.value))}
              min="1"
              style={{ width: '100%', padding: '5px' }}
            />
          </div>
          
          <div>
            <label>Backup Page Size:</label>
            <input 
              type="number"
              value={testParams.backupPageSize} 
              onChange={(e) => handleParamChange('backupPageSize', parseInt(e.target.value))}
              min="1"
              max="50"
              style={{ width: '100%', padding: '5px' }}
            />
          </div>

          <div>
            <label>Backup Description:</label>
            <input 
              type="text"
              value={testParams.backupDescription} 
              onChange={(e) => handleParamChange('backupDescription', e.target.value)}
              placeholder="Test backup description"
              style={{ width: '100%', padding: '5px' }}
            />
          </div>
        </div>
      </div>

      {/* Test Buttons */}
      <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <button 
          onClick={testAllAdminAPIs} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            background: '#1976d2', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px'
          }}
        >
          {loading ? 'Testing...' : 'Test All Admin APIs'}
        </button>
        
        {/* Dashboard APIs */}
        <button onClick={testAdminOverview} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          Admin Overview
        </button>
        
        <button onClick={testSystemStatus} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          System Status
        </button>
        
        <button onClick={testAnalytics} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          Analytics
        </button>
        
        {/* User Management APIs */}
        <button onClick={testGetUsers} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          Get Users
        </button>
        
        <button onClick={testGetAvailableRoles} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          Available Roles
        </button>
        
        <button onClick={testGetUserStatistics} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          User Statistics
        </button>
        
        {/* Backup Management APIs */}
        <button onClick={testGetBackupHistory} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          Backup History
        </button>
        
        <button onClick={testGetBackupStatus} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          Backup Status
        </button>
        
        <button onClick={testGetBackupSettings} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          Backup Settings
        </button>

        <button onClick={testCreateBackup} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px', background: '#ff9800', color: 'white', border: 'none', borderRadius: '4px' }}>
          Create Test Backup
        </button>

        <button onClick={clearResults} style={{ padding: '10px 15px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}>
          Clear Results
        </button>
      </div>

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {Object.entries(results).map(([apiName, result]) => (
          <div key={apiName} style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '15px',
            background: result.success ? '#e8f5e8' : '#ffebee'
          }}>
            <h3>🔧 {apiName} API</h3>
            
            {result.success ? (
              <div>
                <p style={{ color: '#2e7d32', fontWeight: 'bold' }}>✅ Success</p>
                
                {/* Show key metrics for each API type */}
                {apiName === 'adminOverview' && result.data && (
                  <div style={{ marginBottom: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <h4>Key Metrics:</h4>
                    <p>📚 Total Books: {result.data.coreStats?.totalBooks?.toLocaleString('vi-VN')}</p>
                    <p>👥 Total Readers: {result.data.coreStats?.totalReaders?.toLocaleString('vi-VN')}</p>
                    <p>👤 Total Users: {result.data.coreStats?.totalUsers}</p>
                    <p>📖 Active Borrows: {result.data.coreStats?.activeBorrows}</p>
                    <p>⚠️ Overdue: {result.data.coreStats?.overdueBorrows}</p>
                    <p>💰 Monthly Revenue: {result.data.financial?.monthlyRevenue?.toLocaleString('vi-VN')} VNĐ</p>
                    <p>📈 Revenue Growth: {result.data.financial?.revenueGrowth}%</p>
                  </div>
                )}

                {apiName === 'systemStatus' && result.data && (
                  <div style={{ marginBottom: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <h4>System Health:</h4>
                    <p>🗃️ Database: {result.data.database?.status}</p>
                    <p>⚙️ Server: {result.data.server?.status}</p>
                    <p>📊 Response Time: {result.data.database?.responseTime}</p>
                    <p>🔒 Security: {result.data.security?.vulnerabilities} vulnerabilities</p>
                  </div>
                )}

                {apiName === 'backupHistory' && result.data && (
                  <div style={{ marginBottom: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <h4>Backup Summary:</h4>
                    <p>📦 Total Backups: {result.data.statistics?.totalBackups}</p>
                    <p>✅ Successful: {result.data.statistics?.successfulBackups}</p>
                    <p>❌ Failed: {result.data.statistics?.failedBackups}</p>
                    <p>📄 This Page: {result.data.backups?.length || 0} items</p>
                  </div>
                )}

                {apiName === 'getUsers' && result.data && (
                  <div style={{ marginBottom: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <h4>User Summary:</h4>
                    <p>👥 Total Users: {result.data.length}</p>
                    <p>🔧 Admin Users: {result.data.filter(u => u.role === 'Admin').length}</p>
                    <p>📚 Librarians: {result.data.filter(u => u.role === 'Librarian').length}</p>
                  </div>
                )}

                <details>
                  <summary>Show Full API Response</summary>
                  <pre style={{ 
                    background: '#f5f5f5', 
                    padding: '10px', 
                    borderRadius: '4px',
                    fontSize: '12px',
                    maxHeight: '300px',
                    overflow: 'auto'
                  }}>
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              </div>
            ) : (
              <div>
                <p style={{ color: '#c62828', fontWeight: 'bold' }}>❌ Error</p>
                <p style={{ color: '#c62828' }}>{result.error}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div style={{ marginTop: '30px', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
        <h3>📝 Test Instructions:</h3>
        <ol>
          <li>Make sure you are logged in as an Admin</li>
          <li>Make sure backend is running on localhost:5000</li>
          <li>Adjust test parameters above as needed</li>
          <li>Click "Test All Admin APIs" to test all admin functions</li>
          <li>Check results for each API call</li>
          <li>If any API fails, check the browser console for more details</li>
        </ol>
        
        <h4>Expected API Endpoints:</h4>
        <ul>
          <li><code>GET /api/AdminDashboard/overview</code></li>
          <li><code>GET /api/AdminDashboard/system-status</code></li>
          <li><code>GET /api/AdminDashboard/analytics?period={period}</code></li>
          <li><code>GET /api/User</code></li>
          <li><code>GET /api/User/roles</code></li>
          <li><code>GET /api/User/statistics</code></li>
          <li><code>GET /api/Backup/history?page={page}&pageSize={pageSize}</code></li>
          <li><code>GET /api/Backup/status</code></li>
          <li><code>GET /api/Backup/settings</code></li>
          <li><code>POST /api/Backup/create</code></li>
        </ul>
      </div>
    </div>
  );
};

export default AdminTestPage;