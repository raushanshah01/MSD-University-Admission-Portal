
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const Course = require('../models/Course');
const User = require('../models/User');
const FormProgress = require('../models/FormProgress');
const { sendApplicationStatusEmail } = require('../utils/emailService');
const { exportToCSV, exportToExcel, exportStatisticsToExcel } = require('../utils/exportData');
const { generateOfferLetter, generateSummaryReport } = require('../utils/pdfGenerator');
const path = require('path');

// Document uploads are now optional - removed for easier development

// Helper to generate application number
function generateAppNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `APP${timestamp}${random}`;
}

// Helper to create notification
async function createNotification(userId, message, type = 'info', appId = null) {
  try {
    const notif = new Notification({
      user: userId,
      message,
      type,
      relatedApplication: appId
    });
    await notif.save();
  } catch (err) {
    console.error('Notification error:', err);
  }
}

// submit application (documents removed for easier development)
router.post('/', auth, async (req, res) => {
  try {
    console.log('📥 Received application data:', JSON.stringify(req.body, null, 2));
    
    const { name, dob, gender, category, course, phone, email, address, guardianName, guardianPhone, previousEducation, percentage } = req.body;
    
    // Validate name object
    if (!name) {
      console.log('❌ Name object is missing');
      return res.status(400).json({ msg: 'Name is required' });
    }
    
    if (!name.firstName || !name.firstName.trim()) {
      console.log('❌ First name is missing or empty');
      return res.status(400).json({ msg: 'First name is required' });
    }
    
    if (!name.lastName || !name.lastName.trim()) {
      console.log('❌ Last name is missing or empty');
      return res.status(400).json({ msg: 'Last name is required' });
    }
    
    console.log('✅ Name validated:', name);
    
    const app = new Application({
      user: req.user.id,
      name: {
        firstName: name.firstName.trim(),
        middleName: name.middleName ? name.middleName.trim() : '',
        lastName: name.lastName.trim()
      },
      dob,
      gender,
      category: category || '',
      course,
      phone,
      email,
      address,
      guardianName: guardianName || '',
      guardianPhone: guardianPhone || '',
      previousEducation,
      percentage,
      documents: {}, // Empty documents object
      applicationNumber: generateAppNumber()
    });
    await app.save();
    
    // Clear form progress after successful submission
    await FormProgress.findOneAndDelete({ user: req.user.id });
    
    // Create notification
    await createNotification(req.user.id, `Your application ${app.applicationNumber} has been submitted successfully.`, 'success', app._id);
    
    // Send email notification
    const user = await User.findById(req.user.id);
    if (user && process.env.EMAIL_USER) {
      await sendApplicationStatusEmail(user.email, user.name, app.applicationNumber, 'Submitted', 'Your application has been received and is under review.');
    }
    
    res.json({ msg: 'Application submitted', application: app });
  } catch (err) {
    console.error('Application submission error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// get my applications (applicant)
router.get('/me', auth, async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// get single application (applicant)
router.get('/me/:id', auth, async (req, res) => {
  try {
    const app = await Application.findOne({ _id: req.params.id, user: req.user.id });
    if (!app) return res.status(404).json({ msg: 'Application not found' });
    res.json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// admin: list all with filters
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  try {
    const { status, course, category, search } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (course) filter.course = course;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { applicationNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const apps = await Application.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// admin: get single application
router.get('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  try {
    const app = await Application.findById(req.params.id).populate('user', 'name email phone');
    if (!app) return res.status(404).json({ msg: 'Application not found' });
    res.json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// admin: update status
router.put('/:id/status', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  try {
    const { status, remarks } = req.body;
    const updateData = { status, remarks };
    
    if (status === 'Verified') updateData.verifiedAt = new Date();
    if (status === 'Approved') updateData.approvedAt = new Date();
    
    const app = await Application.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!app) return res.status(404).json({ msg: 'Application not found' });
    
    // Create notification for applicant
    let notifMsg = `Your application ${app.applicationNumber} status has been updated to: ${status}`;
    let notifType = 'info';
    if (status === 'Approved') {
      notifMsg = `Congratulations! Your application ${app.applicationNumber} has been approved.`;
      notifType = 'success';
    } else if (status === 'Rejected') {
      notifMsg = `Your application ${app.applicationNumber} has been rejected. ${remarks || ''}`;
      notifType = 'error';
    } else if (status === 'Verified') {
      notifMsg = `Your application ${app.applicationNumber} has been verified and is under review.`;
      notifType = 'success';
    }
    
    await createNotification(app.user, notifMsg, notifType, app._id);
    
    // Send email notification
    const user = await User.findById(app.user);
    if (user && process.env.EMAIL_USER) {
      await sendApplicationStatusEmail(user.email, user.name, app.applicationNumber, status, remarks);
    }
    
    res.json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// admin: get statistics
router.get('/admin/statistics', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  try {
    const total = await Application.countDocuments();
    const pending = await Application.countDocuments({ status: 'Pending' });
    const verified = await Application.countDocuments({ status: 'Verified' });
    const approved = await Application.countDocuments({ status: 'Approved' });
    const rejected = await Application.countDocuments({ status: 'Rejected' });
    const hold = await Application.countDocuments({ status: 'Hold' });
    
    // Get course-wise stats
    const byCourse = await Application.aggregate([
      { $group: { _id: '$course', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get category-wise stats
    const byCategory = await Application.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      total,
      pending,
      verified,
      approved,
      rejected,
      hold,
      byCourse,
      byCategory
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Bulk approve applications (Admin)
router.post('/bulk-approve', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  
  try {
    const { applicationIds } = req.body;
    
    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({ msg: 'Please provide application IDs' });
    }
    
    const result = await Application.updateMany(
      { _id: { $in: applicationIds } },
      { 
        status: 'Approved',
        approvedAt: new Date()
      }
    );
    
    // Send notifications
    const applications = await Application.find({ _id: { $in: applicationIds } });
    for (const app of applications) {
      await createNotification(
        app.user,
        `Congratulations! Your application ${app.applicationNumber} has been approved.`,
        'success',
        app._id
      );
      
      const user = await User.findById(app.user);
      if (user && process.env.EMAIL_USER) {
        await sendApplicationStatusEmail(user.email, user.name, app.applicationNumber, 'Approved', '');
      }
    }
    
    res.json({ msg: `${result.modifiedCount} applications approved`, count: result.modifiedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Bulk reject applications (Admin)
router.post('/bulk-reject', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  
  try {
    const { applicationIds, remarks } = req.body;
    
    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({ msg: 'Please provide application IDs' });
    }
    
    const result = await Application.updateMany(
      { _id: { $in: applicationIds } },
      { 
        status: 'Rejected',
        remarks: remarks || 'Application rejected'
      }
    );
    
    // Send notifications
    const applications = await Application.find({ _id: { $in: applicationIds } });
    for (const app of applications) {
      await createNotification(
        app.user,
        `Your application ${app.applicationNumber} has been rejected. ${remarks || ''}`,
        'error',
        app._id
      );
      
      const user = await User.findById(app.user);
      if (user && process.env.EMAIL_USER) {
        await sendApplicationStatusEmail(user.email, user.name, app.applicationNumber, 'Rejected', remarks);
      }
    }
    
    res.json({ msg: `${result.modifiedCount} applications rejected`, count: result.modifiedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Export applications to CSV (Admin)
router.get('/export/csv', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  
  try {
    const { status, course, category } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (course) filter.course = course;
    if (category) filter.category = category;
    
    const applications = await Application.find(filter).lean();
    const filePath = await exportToCSV(applications);
    
    res.json({ msg: 'Export successful', filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Export applications to Excel (Admin)
router.get('/export/excel', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  
  try {
    const { status, course, category } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (course) filter.course = course;
    if (category) filter.category = category;
    
    const applications = await Application.find(filter).lean();
    const filePath = await exportToExcel(applications);
    
    res.json({ msg: 'Export successful', filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Export statistics to Excel (Admin)
router.get('/export/statistics', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  
  try {
    const total = await Application.countDocuments();
    const pending = await Application.countDocuments({ status: 'Pending' });
    const verified = await Application.countDocuments({ status: 'Verified' });
    const approved = await Application.countDocuments({ status: 'Approved' });
    const rejected = await Application.countDocuments({ status: 'Rejected' });
    const hold = await Application.countDocuments({ status: 'Hold' });
    
    const byCourse = await Application.aggregate([
      { $group: { _id: '$course', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const byCategory = await Application.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const byGender = await Application.aggregate([
      { $group: { _id: '$gender', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const statistics = {
      total, pending, verified, approved, rejected, hold,
      byCourse, byCategory, byGender
    };
    
    const filePath = await exportStatisticsToExcel(statistics);
    
    res.json({ msg: 'Export successful', filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Generate offer letter (Admin)
router.post('/:id/generate-offer', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ msg: 'Application not found' });
    
    if (app.status !== 'Approved') {
      return res.status(400).json({ msg: 'Application must be approved first' });
    }
    
    const user = await User.findById(app.user);
    const offerLetterUrl = await generateOfferLetter(app, user);
    
    app.offerLetterGenerated = true;
    app.offerLetterUrl = offerLetterUrl;
    await app.save();
    
    await createNotification(
      app.user,
      `Your offer letter for application ${app.applicationNumber} has been generated.`,
      'success',
      app._id
    );
    
    res.json({ msg: 'Offer letter generated', offerLetterUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Confirm admission and lock seat (Admin)
router.post('/:id/confirm-admission', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ msg: 'Application not found' });
    
    if (app.status !== 'Approved') {
      return res.status(400).json({ msg: 'Application must be approved first' });
    }
    
    if (app.seatLocked) {
      return res.status(400).json({ msg: 'Seat already locked for this application' });
    }
    
    // Generate student ID and roll number
    const year = new Date().getFullYear().toString().slice(-2);
    const courseCode = app.course.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    app.studentId = `STU${year}${courseCode}${randomNum}`;
    app.rollNumber = `${year}${courseCode}${randomNum}`;
    app.isAdmitted = true;
    app.admittedAt = new Date();
    app.seatLocked = true;
    app.seatLockedAt = new Date();
    
    await app.save();
    
    // Update course seat availability
    const course = await Course.findOne({ name: app.course });
    if (course && course.availableSeats > 0) {
      course.availableSeats -= 1;
      await course.save();
    }
    
    await createNotification(
      app.user,
      `Congratulations! Your admission has been confirmed. Student ID: ${app.studentId}`,
      'success',
      app._id
    );
    
    res.json({ 
      msg: 'Admission confirmed and seat locked', 
      studentId: app.studentId,
      rollNumber: app.rollNumber
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Generate summary report PDF (Admin)
router.get('/reports/summary', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  
  try {
    const total = await Application.countDocuments();
    const pending = await Application.countDocuments({ status: 'Pending' });
    const verified = await Application.countDocuments({ status: 'Verified' });
    const approved = await Application.countDocuments({ status: 'Approved' });
    const rejected = await Application.countDocuments({ status: 'Rejected' });
    const hold = await Application.countDocuments({ status: 'Hold' });
    
    const byCourse = await Application.aggregate([
      { $group: { _id: '$course', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const byCategory = await Application.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const byGender = await Application.aggregate([
      { $group: { _id: '$gender', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const statistics = {
      total, pending, verified, approved, rejected, hold,
      byCourse, byCategory, byGender
    };
    
    const reportUrl = await generateSummaryReport(statistics);
    
    res.json({ msg: 'Report generated', reportUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get enhanced statistics with demographics (Admin)
router.get('/admin/analytics', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  
  try {
    const total = await Application.countDocuments();
    const pending = await Application.countDocuments({ status: 'Pending' });
    const verified = await Application.countDocuments({ status: 'Verified' });
    const approved = await Application.countDocuments({ status: 'Approved' });
    const rejected = await Application.countDocuments({ status: 'Rejected' });
    const hold = await Application.countDocuments({ status: 'Hold' });
    const admitted = await Application.countDocuments({ isAdmitted: true });
    
    const byCourse = await Application.aggregate([
      { $group: { _id: '$course', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const byCategory = await Application.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const byGender = await Application.aggregate([
      { $group: { _id: '$gender', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Seat usage per course
    const courses = await Course.find();
    const seatUsage = courses.map(course => ({
      course: course.name,
      totalSeats: course.totalSeats,
      availableSeats: course.availableSeats,
      occupiedSeats: course.totalSeats - course.availableSeats,
      usagePercentage: ((course.totalSeats - course.availableSeats) / course.totalSeats * 100).toFixed(2)
    }));
    
    res.json({
      total,
      pending,
      verified,
      approved,
      rejected,
      hold,
      admitted,
      byCourse,
      byCategory,
      byGender,
      seatUsage
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
