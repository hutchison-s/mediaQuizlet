# API Documentation

    base url: audio-quizlet.vercel.app/api

## Endpoints

### `GET /quizzes`
Retrieves all quizzes.

#### Returns
- `200 OK` with an array of quiz objects on success.
- `500 Internal Server Error` if an error occurs.

#### Description
This endpoint retrieves all quizzes stored in the database.

### `GET /quizzes/:userId`
Retrieves quizzes associated with a specific user.

#### Parameters
- `userId`: The ID of the user.

#### Returns
- `200 OK` with an object containing the user's email and an array of quiz objects on success.
- `400 Bad Request` if the user ID is missing.
- `404 Not Found` if the user does not exist.
- `500 Internal Server Error` if an error occurs.

#### Description
This endpoint retrieves quizzes associated with a specific user.

### `POST /quizzes`
Creates a new quiz.

#### Request Body
- `admin`: The email of the quiz administrator.
- `title`: The title of the quiz.
- `description`: (Optional) Description of the quiz.
- `password`: The password for accessing responses.
- `expires`: Expiration date of the quiz.
- `questions`: Array of question objects.
- `status`: Status of the quiz.
- `timeLimit`: (Optional) Time limit for taking the quiz.
- `associatedFiles`: (Optional) Array of associated file paths.

#### Returns
- `200 OK` with the created quiz object on success.
- `400 Bad Request` if required fields are missing.
- `500 Internal Server Error` if an error occurs.

#### Description
This endpoint creates a new quiz based on the provided details.

### `GET /quiz/:quizId`
Retrieves essential information about a specific quiz.

#### Parameters
- `quizId`: The ID of the quiz.

#### Returns
- `200 OK` with essential quiz information on success.
- `400 Bad Request` if the quiz ID is missing.
- `500 Internal Server Error` if an error occurs.

#### Description
This endpoint retrieves essential information about a specific quiz, including its title, description, status, and questions.

### `GET /quiz/:quizId/full`
Retrieves detailed information about a specific quiz.

#### Parameters
- `quizId`: The ID of the quiz.

#### Returns
- `200 OK` with detailed quiz information on success.
- `400 Bad Request` if the quiz ID is missing.
- `500 Internal Server Error` if an error occurs.

#### Description
This endpoint retrieves detailed information about a specific quiz, including all associated data such as questions, responses, and associated files.

### `PUT /quiz/:quizId`
Updates a quiz.

#### Parameters
- `quizId`: The ID of the quiz.

#### Request Body
- `status`: (Optional) Updated status of the quiz.
- `timeLimit`: (Optional) Updated time limit for taking the quiz.
- `reset`: (Optional) Boolean flag to reset the quiz.

#### Returns
- `200 OK` with the updated quiz object on success.
- `400 Bad Request` if required fields are missing.
- `500 Internal Server Error` if an error occurs.

#### Description
This endpoint updates a quiz based on the provided details.

### `DELETE /quiz/:quizId`
Deletes a quiz.

#### Parameters
- `quizId`: The ID of the quiz to delete.

#### Returns
- `200 OK` with a success message on successful deletion.
- `400 Bad Request` if required fields are missing.
- `500 Internal Server Error` if an error occurs.

#### Description
This endpoint deletes a specific quiz along with all associated data.

### `POST /response/:quizId`
Creates a new response for a quiz.

#### Parameters
- `quizId`: The ID of the quiz.

#### Request Body
- `user`: The user submitting the response.
- `timeStarted`: Time when the user started the quiz.

#### Returns
- `200 OK` with the created response object on success.
- `400 Bad Request` if required fields are missing.
- `500 Internal Server Error` if an error occurs.

#### Description
This endpoint creates a new response for a quiz based on the provided details.

### `GET /responses/:quizId`
Retrieves all responses for a quiz.

#### Parameters
- `quizId`: The ID of the quiz.

#### Returns
- `200 OK` with an array of response objects on success.
- `400 Bad Request` if the quiz ID is missing.
- `500 Internal Server Error` if an error occurs.

#### Description
This endpoint retrieves all responses submitted for a specific quiz.

### `GET /response/:quizId/:responseId`
Retrieves a specific response for a quiz.

#### Parameters
- `quizId`: The ID of the quiz.
- `responseId`: The ID of the response.

#### Returns
- `200 OK` with the response object on success.
- `400 Bad Request` if required fields are missing.
- `500 Internal Server Error` if an error occurs.

#### Description
This endpoint retrieves a specific response for a quiz.

### `PUT /response/:quizId/:responseId`
Updates a response for a quiz.

#### Parameters
- `quizId`: The ID of the quiz.
- `responseId`: The ID of the response.

#### Request Body
- `answers`: Updated answers for the response.
- `timeSubmitted`: Time when the user submitted the response.
- `associatedFiles`: (Optional) Array of updated associated file paths.

#### Returns
- `200 OK` with a success message on success.
- `400 Bad Request` if required fields are missing.
- `500 Internal Server Error` if an error occurs.

#### Description
This endpoint updates a response for a quiz based on the provided details.

### `DELETE /response/:quizId/:responseId`
Deletes a specific response for a quiz.

#### Parameters
- `quizId`: The ID of the quiz.
- `responseId`: The ID of the response to delete.

#### Returns
- `200 OK` with a success message on successful deletion.
- `400 Bad Request` if required fields are missing.
- `500 Internal Server Error` if an error occurs.

#### Description
This endpoint deletes a specific response for a quiz.

### `GET /user/:email`
Retrieves the user ID associated with the provided email.

#### Parameters
- `email`: The email of the user to retrieve.

#### Returns
- `200 OK` with the user ID on success.
- `400 Bad Request` if the email is missing.
- `404 Not Found` if the user does not exist.
- `500 Internal Server Error` if an error occurs.

#### Description
This endpoint retrieves the user ID associated with the provided email.

## Middleware

### `authenticate`
Middleware function to authenticate requests.

#### Header
- `Authorization`: Basic authentication header.

#### Description
This middleware function extracts the basic authentication credentials from the request header. It then verifies the credentials against the database to authenticate the user.

### `admin`
Middleware function to authenticate admin requests.

#### Header
- `Authorization`: Basic authentication header.

#### Description
This middleware function extracts the basic authentication credentials from the request header. It then verifies the credentials against the environment variables to authenticate the admin user.

