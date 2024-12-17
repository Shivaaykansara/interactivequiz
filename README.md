# MERN Stack Project: Interactive Quiz

This project is a **Interactive Quiz** built using the **MERN stack** (MongoDB, Express, React, Node.js). It provides a platform for creating, managing, and displaying three types of tests:

1. **Categorized Test**
2. **Fill-in-the-Blank Test**
3. **Comprehensive Test**

## Features

### General Features
- User-friendly interface to manage tests.
- CRUD operations for all test types.
- Displays test types in a clear, organized format.

### Test Types
1. **Categorized Test**: 
   - A single question defines the category.
   - Users place answer options into the correct category based on the question.
   - Supports drag-and-drop or similar interaction for organizing answers.

2. **Fill-in-the-Blank Test**:
   - Provides text with blanks for users to complete.
   - Automatic checking of correct answers.

3. **Comprehensive Test**:
   - Based on a provided paragraph, users answer multiple-choice questions.
   - Questions test understanding of the paragraph's content.

## Tech Stack

- **Frontend**: React, Tailwind CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **API Communication**: Axios

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Shivaaykansara/interactivequiz.git
   ```

2. Navigate to the project directory:
   ```bash
   cd interactivequiz
   ```

3. Install dependencies for both the frontend and backend:
   ```bash
   # Backend dependencies
   cd backend
   npm install

   # Frontend dependencies
   cd ./client
   npm install
   ```

4. Set up the environment variables:
   - Create a `.env` file in the `backend` directory and add the following:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     ```

5. Start the application:
   ```bash
   # Start the backend server
   cd server
   npm start

   # Start the frontend server
   cd ../frontend
   npm start
   ```

6. Access the application in your browser at `http://localhost:3000`.

## Folder Structure

### Backend (`/server`)
- **Models**: MongoDB schemas for tests.
- **Routes**: API endpoints for managing tests.
- **Controllers**: Business logic for test operations.
- **Config**: Database connection settings.

### Frontend (`/client`)
- **Components**: Reusable UI components for test display and management.
- **Pages**: Screens for different test types and operations.
- **Services**: Axios calls for API communication.

## API Endpoints

### Categorized Test
- `GET /api/cat`: Retrieve all categorized tests.
- `POST /api/cat`: Create a new categorized test.

### Fill-in-the-Blank Test
- `GET /api/fill`: Retrieve all fill-in-the-blank tests.
- `POST /api/fill`: Create a new fill-in-the-blank test.

### Comprehensive Test
- `GET /api/list`: Retrieve all comprehensive tests.
- `POST /api/list`: Create a new comprehensive test.
