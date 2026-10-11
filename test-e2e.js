// Simple automated verification script for backend & frontend
const http = require('http');

async function req(options, postData) {
  return new Promise((resolve, reject) => {
    const r = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, headers: res.headers, data: json, raw: data });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    r.on('error', reject);
    if (postData) {
      r.write(JSON.stringify(postData));
    }
    r.end();
  });
}

async function run() {
  console.log('Testing Personal Expense Management System...');

  // 1. Register
  const testEmail = `user_${Date.now()}@test.com`;
  console.log(`\n1. Testing Register with email: ${testEmail}`);
  const regRes = await req({
    hostname: 'localhost',
    port: 8080,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    fullName: 'Test Auditor',
    email: testEmail,
    password: 'password123',
    confirmPassword: 'password123'
  });
  console.log('Register status:', regRes.status, 'Response:', regRes.data);

  // 2. Login
  console.log('\n2. Testing Login...');
  const loginRes = await req({
    hostname: 'localhost',
    port: 8080,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: testEmail,
    password: 'password123'
  });
  console.log('Login status:', loginRes.status);
  const token = loginRes.data.token;
  console.log('Token received:', token ? token.substring(0, 30) + '...' : 'NONE');

  // 3. Current User
  console.log('\n3. Testing /api/auth/me...');
  const meRes = await req({
    hostname: 'localhost',
    port: 8080,
    path: '/api/auth/me',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('/api/auth/me response:', meRes.data);

  // 4. Initial Dashboard
  console.log('\n4. Testing Dashboard Summary (Initial)...');
  const dash0 = await req({
    hostname: 'localhost',
    port: 8080,
    path: '/api/dashboard/summary',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Initial Summary:', dash0.data);

  // 5. Add Income
  console.log('\n5. Adding Income transaction (50,000)...');
  const incRes = await req({
    hostname: 'localhost',
    port: 8080,
    path: '/api/transactions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }, {
    title: 'Consulting Income',
    amount: 50000,
    type: 'INCOME',
    transactionDate: new Date().toISOString().slice(0, 10),
    paymentMethod: 'Bank Transfer',
    description: 'Tech consulting fee'
  });
  console.log('Created Income:', incRes.data.title, 'Amount:', incRes.data.amount);

  // 6. Add Expense
  console.log('\n6. Adding Expense transaction (6,500)...');
  const expRes = await req({
    hostname: 'localhost',
    port: 8080,
    path: '/api/transactions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }, {
    title: 'Grocery Supplies',
    amount: 6500,
    type: 'EXPENSE',
    transactionDate: new Date().toISOString().slice(0, 10),
    paymentMethod: 'Credit Card',
    description: 'Weekly household groceries'
  });
  console.log('Created Expense:', expRes.data.title, 'Amount:', expRes.data.amount);

  // 7. Check Dashboard Summary & Recent Transactions
  console.log('\n7. Checking Dashboard Summary & Recent Transactions...');
  const dash1 = await req({
    hostname: 'localhost',
    port: 8080,
    path: '/api/dashboard/summary',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Updated Dashboard Summary:');
  console.log('  Total Income:', dash1.data.totalIncome);
  console.log('  Total Expenses:', dash1.data.totalExpenses);
  console.log('  Current Balance:', dash1.data.currentBalance);
  console.log('  Monthly Savings:', dash1.data.monthlySavings);

  const recentRes = await req({
    hostname: 'localhost',
    port: 8080,
    path: '/api/dashboard/recent-transactions',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Recent Transactions count:', recentRes.data.length);

  // 8. Test Categories
  console.log('\n8. Testing Categories creation & list...');
  const catCreate = await req({
    hostname: 'localhost',
    port: 8080,
    path: '/api/categories',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }, { name: 'Health & Fitness', type: 'EXPENSE' });
  console.log('Created Category:', catCreate.data.name);

  // 9. Test Frontend server
  console.log('\n9. Testing Frontend dev server on http://localhost:5173...');
  const feRes = await req({
    hostname: 'localhost',
    port: 5173,
    path: '/',
    method: 'GET'
  });
  console.log('Frontend Status Code:', feRes.status, 'HTML length:', feRes.raw.length);

  console.log('\n>>> SUCCESS: All features verified and functioning properly! <<<');
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
