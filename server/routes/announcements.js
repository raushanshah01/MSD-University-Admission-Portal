
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Announcement = require('../models/Announcement');

// Get active announcements (public)
router.get('/', async (req, res) => {
  try {
    const { targetAudience } = req.query;
    const filter = { 
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ]
    };
    
    if (targetAudience) {
      filter.$or = [
        { targetAudience: 'all' },
        { targetAudience }
      ];
    }
    
    const announcements = await Announcement.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json(announcements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get only active announcements (alias for backward compatibility)
router.get('/active', async (req, res) => {
  try {
    const { targetAudience } = req.query;
    const filter = { 
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ]
    };
    
    if (targetAudience) {
      filter.targetAudience = { $in: ['all', targetAudience] };
    }
    
    const announcements = await Announcement.find(filter)
      .populate('createdBy', 'name')
      .sort({ priority: -1, createdAt: -1 })
      .limit(10);
    
    res.json({ announcements, total: announcements.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get single announcement
router.get('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!announcement) {
      return res.status(404).json({ msg: 'Announcement not found' });
    }
    
    res.json(announcement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin: Create announcement
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Forbidden' });
  }
  
  try {
    const { title, message, type, targetAudience, expiresAt } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ msg: 'Title and message are required' });
    }
    
    const announcement = new Announcement({
      title,
      message,
      type: type || 'general',
      targetAudience: targetAudience || 'all',
      createdBy: req.user.id,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined
    });
    
    await announcement.save();
    res.json({ msg: 'Announcement created', announcement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin: Update announcement
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Forbidden' });
  }
  
  try {
    const { title, message, type, targetAudience, isActive, expiresAt } = req.body;
    
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, message, type, targetAudience, isActive, expiresAt },
      { new: true }
    );
    
    if (!announcement) {
      return res.status(404).json({ msg: 'Announcement not found' });
    }
    
    res.json({ msg: 'Announcement updated', announcement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin: Delete announcement
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Forbidden' });
  }
  
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ msg: 'Announcement not found' });
    }
    
    res.json({ msg: 'Announcement deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
