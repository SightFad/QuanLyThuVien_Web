/**
 * WarehouseTestPage - Trang test các API của Warehouse sau khi fix
 */
import React, { useState } from 'react';
import { warehouseService, userService } from '../services';

const WarehouseTestPage = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [error, setError] = useState('');
  const [testParams, setTestParams] = useState({
    search: '',
    status: 'all',
    location: 'all',
    threshold: 5,
    months: 6,
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
    warehouseService.getDashboardSummary()
  );
  
  const testInventoryStatus = () => testAPI('inventoryStatus', () => 
    warehouseService.getInventoryStatus()
  );
  
  const testInventory = () => testAPI('inventory', () => 
    warehouseService.getInventory({
      search: testParams.search,
      status: testParams.status,
      location: testParams.location,
      page: testParams.page,
      pageSize: 5 // Smaller for testing
    })
  );
  
  const testInventoryStatistics = () => testAPI('inventoryStatistics', () => 
    warehouseService.getInventoryStatistics()
  );

  const testLowStockItems = () => testAPI('lowStockItems', () => 
    warehouseService.getLowStockItems(testParams.threshold)
  );

  const testStockReports = () => testAPI('stockReports', () => 
    warehouseService.getStockReports({
      type: 'all',
      status: 'all',
      page: 1,
      pageSize: 5
    })
  );

  const testStockStatistics = () => testAPI('stockStatistics', () => 
    warehouseService.getStockStatistics()
  );

  const testLowStockDetails = () => testAPI('lowStockDetails', () => 
    warehouseService.getLowStockDetails(testParams.threshold)
  );

  const testDamagedBooksReport = () => testAPI('damagedBooksReport', () => 
    warehouseService.getDamagedBooksReport()
  );

  const testImportHistory = () => testAPI('importHistory', () => 
    warehouseService.getImportHistory(testParams.months)
  );

  const testAllAPIs = async () => {
    await testDashboardSummary();
    await testInventoryStatus();
    await testInventory();
    await testInventoryStatistics();
    await testLowStockItems();
    await testStockReports();
    await testStockStatistics();
    await testLowStockDetails();
    await testDamagedBooksReport();
    await testImportHistory();
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
      <h1>🏭 Warehouse API Test Page</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Current User Info:</h3>
        <pre>{JSON.stringify(currentUser, null, 2)}</pre>
        <p><strong>User Role:</strong> {currentUser?.role || 'Not found'}</p>
        <p><strong>Note:</strong> This page tests Warehouse APIs</p>
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
            <label>Search Term:</label>
            <input 
              type="text"
              value={testParams.search} 
              onChange={(e) => handleParamChange('search', e.target.value)}
              placeholder="Search books..."
              style={{ width: '100%', padding: '5px' }}
            />
          </div>
          
          <div>
            <label>Status Filter:</label>
            <select 
              value={testParams.status} 
              onChange={(e) => handleParamChange('status', e.target.value)}
              style={{ width: '100%', padding: '5px' }}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="damaged">Damaged</option>
            </select>
          </div>
          
          <div>
            <label>Location Filter:</label>
            <select 
              value={testParams.location} 
              onChange={(e) => handleParamChange('location', e.target.value)}
              style={{ width: '100%', padding: '5px' }}
            >
              <option value="all">All Locations</option>
              <option value="Kệ A1">Kệ A1</option>
              <option value="Kệ A2">Kệ A2</option>
              <option value="Kệ B1">Kệ B1</option>
            </select>
          </div>
          
          <div>
            <label>Low Stock Threshold:</label>
            <input 
              type="number"
              value={testParams.threshold} 
              onChange={(e) => handleParamChange('threshold', parseInt(e.target.value))}
              min="1"
              max="10"
              style={{ width: '100%', padding: '5px' }}
            />
          </div>

          <div>
            <label>Import History (Months):</label>
            <input 
              type="number"
              value={testParams.months} 
              onChange={(e) => handleParamChange('months', parseInt(e.target.value))}
              min="1"
              max="12"
              style={{ width: '100%', padding: '5px' }}
            />
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
        
        <button onClick={testInventoryStatus} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          Inventory Status
        </button>
        
        <button onClick={testInventory} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          Inventory List
        </button>
        
        <button onClick={testInventoryStatistics} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          Inventory Stats
        </button>
        
        <button onClick={testLowStockItems} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          Low Stock Items
        </button>
        
        <button onClick={testStockReports} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          Stock Reports
        </button>
        
        <button onClick={testStockStatistics} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          Stock Statistics
        </button>

        <button onClick={testLowStockDetails} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          Low Stock Details
        </button>

        <button onClick={testDamagedBooksReport} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          Damaged Books
        </button>

        <button onClick={testImportHistory} disabled={loading} style={{ padding: '10px 15px', marginRight: '5px' }}>
          Import History
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
            <h3>🏭 {apiName} API</h3>
            
            {result.success ? (
              <div>
                <p style={{ color: '#2e7d32', fontWeight: 'bold' }}>✅ Success</p>
                
                {/* Show key metrics for each API type */}
                {apiName === 'dashboardSummary' && result.data && (
                  <div style={{ marginBottom: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <h4>Key Metrics:</h4>
                    <p>📦 Total Books: {result.data.stats?.totalBooks?.toLocaleString('vi-VN')}</p>
                    <p>📚 Books In Stock: {result.data.stats?.booksInStock?.toLocaleString('vi-VN')}</p>
                    <p>⚠️ Out of Stock: {result.data.stats?.booksOutOfStock}</p>
                    <p>📋 Pending Orders: {result.data.stats?.pendingOrders}</p>
                    <p>🚚 Today Deliveries: {result.data.stats?.todayDeliveries}</p>
                    <p>🔧 Damaged Books: {result.data.stats?.damagedBooks}</p>
                    <p>📊 Stock Ratio: {result.data.overview?.stockRatio}%</p>
                    <p>📈 Activities: {result.data.recentActivities?.length || 0}</p>
                  </div>
                )}

                {apiName === 'inventory' && result.data && (
                  <div style={{ marginBottom: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <h4>Key Metrics:</h4>
                    <p>📋 Items Count: {result.data.inventory?.length || 0}</p>
                    <p>📦 Total Books: {result.data.summary?.totalBooks?.toLocaleString('vi-VN')}</p>
                    <p>📚 Available: {result.data.summary?.availableBooks?.toLocaleString('vi-VN')}</p>
                    <p>⚠️ Out of Stock: {result.data.summary?.outOfStockCount}</p>
                    <p>📄 Current Page: {result.data.pagination?.page} / {result.data.pagination?.totalPages}</p>
                  </div>
                )}

                {(apiName.includes('Report') || apiName.includes('Statistics')) && result.data && (
                  <div style={{ marginBottom: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <h4>Report Summary:</h4>
                    {result.data.reports && (
                      <p>📊 Reports Count: {result.data.reports?.length || 0}</p>
                    )}
                    {result.data.summary && (
                      <>
                        <p>📦 Total Items: {result.data.summary.totalBooks?.toLocaleString('vi-VN') || result.data.summary.totalCount || 'N/A'}</p>
                        <p>💰 Total Loss: {result.data.summary.totalEstimatedLoss?.toLocaleString('vi-VN') || 'N/A'} VNĐ</p>
                      </>
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
          <li>Make sure you are logged in as a Warehouse staff or Admin</li>
          <li>Make sure backend is running on localhost:5000</li>
          <li>Adjust test parameters above as needed</li>
          <li>Click "Test All APIs" to test all warehouse functions</li>
          <li>Check results for each API call</li>
          <li>If any API fails, check the browser console for more details</li>
        </ol>
        
        <h4>Expected API Endpoints:</h4>
        <ul>
          <li><code>GET /api/WarehouseDashboard/summary</code></li>
          <li><code>GET /api/WarehouseDashboard/inventory-status</code></li>
          <li><code>GET /api/InventoryManagement?search={search}&status={status}&location={location}</code></li>
          <li><code>GET /api/InventoryManagement/statistics</code></li>
          <li><code>GET /api/InventoryManagement/low-stock?threshold={threshold}</code></li>
          <li><code>GET /api/StockReports?type={type}&status={status}</code></li>
          <li><code>GET /api/StockReports/statistics</code></li>
          <li><code>GET /api/StockReports/low-stock-details?threshold={threshold}</code></li>
          <li><code>GET /api/StockReports/damaged-books</code></li>
          <li><code>GET /api/StockReports/import-history?months={months}</code></li>
        </ul>
      </div>
    </div>
  );
};

export default WarehouseTestPage;