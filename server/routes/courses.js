
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/Course');

// Get all active courses (public)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true }).sort({ name: 1 });
    res.json({ courses, total: courses.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get course filters (for advanced search)
router.get('/filters', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true });
    
    // Extract unique values for filters
    const durations = [...new Set(courses.map(c => c.duration).filter(Boolean))];
    const eligibilities = [...new Set(courses.map(c => c.eligibility).filter(Boolean))];
    const departments = [...new Set(courses.map(c => c.department).filter(Boolean))];
    const feeRanges = [
      { label: 'Under ₹50,000', min: 0, max: 50000 },
      { label: '₹50,000 - ₹1,00,000', min: 50000, max: 100000 },
      { label: '₹1,00,000 - ₹2,00,000', min: 100000, max: 200000 },
      { label: 'Above ₹2,00,000', min: 200000, max: Infinity }
    ];
    
    res.json({
      durations: durations.sort(),
      eligibilities: eligibilities.sort(),
      departments: departments.sort(),
      feeRanges
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Search courses (public)
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.json({ courses: [], total: 0 });
    }
    
    const searchRegex = new RegExp(q, 'i');
    const courses = await Course.find({
      isActive: true,
      $or: [
        { name: searchRegex },
        { code: searchRegex },
        { description: searchRegex },
        { department: searchRegex },
        { eligibility: searchRegex }
      ]
    }).sort({ name: 1 });
    
    res.json({ courses, total: courses.length, query: q });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin: Create course
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  try {
    const { name, code, duration, eligibility, totalSeats, fees, description } = req.body;
    const course = new Course({
      name,
      code,
      duration,
      eligibility,
      totalSeats,
      availableSeats: totalSeats,
      fees,
      description
    });
    await course.save();
    res.json({ msg: 'Course created', course });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Course name or code already exists' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin: Update course
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  try {
    const { name, code, duration, eligibility, totalSeats, availableSeats, fees, description, isActive } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { name, code, duration, eligibility, totalSeats, availableSeats, fees, description, isActive },
      { new: true }
    );
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    res.json({ msg: 'Course updated', course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin: Delete course
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    res.json({ msg: 'Course deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
