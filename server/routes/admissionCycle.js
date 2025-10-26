
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const AdmissionCycle = require('../models/AdmissionCycle');

// Get active admission cycle (public)
router.get('/active', async (req, res) => {
  try {
    const cycle = await AdmissionCycle.findOne({ isActive: true });
    if (!cycle) {
      return res.json({ isOpen: false, message: 'No active admission cycle' });
    }
    
    const now = new Date();
    const isOpen = cycle.allowApplications && now >= cycle.startDate && now <= cycle.endDate;
    
    res.json({
      isOpen,
      cycle: {
        name: cycle.name,
        year: cycle.year,
        startDate: cycle.startDate,
        endDate: cycle.endDate,
        description: cycle.description
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all admission cycles (Admin)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Forbidden' });
  }
  
  try {
    const cycles = await AdmissionCycle.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(cycles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create admission cycle (Admin)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Forbidden' });
  }
  
  try {
    const { name, year, startDate, endDate, description, isActive, allowApplications } = req.body;
    
    if (!name || !year || !startDate || !endDate) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }
    
    const cycle = new AdmissionCycle({
      name,
      year,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description,
      isActive: isActive || false,
      allowApplications: allowApplications !== false,
      createdBy: req.user.id
    });
    
    await cycle.save();
    res.json({ msg: 'Admission cycle created', cycle });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update admission cycle (Admin)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Forbidden' });
  }
  
  try {
    const { name, year, startDate, endDate, description, isActive, allowApplications } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (year) updateData.year = year;
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (allowApplications !== undefined) updateData.allowApplications = allowApplications;
    
    const cycle = await AdmissionCycle.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!cycle) {
      return res.status(404).json({ msg: 'Admission cycle not found' });
    }
    
    res.json({ msg: 'Admission cycle updated', cycle });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Toggle application acceptance (Admin)
router.put('/:id/toggle-applications', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Forbidden' });
  }
  
  try {
    const cycle = await AdmissionCycle.findById(req.params.id);
    if (!cycle) {
      return res.status(404).json({ msg: 'Admission cycle not found' });
    }
    
    cycle.allowApplications = !cycle.allowApplications;
    await cycle.save();
    
    res.json({
      msg: `Applications ${cycle.allowApplications ? 'opened' : 'closed'}`,
      cycle
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete admission cycle (Admin)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Forbidden' });
  }
  
  try {
    const cycle = await AdmissionCycle.findByIdAndDelete(req.params.id);
    if (!cycle) {
      return res.status(404).json({ msg: 'Admission cycle not found' });
    }
    
    res.json({ msg: 'Admission cycle deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
