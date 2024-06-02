export type GenPromptType = "text" | "audio" | "image"
export type GenResponseType = "MC" | "SA" | "IMG" | "AUD" | "REC"
export type GenPrompt = {
    type: GenPromptType,
    text?: string[] | string, // Optional text content for text prompts
    file?: File, // Optional file object for audio or image prompts
    path?: string // Optional file path for uploaded file after processing
    isPausable?: boolean // Optional variable for audio prompts
    playLimit?: number // Optional variable for audio prompts
    timeLimit?: number // Optional variable for image prompts
    remaining?: number
  };
  
  export type GenResponse = {
    type: GenResponseType,
    correct?: string, // Optional correct answer (for multiple choice or short answer questions)
    options?: string[] // Optional array of options (for multiple choice questions)
  };
  
  export type GenQuestion = {
    id: number,
    pointValue: number,
    prompts: GenPrompt[],
    response: GenResponse
  };
  
  export type GenQuiz = {
    admin: string, // email of the quiz administrator
    password: string // password for viewing quiz results
    title: string,
    description?: string, // Optional description of the quiz
    timeLimit?: number, // Optional time limit for the entire quiz
    questions: GenQuestion[],
    active: number
  };
  
  export type userResponse = {
    quizId: string,
    timeLimit: number | null,
    user?: string,
    responseId?: string,
    timeStarted?: number,
    questions?: GenQuestion[],
    answers?: AnswerObject[],
    associatedFiles?: string[],
    timeSubmitted?: string
}

export type AnswerObject = {
    answer: string,
    score: number
}

export type essentialQuiz = {
    timeLimit: number | null,
    questions: GenQuestion[],
    quizId: string,
    status: string,
    title: string,
    description: string
}

export type fullQuiz = {
  URL: string,
  admin: string,
  associatedFiles?: string[],
  expires: string,
  password: string,
  quizId: string,
  title: string,
  description: string,
  status: "open" | "closed",
  timeLimit: string,
  responses: AnswerObject[],
  questions: GenQuestion[]
}

export type ResponseAction = 
      {type: 'UPDATE_ANSWER', payload: {id: number, answer: AnswerObject}}
    | {type: 'UPDATE_MANY', payload: {id: number, answer: AnswerObject}[]}
    | {type: 'INITIALIZE', payload: {user: string, responseId: string, timeStarted: number}}
    | {type: 'RESTORE', payload: userResponse}
    | {type: 'PRE-SUBMIT', payload: {associatedFiles?: string[], timeSubmitted?: string}}
    | {type: 'UPDATE_PROMPT_REMAINING', payload: {qIndex: number, pIndex: number, remaining: number}}