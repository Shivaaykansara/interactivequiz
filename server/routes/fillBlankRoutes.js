// routes/fillInTheBlankRoutes.js
const express = require( 'express');
const FillInTheBlank =require( '../models/fillBlankQuestions');

const router = express.Router();

// Create Fill in the Blank Exercise
router.post('/fill', async (req, res) => {
  try {
    const { sentence, blankWords } = req.body;

    // Validate input
    if (!sentence || !blankWords || blankWords.length === 0) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    // Replace blank words with underscores
    let sentenceWithBlanks = sentence;
    blankWords.forEach(word => {
      sentenceWithBlanks = sentenceWithBlanks.replace(word, '_____');
    });

    // Create new document
    const newFITB = new FillInTheBlank({
      originalSentence: sentence,
      blankWords: blankWords,
      sentenceWithBlanks: sentenceWithBlanks
    });

    // Save to database
    const savedFITB = await newFITB.save();
    res.status(201).json(savedFITB);
  } catch (error) {
    console.error('Error creating FITB:', error);
    res.status(500).json({ 
      message: 'Error creating Fill in the Blank exercise', 
      error: error.message 
    });
  }
});

// Get all Fill in the Blank Exercises
router.get('/fill', async (req, res) => {
  try {
    const fitbExercises = await FillInTheBlank.find();
    res.status(200).json(fitbExercises);
  } catch (error) {
    console.error('Error fetching FITB:', error);
    res.status(500).json({ 
      message: 'Error fetching Fill in the Blank exercises', 
      error: error.message 
    });
  }
});

module.exports = router;