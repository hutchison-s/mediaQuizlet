import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage(), limits: {} });
import { authenticate, admin } from "./middleware/auth.js";
import { deleteQuiz, getAllQuizzes, getAllQuizzesByUser, getFullQuiz, getQuiz, newQuiz, updateQuiz } from "./database/quizFunctions.js";
import { deleteOneResponse, getAllResponses, getOneResponse, newResponse, updateResponse } from './database/responseFunctions.js';
import { uploadImage } from './database/fileFunctions.js';
import { createAudioDoc, getAllAudio, getAudioInfo, getChunk, uploadAudioChunk } from './database/audioFunctions.js';
import { getUserId } from './database/userFunctions.js';
import { receiveContact } from './nodemailer/emailFunctions.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cors());

// USERS ------------------

// Retrieve all quizzes created by specific user by email
app.get('/api/users/:userId/quizzes', getAllQuizzesByUser);

app.get('/api/findUser/:email', getUserId);

// QUIZZES ------------------

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

// RESPONSES ------------------

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

// FILES ------------------

// Create new audio document and return id
app.post('/api/uploads/audio', createAudioDoc); 

// Return list of all audio docs, requires admin authorization
app.get('/api/uploads/audio', admin, getAllAudio); 

// Upload a file chunk and add reference to audio doc
app.post('/api/uploads/audio/:id/chunks', upload.single("chunk"), uploadAudioChunk);

// Get totalChunks and mimetype for audio doc
app.get('/api/uploads/audio/:id/chunks', getAudioInfo); 

// Get specific chunk for specific audio
app.get('/api/uploads/audio/:id/chunks/:index', getChunk) 

// Compress and upload image file
app.post('/api/uploads/image', upload.single("photos"), uploadImage);

// CONTACT FORM ------------------

// Receive formdata from contact form and send email to website administrator
app.post('api/contact', upload.single("file"), receiveContact);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});