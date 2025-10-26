const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let adminToken = '';
let refreshToken = '';
let testUserId = '';
let testApplicationId = '';
let testCourseId = '';
let testAnnouncementId = '';
let testContactId = '';
let testCycleId = '';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(endpoint, message) {
  log(`✅ ${endpoint}: ${message}`, colors.green);
}

function logError(endpoint, error) {
  const errorMsg = typeof error === 'object' && error.message ? error.message : error;
  log(`❌ ${endpoint}: ${errorMsg}`, colors.red);
}

function logSection(section) {
  log(`\n${'='.repeat(60)}`, colors.blue);
  log(`  ${section}`, colors.blue);
  log(`${'='.repeat(60)}`, colors.blue);
}

// Helper to get auth headers
function getAuthHeaders(token) {
  return { 'Authorization': `Bearer ${token}` };
}

// Helper function to make requests
async function testEndpoint(method, endpoint, data = null, headers = {}, expectError = false) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      validateStatus: () => true // Accept all status codes
    };

    if (data) {
      if (method === 'GET') {
        config.params = data;
      } else {
        config.data = data;
      }
    }

    const response = await axios(config);
    
    // Check if response is successful (2xx status code)
    if (response.status >= 200 && response.status < 300) {
      if (!expectError) {
        logSuccess(`${method} ${endpoint}`, response.data.msg || `Status: ${response.status}`);
      }
      return response.data;
    } else {
      // Handle non-2xx responses
      if (expectError) {
        logSuccess(`${method} ${endpoint}`, `Expected error: ${response.data.msg || `Status ${response.status}`}`);
        return null;
      }
      logError(`${method} ${endpoint}`, response.data.msg || `Status ${response.status}`);
      return null;
    }
  } catch (error) {
    if (expectError) {
      logSuccess(`${method} ${endpoint}`, `Expected error: ${error.message}`);
      return null;
    }
    console.error('Full error details:', error);
    logError(`${method} ${endpoint}`, error.message);
    return null;
  }
}

// Test Auth Endpoints
async function testAuth() {
  logSection('AUTHENTICATION ENDPOINTS');

  // Register
  const registerData = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123'
  };
  const registerRes = await testEndpoint('POST', '/auth/register', registerData);
  
  // Register with existing email (should fail)
  await testEndpoint('POST', '/auth/register', registerData, {}, true);
  
  // Login with unverified email
  const loginData = {
    email: registerData.email,
    password: registerData.password
  };
  const loginRes = await testEndpoint('POST', '/auth/login', loginData);
  
  if (loginRes && loginRes.token) {
    authToken = loginRes.token;
    refreshToken = loginRes.refreshToken;
    logSuccess('Login', `Token received: ${authToken.substring(0, 20)}...`);
  }
  
  // Refresh token
  if (refreshToken) {
    const refreshRes = await testEndpoint('POST', '/auth/refresh-token', { refreshToken });
    if (refreshRes && refreshRes.token) {
      authToken = refreshRes.token;
      logSuccess('Refresh Token', 'New token received');
    }
  }
  
  // Forgot password
  await testEndpoint('POST', '/auth/forgot-password', { email: registerData.email });
  
  // Resend verification
  await testEndpoint('POST', '/auth/resend-verification', { email: registerData.email });
  
  // Don't logout yet - we need the token for other tests
  // We'll logout at the end
  
  // Admin login
  const adminLoginRes = await testEndpoint('POST', '/auth/login', {
    email: 'admin@vignan.edu',
    password: 'Admin@123'
  });
  
  if (adminLoginRes && adminLoginRes.token) {
    adminToken = adminLoginRes.token;
    logSuccess('Admin Login', 'Admin token received');
  } else {
    // Try alternate admin credentials
    const altAdminLogin = await testEndpoint('POST', '/auth/login', {
      email: 'admin@university.com',
      password: 'admin123'
    });
    
    if (altAdminLogin && altAdminLogin.token) {
      adminToken = altAdminLogin.token;
      logSuccess('Admin Login (Alt)', 'Admin token received');
    }
  }
}

// Test Profile Endpoints
async function testProfile() {
  logSection('PROFILE ENDPOINTS');
  
  if (!authToken) {
    log('Skipping profile tests - no auth token', colors.yellow);
    return;
  }
  
  // Get profile
  await testEndpoint('GET', '/profile', null, { 'Authorization': `Bearer ${authToken}` });
  
  // Update profile
  const profileData = {
    name: 'Updated Test User',
    phone: '1234567890',
    address: '123 Test St',
    city: 'Test City',
    state: 'Test State',
    pincode: '123456',
    gender: 'Male',
    dateOfBirth: '2000-01-01'
  };
  await testEndpoint('PUT', '/profile', profileData, { 'Authorization': `Bearer ${authToken}` });
}

// Test Course Endpoints
async function testCourses() {
  logSection('COURSE ENDPOINTS');
  
  // Get all courses (public)
  const coursesRes = await testEndpoint('GET', '/courses');
  
  if (adminToken) {
    // Create course with unique name and code
    const timestamp = Date.now();
    const courseData = {
      name: `Test Engineering Course ${timestamp}`,
      code: `TENG${timestamp}`,
      duration: '4 years',
      eligibility: '12th pass with 60%',
      totalSeats: 100,
      fees: 50000,
      description: 'Test engineering program'
    };
    const createRes = await testEndpoint('POST', '/courses', courseData, getAuthHeaders(adminToken));
    
    if (createRes && createRes.course) {
      testCourseId = createRes.course._id;
      
      // Get single course
      await testEndpoint('GET', `/courses/${testCourseId}`);
      
      // Update course
      await testEndpoint('PUT', `/courses/${testCourseId}`, {
        ...courseData,
        fees: 55000
      }, getAuthHeaders(adminToken));
      
      // Don't delete for now - we'll use it for applications
    }
  }
}

// Test Application Endpoints
async function testApplications() {
  logSection('APPLICATION ENDPOINTS');
  
  if (!authToken) {
    log('Skipping application tests - no auth token', colors.yellow);
    return;
  }
  
  // Note: Application submission requires multipart/form-data with file uploads
  // We'll skip the POST and test other endpoints instead
  log('⚠️  Skipping POST /applications (requires file uploads via multipart/form-data)', colors.yellow);
  
  // Get my applications (should return empty array or existing apps)
  await testEndpoint('GET', '/applications/me', null, getAuthHeaders(authToken));
  
  // Admin endpoints
  if (adminToken) {
    // Get all applications
    const appsRes = await testEndpoint('GET', '/applications', null, getAuthHeaders(adminToken));
    
    // Get with filters
    await testEndpoint('GET', '/applications', { status: 'Pending' }, getAuthHeaders(adminToken));
    
    // If there are existing applications, test with the first one
    if (appsRes && Array.isArray(appsRes) && appsRes.length > 0) {
      testApplicationId = appsRes[0]._id;
      
      // Get single application
      await testEndpoint('GET', `/applications/${testApplicationId}`, null, getAuthHeaders(adminToken));
      
      // Update status
      await testEndpoint('PUT', `/applications/${testApplicationId}/status`, {
        status: 'Verified',
        remarks: 'Test verification'
      }, getAuthHeaders(adminToken));
      
      // Bulk approve
      await testEndpoint('POST', '/applications/bulk-approve', {
        applicationIds: [testApplicationId]
      }, getAuthHeaders(adminToken));
      
      // Generate offer letter
      await testEndpoint('POST', `/applications/${testApplicationId}/generate-offer`, null, getAuthHeaders(adminToken));
      
      // Confirm admission
      await testEndpoint('POST', `/applications/${testApplicationId}/confirm-admission`, null, getAuthHeaders(adminToken));
    } else {
      log('ℹ️  No existing applications to test admin endpoints', colors.yellow);
    }
    
    // Get statistics (works even with no applications)
    await testEndpoint('GET', '/applications/admin/statistics', null, getAuthHeaders(adminToken));
    
    // Get analytics
    await testEndpoint('GET', '/applications/admin/analytics', null, getAuthHeaders(adminToken));
    
    // Export endpoints
    await testEndpoint('GET', '/applications/export/csv', null, getAuthHeaders(adminToken));
    await testEndpoint('GET', '/applications/export/excel', null, getAuthHeaders(adminToken));
    await testEndpoint('GET', '/applications/export/statistics', null, getAuthHeaders(adminToken));
    
    // Generate summary report
    await testEndpoint('GET', '/applications/reports/summary', null, getAuthHeaders(adminToken));
  }
}

// Test Notification Endpoints
async function testNotifications() {
  logSection('NOTIFICATION ENDPOINTS');
  
  if (!authToken) {
    log('Skipping notification tests - no auth token', colors.yellow);
    return;
  }
  
  // Get notifications
  const notifsRes = await testEndpoint('GET', '/notifications', null, getAuthHeaders(authToken));
  
  if (notifsRes && notifsRes.length > 0) {
    const notifId = notifsRes[0]._id;
    
    // Mark as read
    await testEndpoint('PUT', `/notifications/${notifId}/read`, null, getAuthHeaders(authToken));
  }
  
  // Mark all as read
  await testEndpoint('PUT', '/notifications/read-all', null, getAuthHeaders(authToken));
}

// Test Announcement Endpoints
async function testAnnouncements() {
  logSection('ANNOUNCEMENT ENDPOINTS');
  
  // Get announcements (public)
  await testEndpoint('GET', '/announcements');
  
  // Get with filter
  await testEndpoint('GET', '/announcements', { targetAudience: 'applicant' });
  
  if (adminToken) {
    // Create announcement
    const announcementData = {
      title: 'Test Announcement',
      message: 'This is a test announcement',
      type: 'general',
      targetAudience: 'all',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
    
    const createRes = await testEndpoint('POST', '/announcements', announcementData, getAuthHeaders(adminToken));
    
    if (createRes && createRes.announcement) {
      testAnnouncementId = createRes.announcement._id;
      
      // Get single announcement
      await testEndpoint('GET', `/announcements/${testAnnouncementId}`);
      
      // Update announcement
      await testEndpoint('PUT', `/announcements/${testAnnouncementId}`, {
        ...announcementData,
        title: 'Updated Test Announcement'
      }, getAuthHeaders(adminToken));
      
      // Delete announcement
      await testEndpoint('DELETE', `/announcements/${testAnnouncementId}`, null, getAuthHeaders(adminToken));
    }
  }
}

// Test Contact Endpoints
async function testContact() {
  logSection('CONTACT ENDPOINTS');
  
  // Submit contact form
  const contactData = {
    name: 'Test Contact',
    email: 'contact@test.com',
    phone: '9876543210',
    subject: 'Test Query',
    message: 'This is a test query'
  };
  
  const submitRes = await testEndpoint('POST', '/contact', contactData);
  
  if (submitRes && submitRes.contact) {
    testContactId = submitRes.contact._id;
  }
  
  // Get my queries (if logged in)
  if (authToken) {
    await testEndpoint('GET', '/contact/my-queries', null, getAuthHeaders(authToken));
  }
  
  if (adminToken && testContactId) {
    // Get all queries
    await testEndpoint('GET', '/contact', null, getAuthHeaders(adminToken));
    
    // Get with filter
    await testEndpoint('GET', '/contact', { status: 'pending' }, getAuthHeaders(adminToken));
    
    // Reply to query
    await testEndpoint('PUT', `/contact/${testContactId}/reply`, {
      reply: 'Test reply to your query',
      status: 'replied'
    }, getAuthHeaders(adminToken));
    
    // Update status
    await testEndpoint('PUT', `/contact/${testContactId}/status`, {
      status: 'closed'
    }, getAuthHeaders(adminToken));
  }
}

// Test Form Progress Endpoints
async function testFormProgress() {
  logSection('FORM PROGRESS ENDPOINTS');
  
  if (!authToken) {
    log('Skipping form progress tests - no auth token', colors.yellow);
    return;
  }
  
  // Get form progress
  await testEndpoint('GET', '/form-progress', null, getAuthHeaders(authToken));
  
  // Save form progress
  await testEndpoint('POST', '/form-progress', {
    step: 2,
    formData: {
      fullName: 'Test User',
      email: 'test@example.com'
    }
  }, getAuthHeaders(authToken));
  
  // Clear form progress
  await testEndpoint('DELETE', '/form-progress', null, getAuthHeaders(authToken));
}

// Test Admission Cycle Endpoints
async function testAdmissionCycle() {
  logSection('ADMISSION CYCLE ENDPOINTS');
  
  // Get active cycle (public)
  await testEndpoint('GET', '/admission-cycle/active');
  
  if (adminToken) {
    // Get all cycles
    await testEndpoint('GET', '/admission-cycle', null, getAuthHeaders(adminToken));
    
    // Create cycle
    const cycleData = {
      name: 'Test Admission Cycle 2024',
      year: 2024,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      description: 'Test admission cycle',
      isActive: false,
      allowApplications: true
    };
    
    const createRes = await testEndpoint('POST', '/admission-cycle', cycleData, getAuthHeaders(adminToken));
    
    if (createRes && createRes.cycle) {
      testCycleId = createRes.cycle._id;
      
      // Update cycle
      await testEndpoint('PUT', `/admission-cycle/${testCycleId}`, {
        ...cycleData,
        isActive: true
      }, getAuthHeaders(adminToken));
      
      // Toggle applications
      await testEndpoint('PUT', `/admission-cycle/${testCycleId}/toggle-applications`, null, getAuthHeaders(adminToken));
      
      // Delete cycle
      await testEndpoint('DELETE', `/admission-cycle/${testCycleId}`, null, getAuthHeaders(adminToken));
    }
  }
}

// Test Smart Features Endpoints
async function testSmartFeatures() {
  logSection('SMART FEATURES ENDPOINTS');
  
  if (!authToken) {
    log('Skipping smart features tests - no auth token', colors.yellow);
    return;
  }
  
  // Course recommendations
  await testEndpoint('POST', '/smart/recommend-courses', {
    percentage: 85,
    previousEducation: '12th',
    category: 'General',
    interests: 'technology, engineering'
  }, getAuthHeaders(authToken));
  
  // Predict admission chance
  await testEndpoint('POST', '/smart/predict-admission', {
    course: 'B.Tech Computer Science',
    percentage: 85,
    category: 'General'
  }, getAuthHeaders(authToken));
  
  // Chatbot
  await testEndpoint('POST', '/smart/chatbot', {
    message: 'What is the admission process?'
  });
  
  // Get FAQs by category
  await testEndpoint('GET', '/smart/faqs/admission');
  
  // Get FAQ categories
  await testEndpoint('GET', '/smart/faqs-categories');
  
  // Search FAQs
  await testEndpoint('GET', '/smart/faqs-search', { q: 'admission' });
  
  // Get translations
  await testEndpoint('GET', '/smart/translations/en');
  
  // Get supported languages
  await testEndpoint('GET', '/smart/languages');
  
  if (adminToken) {
    // Merit list
    await testEndpoint('GET', '/smart/merit-list', { limit: 10 }, getAuthHeaders(adminToken));
    
    // Program trends
    await testEndpoint('GET', '/smart/program-trends', null, getAuthHeaders(adminToken));
  }
}

// Test Logout
async function testLogout() {
  logSection('LOGOUT ENDPOINT');
  
  if (authToken) {
    await testEndpoint('POST', '/auth/logout', null, getAuthHeaders(authToken));
  }
}

// Test Base Endpoint
async function testBaseEndpoint() {
  logSection('BASE ENDPOINT');
  
  try {
    const response = await axios.get('http://localhost:5000');
    logSuccess('GET /', response.data.msg || 'API is running');
  } catch (error) {
    logError('GET /', error.message);
  }
}

// Main test runner
async function runAllTests() {
  log('\n🚀 Starting API Tests...', colors.magenta);
  log(`📍 Base URL: ${BASE_URL}\n`, colors.magenta);
  
  try {
    await testBaseEndpoint();
    await testAuth();
    await testProfile();
    await testCourses();
    await testApplications();
    await testNotifications();
    await testAnnouncements();
    await testContact();
    await testFormProgress();
    await testAdmissionCycle();
    await testSmartFeatures();
    await testLogout(); // Test logout at the end
    
    logSection('TEST SUMMARY');
    log('✅ All API endpoint tests completed!', colors.green);
    log('📊 Check the results above for any failures\n', colors.blue);
  } catch (error) {
    logError('Test Suite', error.message);
  }
}

// Run tests
runAllTests();
