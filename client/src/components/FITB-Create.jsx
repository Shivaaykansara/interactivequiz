/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { API } from '../services/categorizedQuestionService'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Badge } from '@mui/material'

const MakingFillingTheBlank = () => {
  const [sentence, setSentence] = useState('');
  const [words, setWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);

  const processSentence = () => {
    // Split sentence into words
    const wordList = sentence.split(' ').filter(word => word.trim() !== '');
    setWords(wordList);
  };

  const toggleWordSelection = (word) => {
    setSelectedWords(prev => 
      prev.includes(word) 
        ? prev.filter(w => w !== word)
        : [...prev, word]
    );
  };

  const submitFITB = async () => {
    if (selectedWords.length === 0) {
      alert('Please select at least one word to create blanks');
      return;
    }

    try {
      const response = await axios.post(`${API}/api/fill`, {
        sentence: sentence,
        blankWords: selectedWords
      });
      
      alert('Fill in the Blank Exercise Created Successfully!');
      
      // Reset form
      setSentence('');
      setWords([]);
      setSelectedWords([]);
    } catch (error) {
      console.error('Error creating Fill in the Blank exercise:', error);
      alert('Failed to create exercise');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create Fill in the Blank Exercise</h2>
      
      <TextField 
        placeholder="Enter a complete sentence" 
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
        className="mb-4"
      />

      <Button onClick={processSentence} className="mb-4 mr-2">
        Process Sentence
      </Button>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Select Words for Blanks:</h3>
        <div className="flex flex-wrap gap-2">
          {words.map((word, index) => (
            <Badge 
              key={index}
              variant={selectedWords.includes(word) ? 'default' : 'outline'}
              onClick={() => toggleWordSelection(word)}
              className="cursor-pointer"
            >
              {word}
            </Badge>
          ))}
        </div>
      </div>

      {selectedWords.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Selected Blank Words:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedWords.map((word, index) => (
              <Badge key={index} variant="destructive">
                {word}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Button 
        onClick={submitFITB} 
        disabled={selectedWords.length === 0}
      >
        Create Exercise
      </Button>
    </div>
  );
};

export default MakingFillingTheBlank;