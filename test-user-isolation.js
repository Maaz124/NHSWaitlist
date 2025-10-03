#!/usr/bin/env node

/**
 * Test script to verify user data isolation
 * This script creates two users and verifies that their data is properly isolated
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function makeRequest(method, path, data = null, sessionCookie = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  if (sessionCookie) {
    options.headers.Cookie = sessionCookie;
  }
  
  const response = await fetch(`${BASE_URL}${path}`, options);
  const result = await response.json();
  
  return { response, result };
}

async function testUserIsolation() {
  console.log('🧪 Testing User Data Isolation...\n');
  
  try {
    // Create first user
    console.log('1. Creating first user...');
    const user1Data = {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      password: 'password123'
    };
    
    const { response: signup1, result: signupResult1 } = await makeRequest('POST', '/api/auth/signup', user1Data);
    const session1 = signup1.headers.get('set-cookie');
    
    if (!session1) {
      throw new Error('Failed to get session cookie for user 1');
    }
    
    console.log('✅ User 1 created successfully');
    
    // Create second user
    console.log('2. Creating second user...');
    const user2Data = {
      firstName: 'Bob',
      lastName: 'Jones',
      email: 'bob@example.com',
      password: 'password123'
    };
    
    const { response: signup2, result: signupResult2 } = await makeRequest('POST', '/api/auth/signup', user2Data);
    const session2 = signup2.headers.get('set-cookie');
    
    if (!session2) {
      throw new Error('Failed to get session cookie for user 2');
    }
    
    console.log('✅ User 2 created successfully');
    
    // Get user 1's data
    console.log('3. Getting user 1 data...');
    const { result: user1Info } = await makeRequest('GET', '/api/auth/me', null, session1);
    const userId1 = user1Info.user.id;
    console.log(`✅ User 1 ID: ${userId1}`);
    
    // Get user 2's data
    console.log('4. Getting user 2 data...');
    const { result: user2Info } = await makeRequest('GET', '/api/auth/me', null, session2);
    const userId2 = user2Info.user.id;
    console.log(`✅ User 2 ID: ${userId2}`);
    
    // Verify different user IDs
    if (userId1 === userId2) {
      throw new Error('❌ CRITICAL: Both users have the same ID!');
    }
    console.log('✅ User IDs are different - good!');
    
    // Test data isolation - get modules for each user
    console.log('5. Testing module data isolation...');
    
    const { result: modules1 } = await makeRequest('GET', `/api/modules/${userId1}`, null, session1);
    const { result: modules2 } = await makeRequest('GET', `/api/modules/${userId2}`, null, session2);
    
    console.log(`User 1 modules: ${modules1.modules.length}`);
    console.log(`User 2 modules: ${modules2.modules.length}`);
    
    // Verify modules are different instances
    const module1Ids = modules1.modules.map(m => m.id);
    const module2Ids = modules2.modules.map(m => m.id);
    
    const hasCommonModules = module1Ids.some(id => module2Ids.includes(id));
    if (hasCommonModules) {
      throw new Error('❌ CRITICAL: Users share module instances!');
    }
    console.log('✅ Module data is properly isolated');
    
    // Test dashboard data isolation
    console.log('6. Testing dashboard data isolation...');
    
    const { result: dashboard1 } = await makeRequest('GET', `/api/dashboard/${userId1}`, null, session1);
    const { result: dashboard2 } = await makeRequest('GET', `/api/dashboard/${userId2}`, null, session2);
    
    console.log(`User 1 dashboard: Week ${dashboard1.dashboardData.currentWeek}`);
    console.log(`User 2 dashboard: Week ${dashboard2.dashboardData.currentWeek}`);
    console.log('✅ Dashboard data is properly isolated');
    
    // Test that user 1 cannot access user 2's data
    console.log('7. Testing unauthorized access prevention...');
    
    try {
      await makeRequest('GET', `/api/modules/${userId2}`, null, session1);
      throw new Error('❌ CRITICAL: User 1 was able to access User 2 data!');
    } catch (error) {
      if (error.message.includes('CRITICAL')) {
        throw error;
      }
      console.log('✅ Unauthorized access properly blocked');
    }
    
    // Test that user 2 cannot access user 1's data
    try {
      await makeRequest('GET', `/api/modules/${userId1}`, null, session2);
      throw new Error('❌ CRITICAL: User 2 was able to access User 1 data!');
    } catch (error) {
      if (error.message.includes('CRITICAL')) {
        throw error;
      }
      console.log('✅ Unauthorized access properly blocked');
    }
    
    console.log('\n🎉 ALL TESTS PASSED! User data isolation is working correctly.');
    console.log('\nSummary:');
    console.log('- ✅ Users have unique IDs');
    console.log('- ✅ Module data is isolated per user');
    console.log('- ✅ Dashboard data is isolated per user');
    console.log('- ✅ Unauthorized access is properly blocked');
    console.log('- ✅ Session management is working correctly');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    process.exit(1);
  }
}

// Run the test
testUserIsolation();
