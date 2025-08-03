/**
 * LibrarianTestPage - Trang test các API của Librarian sau khi fix
 */
import React, { useState } from 'react';
import { librarianReportsService, userService } from '../services';

const LibrarianTestPage = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

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

  const testOverviewReport = () => testAPI('overviewReport', () => 
    librarianReportsService.getOverviewReport(selectedPeriod)
  );
  
  const testBorrowingReport = () => testAPI('borrowingReport', () => 
    librarianReportsService.getBorrowingReport(selectedPeriod)
  );
  
  const testOverdueReport = () => testAPI('overdueReport', () => 
    librarianReportsService.getOverdueReport()
  );
  
  const testSummaryReport = () => testAPI('summaryReport', () => 
    librarianReportsService.getSummaryReport(selectedPeriod)
  );

  const testAllAPIs = async () => {
    await testOverviewReport();
    await testBorrowingReport();
    await testOverdueReport();
    await testSummaryReport();
  };

  const clearResults = () => {
    setResults({});
    setError('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🧪 Librarian Reports API Test Page</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Current User Info:</h3>
        <pre>{JSON.stringify(currentUser, null, 2)}</pre>
        <p><strong>User Role:</strong> {currentUser?.role || 'Not found'}</p>
        <p><strong>Note:</strong> This page tests Librarian Reports APIs</p>
      </div>

      {error && (
        <div style={{ padding: '10px', background: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
        <h3>Test Configuration:</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <label htmlFor="period">Report Period:</label>
          <select 
            id="period"
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{ padding: '5px' }}
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="quarter">Quarter</option>
            <option value="year">Year</option>
          </select>
        </div>
        <p><strong>Selected Period:</strong> {selectedPeriod}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testAllAPIs} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            background: '#1976d2', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            marginRight: '10px'
          }}
        >
          {loading ? 'Testing...' : 'Test All Reports APIs'}
        </button>
        
        <button onClick={testOverviewReport} disabled={loading} style={{ padding: '10px 20px', marginRight: '10px' }}>
          Test Overview Report
        </button>
        
        <button onClick={testBorrowingReport} disabled={loading} style={{ padding: '10px 20px', marginRight: '10px' }}>
          Test Borrowing Report
        </button>
        
        <button onClick={testOverdueReport} disabled={loading} style={{ padding: '10px 20px', marginRight: '10px' }}>
          Test Overdue Report
        </button>
        
        <button onClick={testSummaryReport} disabled={loading} style={{ padding: '10px 20px', marginRight: '10px' }}>
          Test Summary Report
        </button>

        <button onClick={clearResults} style={{ padding: '10px 20px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}>
          Clear Results
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {Object.entries(results).map(([apiName, result]) => (
          <div key={apiName} style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '15px',
            background: result.success ? '#e8f5e8' : '#ffebee'
          }}>
            <h3>📊 {apiName} API</h3>
            
            {result.success ? (
              <div>
                <p style={{ color: '#2e7d32', fontWeight: 'bold' }}>✅ Success</p>
                
                {/* Show key metrics for each report type */}
                {apiName === 'overviewReport' && result.data && (
                  <div style={{ marginBottom: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <h4>Key Metrics:</h4>
                    <p>📚 Total Books: {result.data.totalBooks}</p>
                    <p>👥 Total Readers: {result.data.totalReaders}</p>
                    <p>📖 Total Borrows: {result.data.totalBorrows}</p>
                    <p>⚠️ Overdue Books: {result.data.overdueBooks}</p>
                    <p>💰 Total Fines: {result.data.totalFines?.toLocaleString('vi-VN')} VNĐ</p>
                  </div>
                )}

                {apiName === 'borrowingReport' && result.data && (
                  <div style={{ marginBottom: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <h4>Key Metrics:</h4>
                    <p>📖 Total Borrows: {result.data.totalBorrows}</p>
                    <p>📚 Total Returns: {result.data.totalReturns}</p>
                    <p>📅 Daily Stats Count: {result.data.dailyStats?.length || 0}</p>
                    <p>👥 Top Readers Count: {result.data.readerStats?.length || 0}</p>
                  </div>
                )}

                {apiName === 'overdueReport' && result.data && (
                  <div style={{ marginBottom: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <h4>Key Metrics:</h4>
                    <p>⚠️ Total Overdue: {result.data.totalOverdue}</p>
                    <p>💰 Total Fines: {result.data.totalFines?.toLocaleString('vi-VN')} VNĐ</p>
                    <p>📋 Overdue Books List: {result.data.overdueBooks?.length || 0} items</p>
                    <p>📊 Top Overdue Readers: {result.data.topOverdueReaders?.length || 0}</p>
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

      <div style={{ marginTop: '30px', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
        <h3>📝 Test Instructions:</h3>
        <ol>
          <li>Make sure you are logged in as a Librarian or Admin</li>
          <li>Make sure backend is running on localhost:5000</li>
          <li>Select a report period from the dropdown</li>
          <li>Click "Test All Reports APIs" to test all librarian reports functions</li>
          <li>Check results for each API call</li>
          <li>If any API fails, check the browser console for more details</li>
        </ol>
        
        <h4>Expected API Endpoints:</h4>
        <ul>
          <li><code>GET /api/LibrarianReports/overview?period={period}</code></li>
          <li><code>GET /api/LibrarianReports/borrowing?period={period}</code></li>
          <li><code>GET /api/LibrarianReports/overdue</code></li>
          <li><code>GET /api/LibrarianReports/summary?period={period}</code></li>
        </ul>
      </div>
    </div>
  );
};

export default LibrarianTestPage;