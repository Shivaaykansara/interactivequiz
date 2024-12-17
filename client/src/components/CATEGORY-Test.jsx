/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { categorizedQuestionService } from '../services/categorizedQuestionService';
// import { CircularProgress, Alert } from '@mui/material';

const CategorizationGame = () => {
  const [gamesData, setGamesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorizedQuestions = async () => {
      try {
        setLoading(true);
        const questions = await categorizedQuestionService.getAllCategorizedQuestions();
        
        if (questions.length === 0) {
          setError('No categorized questions available');
          setLoading(false);
          return;
        }

        // Prepare game data for each question with unique identifiers
        const preparedGames = questions.map(question => ({
          id: question.id,
          uniqueGameId: `game_${question.id}_${Math.random().toString(36).substr(2, 9)}`, // Add a unique identifier
          question: question.question,
          answers: question.categories.flatMap(category => 
            category.answers.map(answer => ({
              id: `${question.id}_${answer.id}`, // Ensure unique answer IDs
              originalId: answer.id,
              content: answer.text,
              isPlaced: false
            }))
          ),
          columns: question.categories.reduce((acc, category) => {
            acc[category.id] = {
              id: category.id,
              name: category.name,
              items: []
            };
            return acc;
          }, {}),
          originalCategories: question.categories
        }));

        setGamesData(preparedGames);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categorized questions:', err);
        setError('Failed to load categorized questions');
        setLoading(false);
      }
    };

    fetchCategorizedQuestions();
  }, []);

  const handleDragStart = (e, item, uniqueGameId) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      itemId: item.id,
      content: item.content,
      uniqueGameId: uniqueGameId
    }));
  };

  const handleDrop = (e, columnId, uniqueGameId) => {
    e.preventDefault();
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
      
      // Only allow drops within the same game
      if (dragData.uniqueGameId !== uniqueGameId) return;

      setGamesData(prevGames => {
        return prevGames.map(game => {
          // Only modify the specific game
          if (game.uniqueGameId !== uniqueGameId) return game;

          // Create a new game state
          const updatedGame = { ...game };
          
          // Remove the dragged item from all columns
          Object.keys(updatedGame.columns).forEach(key => {
            updatedGame.columns[key].items = updatedGame.columns[key].items.filter(
              item => item.id !== dragData.itemId
            );
          });

          // Add to the new column
          updatedGame.columns[columnId].items.push({
            id: dragData.itemId,
            content: dragData.content
          });

          // Update answers array to mark item as placed
          updatedGame.answers = updatedGame.answers.map(answer => 
            answer.id === dragData.itemId 
              ? { ...answer, isPlaced: true }
              : answer
          );

          return updatedGame;
        });
      });
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = (uniqueGameId) => {
    const game = gamesData.find(g => g.uniqueGameId === uniqueGameId);
    if (!game) return;

    let isCorrect = true;
    game.originalCategories.forEach(category => {
      const columnItems = game.columns[category.id].items;
      const expectedAnswerIds = category.answers.map(a => `${game.id}_${a.id}`);
      
      const columnCorrect = columnItems.every(item => 
        expectedAnswerIds.includes(item.id)
      ) && columnItems.length === expectedAnswerIds.length;
      
      if (!columnCorrect) {
        isCorrect = false;
      }
    });

    alert(isCorrect ? 'Correct! Well done!' : 'Some answers are incorrect. Try again.');
  };

  const handleReset = (uniqueGameId) => {
    setGamesData(prevGames => {
      return prevGames.map(game => {
        if (game.uniqueGameId !== uniqueGameId) return game;

        // Reset all columns to empty
        const resetColumns = { ...game.columns };
        Object.keys(resetColumns).forEach(key => {
          resetColumns[key] = {
            ...resetColumns[key],
            items: []
          };
        });

        // Reset all answers to unplaced
        const resetAnswers = game.answers.map(answer => ({
          ...answer,
          isPlaced: false
        }));

        return {
          ...game,
          columns: resetColumns,
          answers: resetAnswers
        };
      });
    });
  };

  // Rest of the component remains the same as in the previous implementation
  // ... (rendering logic stays unchanged)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {gamesData.map((game) => (
          <div key={game.uniqueGameId} className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-6">
              {game.question}
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {Object.values(game.columns).map((column) => (
                <div
                  key={column.id}
                  onDrop={(e) => handleDrop(e, column.id, game.uniqueGameId)}
                  onDragOver={handleDragOver}
                  className="bg-gray-50 rounded-lg shadow-md p-4 min-h-[200px]"
                >
                  <h3 className="text-lg font-semibold mb-4">{column.name}</h3>
                  
                  {column.items.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item, game.uniqueGameId)}
                      className="bg-blue-100 p-2 rounded mb-2 cursor-move"
                    >
                      {item.content}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4">Available Answers</h3>
              <div className="flex flex-wrap gap-2">
                {game.answers.filter(item => !item.isPlaced).map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item, game.uniqueGameId)}
                    className="bg-gray-200 p-2 rounded cursor-move"
                  >
                    {item.content}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 text-center space-x-4">
              <button 
                onClick={() => handleSubmit(game.uniqueGameId)}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
              >
                Check Answers
              </button>
              <button 
                onClick={() => handleReset(game.uniqueGameId)}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
              >
                Reset
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorizationGame;