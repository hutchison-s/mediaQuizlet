# AudioQuizlet Node.js API

This Node.js API serves as a backend for the AudioQuizlet application, providing functionalities for uploading quizzes and retrieving quiz data. Hosted on Vercel at [https://audio-quizlet.vercel.app
](audio-quizlet.vercel.app
)

## Features

- File Upload: Upload audio files for quiz questions.
- Quiz Creation: Create quizzes with uploaded audio files, set time limits, and passwords.
- Quiz Retrieval: Retrieve quiz data by quiz code.
- Quiz Response Submission: Submit responses to quizzes.

## Endpoints

### 1. `POST /upload`

- **Description**: Upload audio files for quiz questions and create a new quiz.
- **Request Parameters**:
  - FormData object with the following properties:
    - `files`: Array of audio files (multipart form data).
    - `timeLimit`: Optional time limit for the quiz.
    - `password`: Optional password to access the quiz.
- **Response**: Message indicating successful upload and URL to access the quiz.

### 2. `GET /quiz/:code`

- **Description**: Retrieve quiz data by quiz code.
- **URL Parameters**:
  - `code`: Unique identifier for the quiz.
- **Response**: JSON object containing quiz details including questions, time limit, and responses.

### 3. `POST /quiz/:code/response`

- **Description**: Submit responses to a quiz.
- **URL Parameters**:
  - `code`: Unique identifier for the quiz.
- **Request Body**:
  ```json
  {
    "user": "User's Name",
    "timestamp": "Timestamp of response submission",
    "responses": [Array of user's responses]
  }
