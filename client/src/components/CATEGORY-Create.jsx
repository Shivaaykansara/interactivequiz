/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { categorizedQuestionService } from '../services/categorizedQuestionService';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { GripVertical, X, Plus } from 'lucide-react';
import { Alert, AlertTitle } from '@mui/material';

const MakingOfCategorizedQ = () => {
  const [question, setQuestion] = useState('');
  const [categories, setCategories] = useState([{
    id: '1',
    name: '',
    answers: [{ id: '1-1', text: '' }]
  }]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedCategory, setDraggedCategory] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleAddCategory = () => {
    const newId = Date.now().toString();
    setCategories([...categories, {
      id: newId,
      name: '',
      answers: [{ id: `${newId}-1`, text: '' }]
    }]);
  };

  const handleRemoveCategory = (categoryIndex) => {
    setCategories(categories.filter((_, index) => index !== categoryIndex));
  };

  const handleAddAnswer = (categoryIndex) => {
    const newCategories = [...categories];
    const category = newCategories[categoryIndex];
    category.answers.push({
      id: `${category.id}-${Date.now()}`,
      text: ''
    });
    setCategories(newCategories);
  };

  const handleDragStart = (e, type, categoryIndex, answerIndex = null) => {
    e.dataTransfer.setData('text/plain', ''); // Required for Firefox
    if (type === 'category') {
      setDraggedCategory({ index: categoryIndex });
    } else {
      setDraggedItem({ categoryIndex, answerIndex });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCategoryDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedCategory === null) return;

    const newCategories = [...categories];
    const [movedCategory] = newCategories.splice(draggedCategory.index, 1);
    newCategories.splice(targetIndex, 0, movedCategory);
    setCategories(newCategories);
    setDraggedCategory(null);
  };

  const handleAnswerDrop = (e, targetCategoryIndex, targetAnswerIndex) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const newCategories = [...categories];
    const sourceCategory = newCategories[draggedItem.categoryIndex];
    const [movedAnswer] = sourceCategory.answers.splice(draggedItem.answerIndex, 1);
    
    const targetCategory = newCategories[targetCategoryIndex];
    targetCategory.answers.splice(targetAnswerIndex, 0, movedAnswer);
    
    setCategories(newCategories);
    setDraggedItem(null);
  };

  const handleSave = async () => {
    try {
      // Reset previous messages
      setError(null);
      setSuccess(null);

      // Validate input
      if (!question.trim()) {
        setError('Please enter a question');
        return;
      }

      // Ensure categories and answers are not empty
      const filteredCategories = categories.filter(
        category => category.name.trim() && 
        category.answers.some(answer => answer.text.trim())
      );

      if (filteredCategories.length === 0) {
        setError('Please add at least one category with a non-empty answer');
        return;
      }

      const questionData = {
        question,
        categories: filteredCategories
      };

      // Save to backend
      const response = await categorizedQuestionService.createCategorizedQuestion(questionData);
      
      // Show success message
      setSuccess('Categorized question saved successfully!');
      
      // Reset form
      setQuestion('');
      setCategories([{
        id: '1',
        name: '',
        answers: [{ id: '1-1', text: '' }]
      }]);
    } catch (error) {
      console.error('Error saving categorized question:', error);
      setError('Failed to save categorized question. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)}>
          <AlertTitle>Success</AlertTitle>
          {success}
        </Alert>
      )}

      <div className="space-y-4">
        <TextField
          placeholder="Enter your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          fullWidth
          variant="outlined"
        />
      </div>

      <div className="space-y-4">
        {categories.map((category, categoryIndex) => (
          <Card
            key={category.id}
            draggable
            onDragStart={(e) => handleDragStart(e, 'category', categoryIndex)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleCategoryDrop(e, categoryIndex)}
            className={`p-4 space-y-4 ${draggedCategory?.index === categoryIndex ? 'opacity-50' : ''}`}
            variant="outlined"
          >
            <div className="flex items-center space-x-4">
              <div className="cursor-grab">
                <GripVertical className="text-gray-400" />
              </div>
              <TextField
                placeholder="Category name"
                value={category.name}
                onChange={(e) => {
                  const newCategories = [...categories];
                  newCategories[categoryIndex].name = e.target.value;
                  setCategories(newCategories);
                }}
                fullWidth
                variant="standard"
              />
              <Button
                variant="text"
                color="error"
                onClick={() => handleRemoveCategory(categoryIndex)}
                size="small"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="pl-8 space-y-2">
              {category.answers.map((answer, answerIndex) => (
                <div
                  key={answer.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'answer', categoryIndex, answerIndex)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleAnswerDrop(e, categoryIndex, answerIndex)}
                  className={`flex items-center space-x-4 ${
                    draggedItem?.categoryIndex === categoryIndex && 
                    draggedItem?.answerIndex === answerIndex ? 'opacity-50' : ''
                  }`}
                >
                  <div className="cursor-grab">
                    <GripVertical className="text-gray-400" />
                  </div>
                  <TextField
                    placeholder="Enter answer"
                    value={answer.text}
                    onChange={(e) => {
                      const newCategories = [...categories];
                      newCategories[categoryIndex].answers[answerIndex].text = e.target.value;
                      setCategories(newCategories);
                    }}
                    fullWidth
                    variant="standard"
                  />
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => {
                      const newCategories = [...categories];
                      newCategories[categoryIndex].answers.splice(answerIndex, 1);
                      setCategories(newCategories);
                    }}
                    size="small"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              variant="outlined"
              size="small"
              onClick={() => handleAddAnswer(categoryIndex)}
              className="ml-8 mt-2"
              startIcon={<Plus className="h-4 w-4" />}
            >
              Add Answer
            </Button>
          </Card>
        ))}
      </div>

      <div className="flex space-x-4">
        <Button 
          variant="outlined" 
          onClick={handleAddCategory}
          startIcon={<Plus className="h-4 w-4" />}
        >
          Add Category
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave}
        >
          Save Categorized Question
        </Button>
      </div>
    </div>
  );
};

export default MakingOfCategorizedQ;