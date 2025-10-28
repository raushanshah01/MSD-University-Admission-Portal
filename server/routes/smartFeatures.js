
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  recommendCourses,
  generateMeritList,
  getProgramTrends,
  predictAdmissionChance
} = require('../utils/smartFeatures');
const {
  getChatbotResponse,
  getFAQsByCategory,
  getAllCategories,
  searchFAQs
} = require('../utils/chatbot');
const { getTranslations, getSupportedLanguages } = require('../config/i18n');

// Course Recommendations
router.post('/recommend-courses', auth, async (req, res) => {
  try {
    const { percentage, previousEducation, category, interests } = req.body;
    
    if (!percentage || !previousEducation) {
      return res.status(400).json({ msg: 'Please provide percentage and previous education' });
    }
    
    const recommendations = await recommendCourses({
      percentage,
      previousEducation,
      category: category || 'General',
      interests: interests || ''
    });
    
    res.json({
      msg: 'Course recommendations generated',
      recommendations,
      count: recommendations.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Alias for recommendations
router.post('/recommendations', auth, async (req, res) => {
  try {
    const { percentage, previousEducation, category, interests, preferences } = req.body;
    
    const userData = preferences || { percentage, previousEducation, category, interests };
    
    if (!userData.percentage && !userData.previousEducation) {
      return res.status(400).json({ msg: 'Please provide percentage and previous education' });
    }
    
    const recommendations = await recommendCourses({
      percentage: userData.percentage,
      previousEducation: userData.previousEducation,
      category: userData.category || 'General',
      interests: userData.interests || ''
    });
    
    res.json({
      msg: 'Course recommendations generated',
      recommendations,
      count: recommendations.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Generate Merit List (Admin)
router.get('/merit-list', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Forbidden' });
  }
  
  try {
    const { course, category, limit } = req.query;
    
    const meritList = await generateMeritList({
      course,
      category,
      limit: parseInt(limit) || 100
    });
    
    res.json({
      msg: 'Merit list generated',
      meritList,
      count: meritList.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get Program Trends (Admin)
router.get('/program-trends', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Forbidden' });
  }
  
  try {
    const trends = await getProgramTrends();
    
    res.json({
      msg: 'Program trends retrieved',
      trends
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Predict Admission Chance
router.post('/predict-admission', auth, async (req, res) => {
  try {
    const { course, percentage, category } = req.body;
    
    if (!course || !percentage) {
      return res.status(400).json({ msg: 'Please provide course and percentage' });
    }
    
    const prediction = await predictAdmissionChance({
      course,
      percentage,
      category: category || 'General'
    });
    
    res.json({
      msg: 'Admission chance predicted',
      prediction
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Chatbot - Get Response
router.post('/chatbot', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ msg: 'Please provide a message' });
    }
    
    const response = getChatbotResponse(message);
    
    res.json({
      userMessage: message,
      ...response
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get FAQs by Category
router.get('/faqs/:category', async (req, res) => {
  try {
    const faqs = getFAQsByCategory(req.params.category);
    
    if (!faqs) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    
    res.json(faqs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get All FAQ Categories
router.get('/faqs-categories', async (req, res) => {
  try {
    const categories = getAllCategories();
    res.json({ categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Search FAQs
router.get('/faqs-search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ msg: 'Please provide search query' });
    }
    
    const results = searchFAQs(q);
    
    res.json({
      query: q,
      results,
      count: results.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get Translations
router.get('/translations/:lang', async (req, res) => {
  try {
    const { lang } = req.params;
    const translations = getTranslations(lang);
    
    res.json({
      language: lang,
      translations
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get Supported Languages
router.get('/languages', async (req, res) => {
  try {
    const languages = getSupportedLanguages();
    res.json({ languages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
