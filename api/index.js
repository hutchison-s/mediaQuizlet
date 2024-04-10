import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage(), limits: {} });
import { authenticate, admin } from "./middleware/auth.js";
import { deleteQuiz, getAllQuizzes, getFullQuiz, getQuiz, newQuiz, updateQuiz } from "./database/quizFunctions.js";
import { deleteOneResponse, getAllResponses, getOneResponse, newResponse, updateResponse } from './database/responseFunctions.js';
import { uploadAudio, uploadImage } from './database/fileFunctions.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cors());

// Retrieve all quizzes
app.get('/api/quizzes', admin, getAllQuizzes);

// Create a new quiz
app.post('/api/quizzes', newQuiz);

// Retrieve quiz details (only info necessary for quiz-taking)
app.get('/api/quizzes/:quizId', getQuiz);

// Retrieve full quiz details (admin)
app.get('/api/quizzes/:quizId/admin', authenticate, getFullQuiz);

// Update status or time limit for an existing quiz, or reset responses
app.patch('/api/quizzes/:quizId/admin', authenticate, updateQuiz);

// Delete a quiz
app.delete('/api/quizzes/:quizId/admin', authenticate, deleteQuiz);

// Retrieve all responses for a quiz
app.get('/api/quizzes/:quizId/responses', authenticate, getAllResponses);

// Create new response document
app.post('/api/quizzes/:quizId/responses', newResponse);

// Retrieve specific response
app.get('/api/quizzes/:quizId/responses/:responseId', getOneResponse);

// Edit specific response
app.patch('/api/quizzes/:quizId/responses/:responseId', updateResponse);

// Delete specific response
app.delete('/api/quizzes/:quizId/responses/:responseId', authenticate, deleteOneResponse);

// Compress and upload audio file
app.post('/api/uploads/audio', upload.single("files"), uploadAudio);

// Compress and upload image file
app.post('/api/uploads/image', upload.single("photos"), uploadImage);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});