
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const FormProgress = require('../models/FormProgress');

// Get saved form progress
router.get('/', auth, async (req, res) => {
  try {
    let progress = await FormProgress.findOne({ user: req.user.id });
    
    if (!progress) {
      progress = new FormProgress({
        user: req.user.id,
        step: 1,
        formData: {}
      });
      await progress.save();
    }
    
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Save/update form progress (auto-save)
router.post('/', auth, async (req, res) => {
  try {
    const { step, formData } = req.body;
    
    let progress = await FormProgress.findOne({ user: req.user.id });
    
    if (progress) {
      progress.step = step !== undefined ? step : progress.step;
      progress.formData = { ...progress.formData, ...formData };
      progress.lastSaved = new Date();
      await progress.save();
    } else {
      progress = new FormProgress({
        user: req.user.id,
        step: step || 1,
        formData: formData || {}
      });
      await progress.save();
    }
    
    res.json({ msg: 'Progress saved', progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Clear form progress (after successful submission)
router.delete('/', auth, async (req, res) => {
  try {
    await FormProgress.findOneAndDelete({ user: req.user.id });
    res.json({ msg: 'Progress cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
