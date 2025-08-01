import React, { useState } from 'react';
import { apiRequest, isAuthenticated } from '../config/api';

const AuthTest = () => {
  const [loginData, setLoginData] = useState({ username: 'librarian', password: 'librarian123' });
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setTestResult('');
    
    try {
      const response = await apiRequest('/api/Auth/login', {
        method: 'POST',
        body: JSON.stringify(loginData)
      });
      
      setTestResult(`Login successful! Token: ${response.token.substring(0, 20)}...`);
      
      // Test protected endpoint
      setTimeout(() => {
        testProtectedEndpoint();
      }, 1000);
      
    } catch (error) {
      setTestResult(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testProtectedEndpoint = async () => {
    try {
      const response = await apiRequest('/api/Dashboard/summary');
      setTestResult(prev => prev + `\nProtected endpoint test successful: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setTestResult(prev => prev + `\nProtected endpoint test failed: ${error.message}`);
    }
  };

  const checkAuthStatus = () => {
    const isAuth = isAuthenticated();
    setTestResult(`Authentication status: ${isAuth ? 'Authenticated' : 'Not authenticated'}`);
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setTestResult('Authentication cleared');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Authentication Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Login Test</h3>
        <input
          type="text"
          placeholder="Username"
          value={loginData.username}
          onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={loginData.password}
          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Test Login'}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Auth Status</h3>
        <button onClick={checkAuthStatus} style={{ marginRight: '10px' }}>
          Check Auth Status
        </button>
        <button onClick={clearAuth}>
          Clear Auth
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Test Results</h3>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '5px',
          whiteSpace: 'pre-wrap',
          maxHeight: '300px',
          overflow: 'auto'
        }}>
          {testResult || 'No test results yet'}
        </pre>
      </div>

      <div>
        <h3>Current localStorage</h3>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '5px',
          fontSize: '12px'
        }}>
          Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}
          User: {localStorage.getItem('user') ? 'Present' : 'Missing'}
        </pre>
      </div>
    </div>
  );
};

export default AuthTest; 