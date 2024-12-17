/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { API } from '../services/categorizedQuestionService';

const ComprehensiveForm = () => {
  const [paragraph, setParagraph] = useState('');
  const [questions, setQuestions] = useState([
    { 
      questionText: '', 
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ] 
    }
  ]);

  const handleParagraphChange = (e) => {
    setParagraph(e.target.value);
  };

  const handleQuestionChange = (questionIndex, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].questionText = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].text = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectOptionToggle = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.map((opt, idx) => ({
      ...opt,
      isCorrect: idx === optionIndex
    }));
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions, 
      { 
        questionText: '', 
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ] 
      }
    ]);
  };

  const submitMCQ = async () => {
    try {
      const response = await axios.post(`${API}/api/list`, { paragraph, questions });
      alert('MCQ Created Successfully!');
      // Reset form or navigate
      setParagraph('');
      setQuestions([
        { 
          questionText: '', 
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
          ] 
        }
      ]);
    } catch (error) {
      console.error('Error creating MCQ:', error);
      alert('Failed to create MCQ');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create MCQ Set</h2>
      
      <TextField 
        placeholder="Enter paragraph" 
        value={paragraph}
        onChange={handleParagraphChange}
        className="mb-4"
      />

      {questions.map((question, questionIndex) => (
        <div key={questionIndex} className="mb-6 p-4 border rounded">
          <TextField 
            placeholder={`Question ${questionIndex + 1}`}
            value={question.questionText}
            onChange={(e) => handleQuestionChange(questionIndex, e)}
            className="mb-2"
          />

          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center mb-2">
              <TextField 
                placeholder={`Option ${optionIndex + 1}`}
                value={option.text}
                onChange={(e) => handleOptionChange(questionIndex, optionIndex, e)}
                className="flex-grow mr-2"
              />
              <TextField 
                type="radio" 
                name={`correct-${questionIndex}`}
                checked={option.isCorrect}
                onChange={() => handleCorrectOptionToggle(questionIndex, optionIndex)}
              />
            </div>
          ))}
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <Button onClick={addQuestion}>Add Question</Button>
        <Button onClick={submitMCQ}>Submit MCQ Set</Button>
      </div>
    </div>
  );
};

export default ComprehensiveForm;