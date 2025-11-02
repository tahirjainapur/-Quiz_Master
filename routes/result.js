const express = require('express');
const router = express.Router();
const Result = require('../models/Result');

// Save quiz result
router.post('/', async (req, res) => {
  try {
    const { quizId, quizTitle, userName, userAnswers, score, totalQuestions, percentage } = req.body;
    
    const result = new Result({
      quizId,
      quizTitle,
      userId: req.session.userId || null,
      userName: req.session.userId ? (req.session.username || userName) : (userName || 'Anonymous'),
      userAnswers,
      score,
      totalQuestions,
      percentage
    });

    const savedResult = await result.save();
    res.status(201).json(savedResult);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get current user's results
router.get('/my-results', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const results = await Result.find({ userId: req.session.userId })
      .sort({ completedAt: -1 })
      .lean();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all results
router.get('/', async (req, res) => {
  try {
    const results = await Result.find()
      .sort({ completedAt: -1 })
      .limit(50)
      .lean();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get results for a specific quiz
router.get('/quiz/:quizId', async (req, res) => {
  try {
    const results = await Result.find({ quizId: req.params.quizId })
      .sort({ completedAt: -1 })
      .lean();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

