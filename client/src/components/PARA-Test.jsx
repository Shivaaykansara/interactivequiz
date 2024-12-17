import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { API } from '../services/categorizedQuestionService';

const ComprehensiveDisplay = () => {
  const [mcqs, setMcqs] = useState([]);
  const [currentMCQIndex, setCurrentMCQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchMCQs = async () => {
      try {
        const response = await axios.get(`${API}/api/list`);
        setMcqs(response.data);
      } catch (error) {
        console.error('Error fetching MCQs:', error);
      }
    };

    fetchMCQs();
  }, []);

  const handleOptionSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex
    });
  };

  const submitTest = () => {
    let totalScore = 0;
    mcqs[currentMCQIndex].questions.forEach((question, questionIndex) => {
      const selectedOptionIndex = selectedAnswers[questionIndex];
      if (selectedOptionIndex !== undefined) {
        const selectedOption = question.options[selectedOptionIndex];
        if (selectedOption.isCorrect) {
          totalScore++;
        }
      }
    });

    setScore(totalScore);
  };

  const nextMCQSet = () => {
    setCurrentMCQIndex((prev) => 
      (prev + 1) % mcqs.length
    );
    // Reset selected answers when moving to next MCQ set
    setSelectedAnswers({});
    setScore(null);
  };

  if (mcqs.length === 0) {
    return <div>Loading MCQs...</div>;
  }

  const currentMCQ = mcqs[currentMCQIndex];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">MCQ Test</h2>

      <div className="mb-6 bg-gray-100 p-4 rounded">
        <p>{currentMCQ.paragraph}</p>
      </div>

      {currentMCQ.questions.map((question, questionIndex) => (
        <div key={questionIndex} className="mb-6 p-4 border rounded">
          <h3 className="font-semibold mb-2">{question.questionText}</h3>
          
          {question.options.map((option, optionIndex) => (
            <div 
              key={optionIndex} 
              className={`flex items-center mb-2 p-2 rounded cursor-pointer ${
                score !== null && option.isCorrect 
                  ? 'bg-green-200' 
                  : selectedAnswers[questionIndex] === optionIndex 
                  ? 'bg-blue-200' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => score === null && handleOptionSelect(questionIndex, optionIndex)}
            >
              <input 
                type="radio"
                name={`question-${questionIndex}`}
                checked={selectedAnswers[questionIndex] === optionIndex}
                readOnly
                className="mr-2"
              />
              <span>{option.text}</span>
            </div>
          ))}
        </div>
      ))}

      {score === null ? (
        <Button onClick={submitTest} className="mr-2">Submit</Button>
      ) : (
        <>
          <div className="mb-4 font-bold">
            Score: {score} / {currentMCQ.questions.length}
          </div>
          <Button onClick={nextMCQSet}>Next MCQ Set</Button>
        </>
      )}
    </div>
  );
};

export default ComprehensiveDisplay;