const FillBlankQuestion = require('../models/fillBlankQuestions.js');

const createFillBlankQuestion = async (req, res) => {
  try {
    const { 
      originalSentence, 
      blankSentence, 
      blankWords
    } = req.body;

    // Validate inputs
    if (!originalSentence || !blankSentence || !blankWords) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create new fill blank question
    const newQuestion = new FillBlankQuestion({
      originalSentence,
      blankSentence,
      blankWords
    });

    // Save to database
    const savedQuestion = await newQuestion.save();

    res.status(201).json({
      message: 'Fill Blank Question created successfully',
      question: savedQuestion
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating fill blank question', 
      error: error.message 
    });
  }
};

const getFillBlankQuestions = async (req, res) => {
  try {
    // Fetch questions
    const questions = await FillBlankQuestion.find();

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching fill blank questions', 
      error: error.message 
    });
  }
};

module.exports = { createFillBlankQuestion, getFillBlankQuestions };