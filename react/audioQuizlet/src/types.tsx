export type questionObject = {
    title: string,
    correct: string | number,
    file: string,
    limit: string | number,
    type: string,
    pointsValue: string | number,
    options?: string[]
}
export type quizObject = {
    URL: string,
    admin: string,
    associatedFiles?: string[],
    expires: string,
    password: string,
    quizId: string,
    status: "open" | "closed",
    timeLimit: string,
    responses: string[],
    questions: questionObject[]
}
export type AnswerObject = {
    answer: string,
    score: number
}
export type IndexArray<T> = {
    [key: number]: T
}

export interface Prompt {
    file: File | null,
    instructions: string,
    type: pType,
    filePath?: string
}
export interface AudioPrompt extends Prompt {
    isPausable: boolean,
    playLimit: number | null
}

export interface ImagePrompt extends Prompt {
    timeLimit: number | null
}

export interface Response {
    correct?: string,
    options?: string[],
    type: qType,
}

export type generatorQuestion = {
    prompts: Prompt[],
    response: Response,
    pointValue: number
}
export type qType = "MC" | "SA" | "IMG" | "AUD" | "REC";
export type pType = "Audio" | "Image" | "Text";

export type quizzerPrompt = {
    type: pType, 
    filePath: string, 
    instructions: string, 
    timeLimit?: number | null
    playLimit?: number | null
}
export type quizzerQuestion = {
    pointValue: number,
    response: {type: qType, options?: string[]},
    prompts: quizzerPrompt[],
}
export type quizzerObject = {
    timeLimit: string,
    questions: quizzerQuestion[],
    admin: string,
    status: "open" | "closed",
    quizId: string,
    URL: string
}

export type userResponse = {
    quizId: string,
    responseId: string,
    timeStarted: string,
    answers?: AnswerObject[],
    associatedFiles?: string[],
    timeSubmitted?: string
}