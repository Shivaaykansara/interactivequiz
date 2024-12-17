// routes/categorizedQuestionRoutes.js
const express = require('express');
const router = express.Router();
const {
  createCategorizedQuestion,
  getAllCategorizedQuestions,
  updateCategorizedQuestion,
  deleteCategorizedQuestion
} = require('../controllers/categorizedQuestionController');

// Create a new categorized question
router.post('/cat', createCategorizedQuestion);

// Get all categorized questions
router.get('/cat', getAllCategorizedQuestions);

// Update a specific categorized question
router.put('/cat/:id', updateCategorizedQuestion);

// Delete a specific categorized question
router.delete('/cat/:id', deleteCategorizedQuestion);

module.exports = router;