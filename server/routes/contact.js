
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Contact = require('../models/Contact');
const Notification = require('../models/Notification');

// Submit contact/query form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }
    
    const contact = new Contact({
      user: req.user?.id,
      name,
      email,
      phone,
      subject,
      message
    });
    
    await contact.save();
    res.json({ msg: 'Your query has been submitted. We will get back to you soon.', contact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user's own queries
router.get('/my-queries', auth, async (req, res) => {
  try {
    const queries = await Contact.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin: Get all queries
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Forbidden' });
  }
  
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const queries = await Contact.find(filter)
      .populate('user', 'name email')
      .populate('repliedBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json(queries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin: Reply to query
router.put('/:id/reply', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Forbidden' });
  }
  
  try {
    const { reply, status } = req.body;
    
    if (!reply) {
      return res.status(400).json({ msg: 'Reply message is required' });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        reply,
        status: status || 'replied',
        repliedBy: req.user.id,
        repliedAt: new Date()
      },
      { new: true }
    ).populate('user', 'name email');
    
    if (!contact) {
      return res.status(404).json({ msg: 'Query not found' });
    }
    
    // Create notification for user if they have an account
    if (contact.user) {
      const notif = new Notification({
        user: contact.user._id,
        message: `Your query "${contact.subject}" has been replied to.`,
        type: 'info'
      });
      await notif.save();
    }
    
    res.json({ msg: 'Reply sent', contact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin: Update query status
router.put('/:id/status', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Forbidden' });
  }
  
  try {
    const { status } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ msg: 'Query not found' });
    }
    
    res.json({ msg: 'Status updated', contact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
