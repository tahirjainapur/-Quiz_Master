const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// Get all quizzes (with correct answers for admin)
router.get('/admin', async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('title description questions createdAt').lean();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('title description questions').lean();
    console.log(`Found ${quizzes.length} quizzes`);
    
    // Convert questions to include only question text and options (hide correct answer)
    const sanitizedQuizzes = quizzes.map(quiz => ({
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions.map(q => {
        // Ensure options is always an array
        let optionsArray = q.options;
        if (!Array.isArray(optionsArray)) {
          // If it's a string, try to parse it or split it
          if (typeof optionsArray === 'string') {
            // Try to detect if it's space-separated or comma-separated
            if (optionsArray.includes(',')) {
              optionsArray = optionsArray.split(',').map(opt => opt.trim());
            } else {
              // Try to split by multiple spaces (original format)
              optionsArray = optionsArray.split(/\s{2,}/).map(opt => opt.trim()).filter(opt => opt.length > 0);
            }
          } else {
            optionsArray = [];
          }
        }
        return {
          _id: q._id,
          question: q.question,
          options: optionsArray
        };
      })
    }));
    
    res.json(sanitizedQuizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get a specific quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).lean();
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    // Hide correct answers from client
    const sanitizedQuiz = {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions.map(q => ({
        _id: q._id,
        question: q.question,
        options: q.options
      }))
    };
    res.json(sanitizedQuiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit quiz answers and get results
router.post('/:id/submit', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const userAnswers = req.body.answers || [];
    const totalQuestions = quiz.questions.length;
    let score = 0;
    const results = [];

    // Calculate score and feedback
    quiz.questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        score++;
      }

      results.push({
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        userAnswer: userAnswer !== undefined ? userAnswer : null,
        isCorrect: isCorrect
      });
    });

    const percentage = Math.round((score / totalQuestions) * 100);

    res.json({
      score,
      totalQuestions,
      percentage,
      results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new quiz (for admin/testing purposes)
router.post('/', async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    const savedQuiz = await quiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

