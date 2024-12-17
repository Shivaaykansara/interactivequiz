import axios from 'axios';

const API_BASE_URL = 'https://interactivequiz-backend.onrender.com';
export const API = 'https://interactivequiz-backend.onrender.com';


export const categorizedQuestionService = {
  // Create a new categorized question
  createCategorizedQuestion: async (questionData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/cat`, questionData);
      return response.data;
    } catch (error) {
      console.error('Error creating categorized question:', error);
      throw error;
    }
  },

  // Get all categorized questions
  getAllCategorizedQuestions: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/cat`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categorized questions:', error);
      throw error;
    }
  },

  // Update a specific categorized question
  updateCategorizedQuestion: async (id, questionData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/cat/${id}`, questionData);
      return response.data;
    } catch (error) {
      console.error('Error updating categorized question:', error);
      throw error;
    }
  },

  // Delete a specific categorized question
  deleteCategorizedQuestion: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/cat/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting categorized question:', error);
      throw error;
    }
  }
};
