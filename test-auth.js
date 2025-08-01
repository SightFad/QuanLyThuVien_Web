async function testAuth() {
  try {
    // Test anonymous endpoint
    console.log('Testing anonymous endpoint...');
    const testResponse = await fetch('http://localhost:5280/api/Dashboard/test');
    if (testResponse.ok) {
      const testData = await testResponse.text();
      console.log('Anonymous endpoint works:', testData);
    } else {
      console.log('Anonymous endpoint failed:', testResponse.status);
    }

    // Test login
    console.log('\nTesting login...');
    const loginResponse = await fetch('http://localhost:5280/api/Auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'librarian',
        password: 'librarian123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    console.log('Login successful!');
    console.log('Token:', loginData.token.substring(0, 20) + '...');

    // Test protected endpoint
    console.log('\nTesting protected endpoint...');
    const dashboardResponse = await fetch('http://localhost:5280/api/Dashboard/summary', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    });

    if (!dashboardResponse.ok) {
      const errorText = await dashboardResponse.text();
      throw new Error(`Dashboard request failed: ${dashboardResponse.status} - ${errorText}`);
    }

    const dashboardData = await dashboardResponse.json();
    console.log('Dashboard request successful!');
    console.log('Dashboard data:', JSON.stringify(dashboardData, null, 2));

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAuth(); 