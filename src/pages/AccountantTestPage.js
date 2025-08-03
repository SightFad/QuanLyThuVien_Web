/**
 * AccountantTestPage - Trang test các API của Accountant sau khi fix
 */
import React, { useState } from 'react';
import { accountantService, userService } from '../services';

const AccountantTestPage = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [error, setError] = useState('');
  const [testParams, setTestParams] = useState({
    period: 'month',
    searchTerm: '',
    transactionType: 'all',
    transactionStatus: 'all',
    page: 1
  });

  const currentUser = userService.getCurrentUser();

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

  const testDashboardSummary = () => testAPI('dashboardSummary', () => 
    accountantService.getDashboardSummary()
  );
  
  const testFinancialOverview = () => testAPI('financialOverview', () => 
    accountantService.getFinancialOverview(testParams.period)
  );
  
  const testTransactions = () => testAPI('transactions', () => 
    accountantService.getTransactions({
      search: testParams.searchTerm,
      type: testParams.transactionType,
      status: testParams.transactionStatus,
      page: testParams.page,
      pageSize: 5 // Smaller for testing
    })
  );
  
  const testTransactionStatistics = () => testAPI('transactionStatistics', () => 
    accountantService.getTransactionStatistics(testParams.period)
  );

  const testRevenueReport = () => testAPI('revenueReport', () => {
    const toDate = new Date().toISOString().split('T')[0];
    const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return accountantService.getRevenueReport(fromDate, toDate);
  });

  const testMembershipFeeReport = () => testAPI('membershipFeeReport', () => {
    const toDate = new Date().toISOString().split('T')[0];
    const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return accountantService.getMembershipFeeReport(fromDate, toDate);
  });

  const testFineReport = () => testAPI('fineReport', () => {
    const toDate = new Date().toISOString().split('T')[0];
    const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return accountantService.getFineReport(fromDate, toDate);
  });

  const testAllAPIs = async () => {
    await testDashboardSummary();
    await testFinancialOverview();
    await testTransactions();
    await testTransactionStatistics();
    await testRevenueReport();
    await testMembershipFeeReport();
    await testFineReport();
  };

  const clearResults = () => {
    setResults({});
    setError('');
  };

  const handleParamChange = (key, value) => {
    setTestParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🧪 Accountant API Test Page</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Current User Info:</h3>
        <pre>{JSON.stringify(currentUser, null, 2)}</pre>
        <p><strong>User Role:</strong> {currentUser?.role || 'Not found'}</p>
        <p><strong>Note:</strong> This page tests Accountant APIs</p>
      </div>

      {error && (
        <div style={{ padding: '10px', background: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Test Configuration */}
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
        <h3>Test Configuration:</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          <div>
            <label>Period:</label>
            <select 
              value={testParams.period} 
              onChange={(e) => handleParamChange('period', e.target.value)}
              style={{ width: '100%', padding: '5px' }}
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="quarter">Quarter</option>
              <option value="year">Year</option>
            </select>
          </div>
          
          <div>
            <label>Search Term:</label>
            <input 
              type="text"
              value={testParams.searchTerm} 
              onChange={(e) => handleParamChange('searchTerm', e.target.value)}
              placeholder="Search transactions..."
              style={{ width: '100%', padding: '5px' }}
            />
          </div>
          
          <div>
            <label>Transaction Type:</label>
            <select 
              value={testParams.transactionType} 
              onChange={(e) => handleParamChange('transactionType', e.target.value)}
              style={{ width: '100%', padding: '5px' }}
            >
              <option value="all">All Types</option>
              <option value="PhiThanhVien">Membership Fee</option>
              <option value="PhiPhat">Fine</option>
              <option value="PhiLamThe">Card Fee</option>
            </select>
          </div>
          
          <div>
            <label>Transaction Status:</label>
            <select 
              value={testParams.transactionStatus} 
              onChange={(e) => handleParamChange('transactionStatus', e.target.value)}
              style={{ width: '100%', padding: '5px' }}
            >
              <option value="all">All Status</option>
              <option value="DaThu">Collected</option>
              <option value="ChuaThu">Pending</option>
              <option value="DaHuy">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Test Buttons */}
      <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <button 
          onClick={testAllAPIs} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            background: '#1976d2', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px'
          }}
        >
          {loading ? 'Testing...' : 'Test All APIs'}
        </button>
        
        <button onClick={testDashboardSummary} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          Dashboard Summary
        </button>
        
        <button onClick={testFinancialOverview} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          Financial Overview
        </button>
        
        <button onClick={testTransactions} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          Transactions
        </button>
        
        <button onClick={testTransactionStatistics} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          Transaction Stats
        </button>
        
        <button onClick={testRevenueReport} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          Revenue Report
        </button>
        
        <button onClick={testMembershipFeeReport} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          Membership Report
        </button>
        
        <button onClick={testFineReport} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          Fine Report
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
            <h3>💼 {apiName} API</h3>
            
            {result.success ? (
              <div>
                <p style={{ color: '#2e7d32', fontWeight: 'bold' }}>✅ Success</p>
                
                {/* Show key metrics for each API type */}
                {apiName === 'dashboardSummary' && result.data && (
                  <div style={{ marginBottom: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <h4>Key Metrics:</h4>
                    <p>💰 Total Revenue: {result.data.stats?.totalRevenue?.toLocaleString('vi-VN')} VNĐ</p>
                    <p>📊 Monthly Revenue: {result.data.stats?.monthlyRevenue?.toLocaleString('vi-VN')} VNĐ</p>
                    <p>⚠️ Pending Fines: {result.data.stats?.pendingFines?.toLocaleString('vi-VN')} VNĐ</p>
                    <p>🏦 Today Transactions: {result.data.stats?.todayTransactions}</p>
                    <p>📈 Recent Transactions: {result.data.recentTransactions?.length || 0}</p>
                  </div>
                )}

                {apiName === 'transactions' && result.data && (
                  <div style={{ marginBottom: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <h4>Key Metrics:</h4>
                    <p>📋 Transactions Count: {result.data.transactions?.length || 0}</p>
                    <p>💰 Total Revenue: {result.data.summary?.totalRevenue?.toLocaleString('vi-VN')} VNĐ</p>
                    <p>⏳ Pending Amount: {result.data.summary?.pendingAmount?.toLocaleString('vi-VN')} VNĐ</p>
                    <p>📄 Current Page: {result.data.pagination?.page} / {result.data.pagination?.totalPages}</p>
                  </div>
                )}

                {(apiName.includes('Report') || apiName === 'transactionStatistics') && result.data && (
                  <div style={{ marginBottom: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <h4>Report Summary:</h4>
                    {result.data.TongDoanhThu !== undefined && (
                      <p>💰 Total Revenue: {result.data.TongDoanhThu?.toLocaleString('vi-VN')} VNĐ</p>
                    )}
                    {result.data.totalRevenue !== undefined && (
                      <p>💰 Total Revenue: {result.data.totalRevenue?.toLocaleString('vi-VN')} VNĐ</p>
                    )}
                    {result.data.DanhSach && (
                      <p>📊 Records Count: {result.data.DanhSach?.length || 0}</p>
                    )}
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
          <li>Make sure you are logged in as an Accountant or Admin</li>
          <li>Make sure backend is running on localhost:5000</li>
          <li>Adjust test parameters above as needed</li>
          <li>Click "Test All APIs" to test all accountant functions</li>
          <li>Check results for each API call</li>
          <li>If any API fails, check the browser console for more details</li>
        </ol>
        
        <h4>Expected API Endpoints:</h4>
        <ul>
          <li><code>GET /api/AccountantDashboard/summary</code></li>
          <li><code>GET /api/AccountantDashboard/financial-overview?period={period}</code></li>
          <li><code>GET /api/FinancialTransactions?search={search}&type={type}&status={status}&page={page}</code></li>
          <li><code>GET /api/FinancialTransactions/statistics?period={period}</code></li>
          <li><code>GET /api/BaoCao/doanh-thu?tuNgay={fromDate}&denNgay={toDate}</code></li>
          <li><code>GET /api/BaoCao/phi-thanh-vien?tuNgay={fromDate}&denNgay={toDate}</code></li>
          <li><code>GET /api/BaoCao/phi-phat?tuNgay={fromDate}&denNgay={toDate}</code></li>
        </ul>
      </div>
    </div>
  );
};

export default AccountantTestPage;