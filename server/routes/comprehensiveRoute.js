const express = require('express');
const MCQ = require('../models/ComprehensiveQuestion');
const router = express.Router();

// Create MCQ
router.post('/list', async (req, res) => {
  try {
    const { paragraph, questions } = req.body;
    
    // Validate input
    if (!paragraph || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    // Create new MCQ document
    const newMCQ = new MCQ({
      paragraph,
      questions: questions.map(q => ({
        questionText: q.questionText,
        options: q.options.map(opt => ({
          text: opt.text,
          isCorrect: opt.isCorrect || false
        }))
      }))
    });

    // Save to database
    const savedMCQ = await newMCQ.save();
    res.status(201).json(savedMCQ);
  } catch (error) {
    res.status(500).json({ message: 'Error creating MCQ', error: error.message });
  }
});

// Get all MCQs
router.get('/list', async (req, res) => {
  try {
    const mcqs = await MCQ.find();
    res.status(200).json(mcqs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching MCQs', error: error.message });
  }
});

module.exports = router;