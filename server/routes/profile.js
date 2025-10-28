
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

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

// Upload profile photo
router.post('/upload-photo', auth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
    
    const photoUrl = `/uploads/${req.file.filename}`;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePhoto: photoUrl },
      { new: true }
    ).select('-password');
    
    res.json({ msg: 'Profile photo uploaded', photoUrl, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
