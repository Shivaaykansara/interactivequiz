const mongoose = require('mongoose') 

const fillInTheBlankSchema = new mongoose.Schema({
  originalSentence: {
    type: String,
    required: true,
    trim: true
  },
  blankWords: [{
    type: String,
    required: true
  }],
  sentenceWithBlanks: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Model  = mongoose.model('FillInTheBlank', fillInTheBlankSchema);
module.exports = Model