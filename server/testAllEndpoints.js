const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = null;
let testUserId = null;
let testApplicationId = null;

// Color codes for console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  gray: '\x1b[90m'
};

function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = {
    success: `${colors.green}✓${colors.reset}`,
    error: `${colors.red}✗${colors.reset}`,
    info: `${colors.blue}ℹ${colors.reset}`,
    warning: `${colors.yellow}⚠${colors.reset}`
  }[type] || colors.blue;
  
  console.log(`${colors.gray}[${timestamp}]${colors.reset} ${prefix} ${message}`);
}

// Test results tracker
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  errors: []
};

async function testEndpoint(name, method, url, data = null, requiresAuth = false, expectedStatus = 200) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: requiresAuth && authToken ? { Authorization: `Bearer ${authToken}` } : {},
      ...(data && { data })
    };

    const response = await axios(config);
    
    if (response.status === expectedStatus) {
      log(`${name}: ${colors.green}PASSED${colors.reset} (${response.status})`, 'success');
      results.passed++;
      return response.data;
    } else {
      log(`${name}: ${colors.yellow}WARNING${colors.reset} - Expected ${expectedStatus}, got ${response.status}`, 'warning');
      results.warnings++;
      return response.data;
    }
  } catch (error) {
    const status = error.response?.status || 'NO_RESPONSE';
    const message = error.response?.data?.msg || error.response?.data?.message || error.message;
    
    log(`${name}: ${colors.red}FAILED${colors.reset} (${status}) - ${message}`, 'error');
    results.failed++;
    results.errors.push({ name, status, message, url });
    return null;
  }
}

async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('  API ENDPOINT TESTING - University Admission Portal');
  console.log('='.repeat(60) + '\n');

  // ========================================
  // 1. AUTH ROUTES
  // ========================================
  console.log(`${colors.blue}━━━ AUTHENTICATION ROUTES ━━━${colors.reset}\n`);

  // Register new test user
  const registerData = await testEndpoint(
    'POST /auth/register',
    'post',
    '/auth/register',
    {
      name: 'Test User API',
      email: `test_${Date.now()}@example.com`,
      password: 'Test@123456',
      role: 'applicant'
    },
    false,
    201
  );

  // Login with test user
  if (registerData && registerData.email) {
    const loginData = await testEndpoint(
      'POST /auth/login',
      'post',
      '/auth/login',
      {
        email: registerData.email,
        password: 'Test@123456'
      }
    );

    if (loginData && loginData.token) {
      authToken = loginData.token;
      testUserId = loginData.userId || loginData.user?._id;
      log(`Auth token acquired for user: ${testUserId}`, 'info');
    }
  }

  // Test other auth endpoints
  await testEndpoint('GET /auth/me', 'get', '/auth/me', null, true);
  await testEndpoint('POST /auth/refresh', 'post', '/auth/refresh', { refreshToken: 'dummy' }, false, 401);
  await testEndpoint('POST /auth/forgot-password', 'post', '/auth/forgot-password', { email: 'test@example.com' });
  
  console.log('');

  // ========================================
  // 2. COURSES ROUTES
  // ========================================
  console.log(`${colors.blue}━━━ COURSE ROUTES ━━━${colors.reset}\n`);

  const coursesData = await testEndpoint('GET /courses', 'get', '/courses');
  const courseId = coursesData?.courses?.[0]?._id;

  if (courseId) {
    await testEndpoint(`GET /courses/${courseId}`, 'get', `/courses/${courseId}`);
  }

  await testEndpoint('GET /courses/filters', 'get', '/courses/filters');
  await testEndpoint('GET /courses/search?q=computer', 'get', '/courses/search?q=computer');
  
  // Admin routes (should fail without admin token)
  await testEndpoint('POST /courses (unauthorized)', 'post', '/courses', { name: 'Test Course' }, true, 403);
  
  console.log('');

  // ========================================
  // 3. APPLICATIONS ROUTES
  // ========================================
  console.log(`${colors.blue}━━━ APPLICATION ROUTES ━━━${colors.reset}\n`);

  if (authToken && courseId) {
    const appData = await testEndpoint(
      'POST /applications',
      'post',
      '/applications',
      {
        courseId: courseId,
        personalInfo: {
          firstName: 'Test',
          lastName: 'User',
          dateOfBirth: '2000-01-01',
          gender: 'male',
          phone: '1234567890',
          address: 'Test Address'
        },
        academicInfo: {
          highSchool: 'Test School',
          percentage: 85,
          passedYear: 2020
        }
      },
      true,
      201
    );

    testApplicationId = appData?.application?._id || appData?._id;
  }

  await testEndpoint('GET /applications', 'get', '/applications', null, true);
  
  if (testApplicationId) {
    await testEndpoint(`GET /applications/${testApplicationId}`, 'get', `/applications/${testApplicationId}`, null, true);
  }

  await testEndpoint('GET /applications/stats', 'get', '/applications/stats', null, true);
  
  console.log('');

  // ========================================
  // 4. PROFILE ROUTES
  // ========================================
  console.log(`${colors.blue}━━━ PROFILE ROUTES ━━━${colors.reset}\n`);

  await testEndpoint('GET /profile', 'get', '/profile', null, true);
  await testEndpoint(
    'PUT /profile',
    'put',
    '/profile',
    { name: 'Updated Test User' },
    true
  );
  await testEndpoint('POST /profile/upload-photo', 'post', '/profile/upload-photo', {}, true, 400);
  
  console.log('');

  // ========================================
  // 5. NOTIFICATIONS ROUTES
  // ========================================
  console.log(`${colors.blue}━━━ NOTIFICATION ROUTES ━━━${colors.reset}\n`);

  await testEndpoint('GET /notifications', 'get', '/notifications', null, true);
  await testEndpoint('GET /notifications/unread', 'get', '/notifications/unread', null, true);
  await testEndpoint('PUT /notifications/mark-read', 'put', '/notifications/mark-read', {}, true);
  
  console.log('');

  // ========================================
  // 6. ANNOUNCEMENTS ROUTES
  // ========================================
  console.log(`${colors.blue}━━━ ANNOUNCEMENT ROUTES ━━━${colors.reset}\n`);

  await testEndpoint('GET /announcements', 'get', '/announcements');
  await testEndpoint('GET /announcements/active', 'get', '/announcements/active');
  
  console.log('');

  // ========================================
  // 7. CONTACT ROUTES
  // ========================================
  console.log(`${colors.blue}━━━ CONTACT ROUTES ━━━${colors.reset}\n`);

  await testEndpoint(
    'POST /contact',
    'post',
    '/contact',
    {
      name: 'Test Contact',
      email: 'contact@example.com',
      subject: 'Test Subject',
      message: 'Test message'
    }
  );
  
  console.log('');

  // ========================================
  // 8. FORM PROGRESS ROUTES
  // ========================================
  console.log(`${colors.blue}━━━ FORM PROGRESS ROUTES ━━━${colors.reset}\n`);

  await testEndpoint('GET /form-progress', 'get', '/form-progress', null, true);
  await testEndpoint(
    'POST /form-progress',
    'post',
    '/form-progress',
    { step: 1, data: { test: 'data' } },
    true
  );
  
  console.log('');

  // ========================================
  // 9. ADMISSION CYCLE ROUTES
  // ========================================
  console.log(`${colors.blue}━━━ ADMISSION CYCLE ROUTES ━━━${colors.reset}\n`);

  await testEndpoint('GET /admission-cycle/current', 'get', '/admission-cycle/current');
  await testEndpoint('GET /admission-cycle/active', 'get', '/admission-cycle/active');
  
  console.log('');

  // ========================================
  // 10. SMART FEATURES ROUTES
  // ========================================
  console.log(`${colors.blue}━━━ SMART FEATURES ROUTES ━━━${colors.reset}\n`);

  await testEndpoint(
    'POST /smart/recommendations',
    'post',
    '/smart/recommendations',
    { preferences: { field: 'Computer Science' } },
    true
  );
  
  await testEndpoint(
    'POST /smart/chatbot',
    'post',
    '/smart/chatbot',
    { message: 'What courses do you offer?' }
  );
  
  console.log('');

  // ========================================
  // SUMMARY
  // ========================================
  console.log('\n' + '='.repeat(60));
  console.log('  TEST SUMMARY');
  console.log('='.repeat(60) + '\n');
  
  const total = results.passed + results.failed + results.warnings;
  const passRate = ((results.passed / total) * 100).toFixed(1);
  
  console.log(`${colors.green}Passed:${colors.reset}   ${results.passed}/${total} (${passRate}%)`);
  console.log(`${colors.red}Failed:${colors.reset}   ${results.failed}/${total}`);
  console.log(`${colors.yellow}Warnings:${colors.reset} ${results.warnings}/${total}`);
  
  if (results.errors.length > 0) {
    console.log(`\n${colors.red}━━━ ERRORS FOUND ━━━${colors.reset}\n`);
    results.errors.forEach((err, idx) => {
      console.log(`${idx + 1}. ${err.name}`);
      console.log(`   URL: ${err.url}`);
      console.log(`   Status: ${err.status}`);
      console.log(`   Message: ${err.message}\n`);
    });
  }
  
  console.log('='.repeat(60) + '\n');
  
  // Exit with error code if tests failed
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
