export type GenPromptType = "text" | "audio" | "image"
export type GenResponseType = "MC" | "SA" | "IMG" | "AUD" | "REC"
export type GenPrompt = {
    type: GenPromptType,
    text?: string, // Optional text content for text prompts
    file?: File, // Optional file object for audio or image prompts
    path?: string // Optional file path for uploaded file after processing
    isPausable?: boolean // Optional variable for audio prompts
    playLimit?: number // Optional variable for audio prompts
    timeLimit?: number // Optional variable for image prompts
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
  