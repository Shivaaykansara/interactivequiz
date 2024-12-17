/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  Button, 
  Chip, 
  Alert, 
  AlertTitle 
} from '@mui/material';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  arrayMove, 
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MdCheckCircleOutline } from "react-icons/md";
import { MdError } from "react-icons/md";
import { MdReplay } from "react-icons/md";
import { MdNavigateNext } from "react-icons/md";
import { MdClose } from "react-icons/md";
import { API } from '../services/categorizedQuestionService';

const SortableWord = ({ word, isDropped = false, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: word });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', margin: 1 }}>
      <Chip
        ref={setNodeRef}
        label={word}
        {...attributes}
        {...listeners}
        style={style}
        sx={{
          flex: 1,
          backgroundColor: isDropped ? 'grey.300' : 'default',
        }}
      />
      {isDropped && (
        <Button 
          size="small" 
          sx={{ ml: 1, minWidth: 'auto', p: 0.5 }}
          onClick={() => onRemove(word)}
        >
          <MdClose />
        </Button>
      )}
    </Box>
  );
};

// Droppable Blank Component
const DroppableBlank = ({ 
  word, 
  onDrop, 
  isCorrect = null 
}) => {
  const getBackgroundColor = () => {
    if (isCorrect === true) return 'success.light';
    if (isCorrect === false) return 'error.light';
    return 'grey.200';
  };

  return (
    <Paper
      sx={{
        minHeight: 50,
        padding: 2,
        textAlign: 'center',
        backgroundColor: getBackgroundColor(),
        border: '1px dashed grey',
      }}
    >
      {word || 'Drop word here'}
    </Paper>
  );
};

const EnhancedFITBTest = () => {
  // State Management
  const [exercises, setExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [availableWords, setAvailableWords] = useState([]);
  const [blankWords, setBlankWords] = useState([]);
  const [wordCorrectness, setWordCorrectness] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [userScore, setUserScore] = useState({
    correct: 0,
    total: 0
  });
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch Exercises
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(`${API}/api/fill`);
        if (response.data.length > 0) {
          setExercises(response.data);
          initializeExercise(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
        setFeedbackMessage({
          severity: 'error',
          text: 'Failed to load exercises. Please try again.'
        });
      }
    };

    fetchExercises();
  }, []);

  // Initialize Exercise
  const initializeExercise = useCallback((exercise) => {
    const shuffledWords = [...exercise.blankWords]
      .sort(() => Math.random() - 0.5);

    setAvailableWords(shuffledWords);
    setBlankWords(new Array(exercise.blankWords.length).fill(null));
    setWordCorrectness(new Array(exercise.blankWords.length).fill(null));
    setFeedbackMessage(null);
  }, []);

  // Drag Handlers
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active && over) {
      const draggedWord = active.id;
      const droppedIndex = blankWords.indexOf(null);

      if (droppedIndex !== -1) {
        // Remove word from available words
        const newAvailableWords = availableWords.filter(w => w !== draggedWord);
        
        // Add word to blank words
        const newBlankWords = [...blankWords];
        newBlankWords[droppedIndex] = draggedWord;

        setAvailableWords(newAvailableWords);
        setBlankWords(newBlankWords);
      }
    }

    setActiveId(null);
  };

  // Remove Word from Blank
  const handleRemoveWord = (word) => {
    // Find the index of the word in blank words
    const blankIndex = blankWords.indexOf(word);
    
    if (blankIndex !== -1) {
      // Create a copy of blank words and remove the word
      const newBlankWords = [...blankWords];
      newBlankWords[blankIndex] = null;

      // Add the word back to available words
      const newAvailableWords = [...availableWords, word].sort();

      // Update states
      setBlankWords(newBlankWords);
      setAvailableWords(newAvailableWords);
      
      // Reset correctness for this blank
      const newWordCorrectness = [...wordCorrectness];
      newWordCorrectness[blankIndex] = null;
      setWordCorrectness(newWordCorrectness);
    }
  };

  // Check Answer
  const checkAnswer = () => {
    const currentExercise = exercises[currentExerciseIndex];
    
    // Validate all blanks are filled
    if (blankWords.some(word => word === null)) {
      setFeedbackMessage({
        severity: 'warning',
        text: 'Please fill all blanks before checking.'
      });
      return;
    }

    // Check correctness of each word
    const newWordCorrectness = blankWords.map((word, index) => 
      word === currentExercise.blankWords[index]
    );

    setWordCorrectness(newWordCorrectness);

    // Calculate if all words are correct
    const isCompletelyCorrect = newWordCorrectness.every(Boolean);

    // Update score
    setUserScore(prev => ({
      correct: prev.correct + (isCompletelyCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    // Set feedback
    setFeedbackMessage({
      severity: isCompletelyCorrect ? 'success' : 'error',
      text: isCompletelyCorrect 
        ? 'Congratulations! Correct answer.' 
        : 'Incorrect. Try again!'
    });
  };

  // Next Exercise
  const nextExercise = () => {
    const nextIndex = (currentExerciseIndex + 1) % exercises.length;
    setCurrentExerciseIndex(nextIndex);
    initializeExercise(exercises[nextIndex]);
  };

  // Reset Exercise
  const resetExercise = () => {
    initializeExercise(exercises[currentExerciseIndex]);
  };

  // Render Loading State
  if (exercises.length === 0) {
    return <Typography>Loading exercises...</Typography>;
  }

  const currentExercise = exercises[currentExerciseIndex];

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Fill in the Blank Test
        </Typography>

        {/* Exercise Sentence */}
        <Box 
          sx={{ 
            bgcolor: 'grey.100', 
            p: 2, 
            borderRadius: 2,
            mb: 2 
          }}
        >
          <Typography>{currentExercise.sentenceWithBlanks}</Typography>
        </Box>

        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Grid container spacing={2}>
            {/* Blank Areas */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {blankWords.map((word, index) => (
                  <Grid item xs={12} key={index}>
                    <DroppableBlank
                      word={word}
                      isCorrect={wordCorrectness[index]}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Available Words */}
            <Grid item xs={12}>
              <Box
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  minHeight: 50,
                  border: '1px dashed grey',
                  p: 1
                }}
              >
                {availableWords.map((word) => (
                  <SortableWord 
                    key={word} 
                    word={word} 
                  />
                ))}
              </Box>
            </Grid>

            {/* Dropped Words */}
            <Grid item xs={12}>
              <Box
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  minHeight: 50,
                  border: '1px dashed grey',
                  p: 1
                }}
              >
                {blankWords.map((word, index) => (
                  word && (
                    <SortableWord 
                      key={word} 
                      word={word} 
                      isDropped={true}
                      onRemove={handleRemoveWord}
                    />
                  )
                ))}
              </Box>
            </Grid>
          </Grid>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeId ? (
              <Chip 
                label={activeId} 
                sx={{ 
                  backgroundColor: 'primary.light',
                  cursor: 'grabbing' 
                }} 
              />
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Feedback Messages */}
        {feedbackMessage && (
          <Alert 
            severity={feedbackMessage.severity}
            sx={{ mt: 2 }}
            iconMapping={{
              success: <MdCheckCircleOutline />,
              error: <MdError />
            }}
          >
            <AlertTitle>{feedbackMessage.severity.charAt(0).toUpperCase() + feedbackMessage.severity.slice(1)}</AlertTitle>
            {feedbackMessage.text}
          </Alert>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={checkAnswer}
            disabled={availableWords.length > 0}
          >
            Check Answer
          </Button>
          <Button 
            variant="outlined" 
            color="secondary"
            startIcon={<MdReplay />}
            onClick={resetExercise}
          >
            Reset
          </Button>
          <Button 
            variant="outlined" 
            color="primary"
            endIcon={<MdNavigateNext />}
            onClick={nextExercise}
          >
            Next Exercise
          </Button>
        </Box>

        {/* Score Display */}
        
      </Paper>
    </Container>
  );
};

export default EnhancedFITBTest;