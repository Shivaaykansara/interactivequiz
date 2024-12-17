// models/CategorizedQuestion.js
const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true }
});

const CategorySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  answers: [AnswerSchema]
});

const CategorizedQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  categories: [CategorySchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('CategorizedQuestion', CategorizedQuestionSchema);