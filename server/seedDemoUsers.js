const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./models/User');
const Course = require('./models/Course');
const Application = require('./models/Application');

// Random name data
const firstNames = [
  'Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Rohan', 'Pooja',
  'Arjun', 'Divya', 'Karan', 'Meera', 'Aditya', 'Kavya', 'Siddharth', 'Riya',
  'Varun', 'Shreya', 'Nikhil', 'Ishita', 'Akash', 'Neha', 'Harsh', 'Sakshi',
  'Kunal', 'Tanya', 'Rajesh', 'Mansi', 'Deepak', 'Aarti', 'Sanjay', 'Nisha',
  'Prakash', 'Swati', 'Ramesh', 'Preeti', 'Suresh', 'Pallavi', 'Mahesh', 'Rekha'
];

const lastNames = [
  'Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Gupta', 'Verma', 'Rao',
  'Desai', 'Mehta', 'Iyer', 'Nair', 'Chopra', 'Malhotra', 'Joshi', 'Kapoor',
  'Bhat', 'Shetty', 'Agarwal', 'Bansal', 'Saxena', 'Trivedi', 'Pandey', 'Mishra',
  'Kulkarni', 'Patil', 'Naik', 'Jain', 'Shah', 'Thakur', 'Menon', 'Pillai'
];

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune',
  'Ahmedabad', 'Jaipur', 'Lucknow', 'Surat', 'Kanpur', 'Nagpur', 'Indore',
  'Visakhapatnam', 'Vijayawada', 'Guntur', 'Warangal', 'Tirupati', 'Nellore'
];

const states = [
  'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Andhra Pradesh',
  'West Bengal', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Kerala'
];

const educationLevels = [
  '12th Grade - Science',
  '12th Grade - Commerce',
  '12th Grade - Arts',
  'Bachelor of Science',
  'Bachelor of Commerce',
  'Bachelor of Arts',
  'Bachelor of Engineering'
];

const statuses = ['Pending', 'Verified', 'Approved', 'Rejected', 'Hold'];

// Helper functions
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

const generatePhoneNumber = () => {
  return '9' + Math.floor(Math.random() * 900000000 + 100000000);
};

const generateEmail = (firstName, lastName) => {
  const domain = getRandomElement(['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com']);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 999)}@${domain}`;
};

const generateDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generatePercentage = (min = 60, max = 98) => {
  return (Math.random() * (max - min) + min).toFixed(2);
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

// Seed demo users and applications
const seedDemoData = async () => {
  try {
    console.log('🌱 Starting demo data seeding...\n');

    // Get all active courses
    const courses = await Course.find({ isActive: true });
    if (courses.length === 0) {
      console.log('❌ No courses found. Please run seedVignanCourses.js first.');
      return;
    }
    console.log(`✅ Found ${courses.length} courses\n`);

    // Delete existing demo users (but keep admin)
    const deletedUsers = await User.deleteMany({ 
      role: 'applicant',
      email: { $ne: 'admin@vignan.edu' }
    });
    console.log(`🗑️  Deleted ${deletedUsers.deletedCount} existing demo users`);

    // Delete existing demo applications
    const deletedApps = await Application.deleteMany({});
    console.log(`🗑️  Deleted ${deletedApps.deletedCount} existing applications\n`);

    const demoUsers = [];
    const demoApplications = [];

    // Create 30 demo users
    const numberOfUsers = 30;
    console.log(`👥 Creating ${numberOfUsers} demo users...\n`);

    for (let i = 0; i < numberOfUsers; i++) {
      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const email = generateEmail(firstName, lastName);

      // Hash password (all demo users have password: Demo@123)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Demo@123', salt);

      const city = getRandomElement(cities);
      const state = getRandomElement(states);
      const pincode = String(Math.floor(Math.random() * 900000) + 100000);
      const gender = Math.random() > 0.5 ? 'Male' : 'Female';
      const dob = generateDate(new Date(1998, 0, 1), new Date(2005, 11, 31));

      const user = new User({
        name: `${firstName} ${lastName}`,
        email: email,
        password: hashedPassword,
        role: 'applicant',
        phone: generatePhoneNumber(),
        dateOfBirth: dob.toISOString().split('T')[0], // Format: YYYY-MM-DD
        gender: gender,
        address: `${Math.floor(Math.random() * 500) + 1}, ${getRandomElement(['Main Street', 'Park Avenue', 'Lake Road', 'Hill View'])}`,
        city: city,
        state: state,
        pincode: pincode,
        guardianName: `${getRandomElement(firstNames)} ${lastName}`,
        guardianPhone: generatePhoneNumber(),
        isEmailVerified: Math.random() > 0.3, // 70% verified
        createdAt: generateDate(new Date(2024, 0, 1), new Date())
      });

      await user.save();
      demoUsers.push(user);

      // Create 1-2 applications per user
      const numApplications = Math.floor(Math.random() * 2) + 1;
      
      for (let j = 0; j < numApplications; j++) {
        const selectedCourse = getRandomElement(courses);
        const status = getRandomElement(statuses);
        const submittedDate = generateDate(new Date(2024, 8, 1), new Date());
        
        // Split full name into parts
        const nameParts = user.name.split(' ');
        const nameObj = {
          firstName: nameParts[0],
          middleName: nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '',
          lastName: nameParts[nameParts.length - 1]
        };

        const application = new Application({
          user: user._id,
          name: nameObj,
          course: selectedCourse.name,
          dob: user.dateOfBirth,
          gender: user.gender,
          category: getRandomElement(['General', 'OBC', 'SC', 'ST', 'EWS']),
          phone: user.phone,
          email: user.email,
          address: `${user.address}, ${user.city}, ${user.state} - ${user.pincode}`,
          guardianName: user.guardianName,
          guardianPhone: user.guardianPhone,
          previousEducation: getRandomElement(educationLevels),
          percentage: generatePercentage(65, 98),
          status: status,
          documents: {
            photo: `https://randomuser.me/api/portraits/${user.gender === 'Male' ? 'men' : 'women'}/${Math.floor(Math.random() * 80)}.jpg`,
            marksheet10: 'demo_10th_marksheet.pdf',
            marksheet12: 'demo_12th_marksheet.pdf',
            certificate: 'demo_certificate.pdf',
            idProof: 'demo_aadhar.pdf'
          },
          remarks: status === 'Approved' ? 'Congratulations! Application approved.' :
                   status === 'Rejected' ? 'Does not meet minimum requirements.' :
                   status === 'Hold' ? 'Pending document verification.' :
                   status === 'Verified' ? 'Documents verified successfully.' : '',
          applicationNumber: `VIG${new Date().getFullYear()}${String(i * 2 + j + 1).padStart(5, '0')}`,
          submittedAt: submittedDate,
          verifiedAt: status === 'Verified' || status === 'Approved' ? generateDate(submittedDate, new Date()) : null,
          approvedAt: status === 'Approved' ? generateDate(submittedDate, new Date()) : null,
          isAdmitted: status === 'Approved' && Math.random() > 0.5,
          createdAt: submittedDate
        });

        if (application.isAdmitted) {
          application.admittedAt = generateDate(application.approvedAt, new Date());
          application.studentId = `STU${new Date().getFullYear()}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
        }

        await application.save();
        demoApplications.push(application);
      }

      // Progress indicator
      if ((i + 1) % 5 === 0) {
        console.log(`   Created ${i + 1}/${numberOfUsers} users...`);
      }
    }

    console.log('\n✅ Demo data seeding completed!\n');
    console.log('📊 Summary:');
    console.log(`   • Users created: ${demoUsers.length}`);
    console.log(`   • Applications created: ${demoApplications.length}`);
    console.log(`   • Default password for all users: Demo@123`);
    console.log('\n📧 Sample user emails:');
    demoUsers.slice(0, 5).forEach(user => {
      console.log(`   • ${user.email}`);
    });
    console.log('\n🎯 Application status distribution:');
    const statusCounts = {};
    demoApplications.forEach(app => {
      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    });
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   • ${status}: ${count}`);
    });

  } catch (err) {
    console.error('❌ Error seeding data:', err);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the seeding
const run = async () => {
  await connectDB();
  await seedDemoData();
};

run();
