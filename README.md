# Media Quizlet Frontend

The Media Quizlet frontend is a web application hosted at [mediaquizlet.com](https://www.mediaquizlet.com/), providing functionalities for generating, accessing, and viewing quizzes with rich media customization.

## Pages

### 1. Home Page

- **URL**: [mediaquizlet.com](https://www.mediaquizlet.com/)
- **Description**: Homepage of the Media Quizlet website.
- **Features**:
  - Introduction to Media Quizlet's unique features.
  - Links to create a new quiz or take an example quiz.
  - Detailed tutorial on how to get started with Media Quizlet.

### 2. Generate Page

- **URL**: [mediaquizlet.com/generator](https://www.mediaquizlet.com/generator)
- **Description**: Page for generating a new quiz.
- **Features**:
  - Upload audio or image files to auto-create question templates.
  - Create custom questions with various media prompts.
    - Control how participants interact with the media.
    - Response types include:
      - Multiple choice
      - Short answer
      - File upload
      - Built-in audio recording
  - Set a password to access quiz responses.
  - Optionally set a time limit for the quiz.
  - Receive a unique access link to share with others both at the redirected page and in your email.

### 3. Lookup Page

- **URL**: [mediaquizlet.com/lookup](https://www.mediaquizlet.com/lookup)
- **Description**: Page for looking up a quiz by its unique ID or by creator's email address.
- **Features**:
  - Enter a quiz ID to retrieve the quiz from the database.
  - Enter an email address to retrieve a list of all quizzes created by that user from the database.
  - Loads the Quizzer Page on successful retrieval.

### 4. Quizzer Page

- **URL**: [mediaquizlet.com/quizzer](https://www.mediaquizlet.com/quizzer) + quiz code
- **Description**: Page for taking a quiz.
- **Features**:
  - Enter your name to start the quiz.
  - Answer questions and upload files as required.
  - Time remaining and listen/view limits for questions are preserved across refreshes.
  - Submit your answers upon completion.

### 5. Viewer Page

- **URL**: [mediaquizlet.com/viewer](https://www.mediaquizlet.com/viewer) + quiz code
- **Description**: Page for viewing quiz responses and managing the quiz.
- **Features**:
  - Enter the password chosen during quiz generation to view responses.
  - Manage quiz state: close or reopen to new responses.
  - Reset the quiz to erase all responses.
  - Edit grades and update scores.

## Technologies Used

- React
- HTML
- CSS
- JavaScript
- Node.js
- Express
- Firebase
- Vercel for API server hosting
- Netlify for frontend deployment

## Contributors

- [Steven Hutchison](https://github.com/hutchison-s) - [Developer]

## License

This project is licensed under the [MIT License](LICENSE).
