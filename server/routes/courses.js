
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/Course');

// Get all active courses (public)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true }).sort({ name: 1 });
    res.json(courses);
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
