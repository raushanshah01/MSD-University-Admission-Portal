
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get unread notifications count
router.get('/unread', async (req, res) => {
  try {
    // If no auth, return 0
    if (!req.headers.authorization) {
      return res.json({ count: 0, notifications: [] });
    }
    
    // Try to get user from token (optional auth)
    const token = req.headers.authorization.split(' ')[1];
    let userId = null;
    
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
      userId = decoded.id;
    } catch (err) {
      return res.json({ count: 0, notifications: [] });
    }
    
    if (userId) {
      const count = await Notification.countDocuments({ user: userId, isRead: false });
      const notifications = await Notification.find({ user: userId, isRead: false })
        .sort({ createdAt: -1 })
        .limit(10);
      res.json({ count, notifications });
    } else {
      res.json({ count: 0, notifications: [] });
    }
  } catch (err) {
    console.error(err);
    res.json({ count: 0, notifications: [] });
  }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ msg: 'Notification not found' });
    res.json(notification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Mark all as read
router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true }
    );
    res.json({ msg: 'All notifications marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Mark notifications as read (bulk update)
router.put('/mark-read', auth, async (req, res) => {
  try {
    const { notificationIds } = req.body;
    
    if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      await Notification.updateMany(
        { _id: { $in: notificationIds }, user: req.user.id },
        { isRead: true }
      );
      res.json({ msg: 'Notifications marked as read' });
    } else {
      // Mark all as read
      await Notification.updateMany(
        { user: req.user.id, isRead: false },
        { isRead: true }
      );
      res.json({ msg: 'All notifications marked as read' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
