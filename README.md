# AudioQuizlet Frontend

The AudioQuizlet frontend is a web application hosted at [audioquizlet.netlify.app](https://audioquizlet.netlify.app/), providing functionalities for generating, accessing, and viewing quizzes.
- Files located in the `frontend` subdirectory.
- Node.js API files located in the `api` subdirectory.

## Pages

### 1. Landing Page

- **URL**: [audioquizlet.netlify.app](https://audioquizlet.netlify.app/)
- **Description**: Homepage of the AudioQuizlet website.
- **Features**:
  - Link to generate a new quiz.
  - Link to lookup a quiz by its unique ID.

### 2. Generate Page

- **URL**: [audioquizlet.netlify.app/generate](https://audioquizlet.netlify.app/generate)
- **Description**: Page for generating a new quiz.
- **Features**:
  - Upload audio files.
  - Create questions based on the uploaded files.
    - Set a limit on number of times quiz-taker can play the audio
    - Set custom point value for the question
    - Response types:
      - Multiple choice
      - Short Answer
      - Photo Upload
  - Set a password to access quiz responses.
  - Optionally set a time limit for the quiz.
  - Receive an access link to share with others.

### 3. Lookup Page

- **URL**: [audioquizlet.netlify.app/lookup](https://audioquizlet.netlify.app/lookup)
- **Description**: Page for looking up a quiz by its ID.
- **Features**:
  - Enter a quiz ID to retrieve the quiz from the database.
  - Loads Quizzer Page on successful retrieval.

### 4. Quizzer Page

- **URL**: [audioquizlet.netlify.app/quizzer](https://audioquizlet.netlify.app/quizzer) + quiz code
- **Description**: Page for taking a quiz.
- **Features**:
  - Enter your name.
  - Take the quiz by answering questions / uploading files.
  - Time remaining and listen limits for questions are locked until you submit or time expires, even on refresh.
  - Submit your answers.

### 5. Viewer Page

- **URL**: [audioquizlet.netlify.app/viewer](https://audioquizlet.netlify.app/viewer) + quiz code
- **Description**: Page for viewing quiz responses and managing quiz.
- **Features**:
  - Enter the password chosen during quiz generation to view responses.
  - Close or Re-Open Quiz to new responses.
  - Reset quiz and erase all responses.
  - Edit grades and update scores.

## Technologies Used

- HTML
- CSS
- JavaScript
- Node.js
- Express
- Firebase

## Contributors

- [Steven Hutchison](https://github.com/hutchison-s) - [Developer]

## License

This project is licensed under the [MIT License](LICENSE).
