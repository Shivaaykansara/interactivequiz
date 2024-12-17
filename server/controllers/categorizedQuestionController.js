// controllers/categorizedQuestionController.js
const CategorizedQuestion = require('../models/CategorizedQuestion');

exports.createCategorizedQuestion = async (req, res) => {
  try {
    const { question, categories } = req.body;

    // Validation
    if (!question || !categories || categories.length === 0) {
      return res.status(400).json({ 
        message: 'Question and at least one category are required' 
      });
    }

    // Create new categorized question
    const newCategorizedQuestion = new CategorizedQuestion({
      question,
      categories
    });

    // Save to database
    const savedQuestion = await newCategorizedQuestion.save();

    res.status(201).json({
      message: 'Categorized question created successfully',
      data: savedQuestion
    });
  } catch (error) {
    console.error('Error creating categorized question:', error);
    res.status(500).json({ 
      message: 'Error creating categorized question', 
      error: error.message 
    });
  }
};

exports.getAllCategorizedQuestions = async (req, res) => {
  try {
    const questions = await CategorizedQuestion.find().sort({ createdAt: -1 });
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching categorized questions:', error);
    res.status(500).json({ 
      message: 'Error fetching categorized questions', 
      error: error.message 
    });
  }
};

exports.updateCategorizedQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, categories } = req.body;

    const updatedQuestion = await CategorizedQuestion.findByIdAndUpdate(
      id, 
      { question, categories, updatedAt: Date.now() }, 
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Categorized question not found' });
    }

    res.status(200).json({
      message: 'Categorized question updated successfully',
      data: updatedQuestion
    });
  } catch (error) {
    console.error('Error updating categorized question:', error);
    res.status(500).json({ 
      message: 'Error updating categorized question', 
      error: error.message 
    });
  }
};

exports.deleteCategorizedQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedQuestion = await CategorizedQuestion.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Categorized question not found' });
    }

    res.status(200).json({
      message: 'Categorized question deleted successfully',
      data: deletedQuestion
    });
  } catch (error) {
    console.error('Error deleting categorized question:', error);
    res.status(500).json({ 
      message: 'Error deleting categorized question', 
      error: error.message 
    });
  }
};