const mongoose = require('mongoose');

const MCQSchema = new mongoose.Schema({
  paragraph: {
    type: String,
    required: true,
    trim: true
  },
  questions: [{
    questionText: {
      type: String,
      required: true,
      trim: true
    },
    options: [{
      text: {
        type: String,
        required: true,
        trim: true
      },
      isCorrect: {
        type: Boolean,
        default: false
      }
    }]
  }]
}, { timestamps: true });
const MCQ = mongoose.model('MCQ', MCQSchema);

module.exports = MCQ;