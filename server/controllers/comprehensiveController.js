const Question = require('../models/ComprehensiveQuestion');

// Create Questions
exports.createQuestions = async (req, res) => {
    try {
        const newQuestions = await Question.create(req.body);
        res.status(201).json(newQuestions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Questions
exports.getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};