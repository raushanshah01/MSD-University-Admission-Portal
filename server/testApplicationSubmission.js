const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

async function testApplicationSubmission() {
  console.log(`\n${colors.cyan}Testing Application Submission with File Uploads${colors.reset}\n`);

  try {
    // Step 1: Register and login
    console.log('1. Creating test user...');
    const email = `testapp${Date.now()}@example.com`;
    await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Application Test User',
      email: email,
      password: 'password123'
    });
    
    console.log('2. Logging in...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: email,
      password: 'password123'
    });
    
    const token = loginRes.data.token;
    console.log(`${colors.green}✅ Token received${colors.reset}`);

    // Step 2: Create dummy files for testing
    console.log('\n3. Creating test files...');
    const uploadsDir = path.join(__dirname, 'test-uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    // Create dummy image files
    const createDummyFile = (filename, content) => {
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, content);
      return filePath;
    };

    const photoPath = createDummyFile('photo.jpg', 'This is a test photo file');
    const marksheet10Path = createDummyFile('marksheet10.pdf', 'This is a test marksheet 10th');
    const marksheet12Path = createDummyFile('marksheet12.pdf', 'This is a test marksheet 12th');
    const certificatePath = createDummyFile('certificate.pdf', 'This is a test certificate');
    const idProofPath = createDummyFile('idproof.pdf', 'This is a test ID proof');

    console.log(`${colors.green}✅ Test files created${colors.reset}`);

    // Step 3: Submit application with files
    console.log('\n4. Submitting application with files...');
    
    const formData = new FormData();
    
    // Add text fields
    formData.append('fullName', 'Test Applicant');
    formData.append('dob', '2000-01-01');
    formData.append('gender', 'Male');
    formData.append('category', 'General');
    formData.append('course', 'B.Tech Computer Science');
    formData.append('phone', '9876543210');
    formData.append('email', 'applicant@test.com');
    formData.append('address', '123 Test Address, Test City, Test State - 123456');
    formData.append('guardianName', 'Test Guardian');
    formData.append('guardianPhone', '9876543211');
    formData.append('previousEducation', '12th');
    formData.append('percentage', '85');
    
    // Add files
    formData.append('photo', fs.createReadStream(photoPath));
    formData.append('marksheet10', fs.createReadStream(marksheet10Path));
    formData.append('marksheet12', fs.createReadStream(marksheet12Path));
    formData.append('certificate', fs.createReadStream(certificatePath));
    formData.append('idProof', fs.createReadStream(idProofPath));

    const submitRes = await axios.post(`${BASE_URL}/applications`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      }
    });

    console.log(`${colors.green}✅ APPLICATION SUBMITTED SUCCESSFULLY!${colors.reset}`);
    console.log('\nApplication Details:');
    console.log(`   Application Number: ${submitRes.data.application.applicationNumber}`);
    console.log(`   Status: ${submitRes.data.application.status}`);
    console.log(`   Course: ${submitRes.data.application.course}`);
    console.log(`   Full Name: ${submitRes.data.application.fullName}`);
    
    if (submitRes.data.application.documents) {
      console.log('\nUploaded Documents:');
      const docs = submitRes.data.application.documents;
      if (docs.photo) console.log(`   📷 Photo: ${docs.photo}`);
      if (docs.marksheet10) console.log(`   📄 Marksheet 10th: ${docs.marksheet10}`);
      if (docs.marksheet12) console.log(`   📄 Marksheet 12th: ${docs.marksheet12}`);
      if (docs.certificate) console.log(`   🎓 Certificate: ${docs.certificate}`);
      if (docs.idProof) console.log(`   🆔 ID Proof: ${docs.idProof}`);
    }

    // Cleanup
    console.log('\n5. Cleaning up test files...');
    fs.unlinkSync(photoPath);
    fs.unlinkSync(marksheet10Path);
    fs.unlinkSync(marksheet12Path);
    fs.unlinkSync(certificatePath);
    fs.unlinkSync(idProofPath);
    fs.rmdirSync(uploadsDir);
    console.log(`${colors.green}✅ Cleanup complete${colors.reset}`);

    console.log(`\n${colors.green}╔══════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.green}║  ✅ POST /applications IS WORKING PERFECTLY!       ║${colors.reset}`);
    console.log(`${colors.green}╚══════════════════════════════════════════════════════╝${colors.reset}\n`);

  } catch (error) {
    console.error(`${colors.red}❌ Error: ${error.response?.data?.msg || error.message}${colors.reset}`);
    if (error.response?.data) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}  File Upload Test for POST /api/applications${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}`);

testApplicationSubmission();
