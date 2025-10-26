
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update user profile
router.put('/', auth, async (req, res) => {
  try {
    const { name, phone, address, city, state, pincode, gender, dateOfBirth, guardianName, guardianPhone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address, city, state, pincode, gender, dateOfBirth, guardianName, guardianPhone },
      { new: true }
    ).select('-password');
    res.json({ msg: 'Profile updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
