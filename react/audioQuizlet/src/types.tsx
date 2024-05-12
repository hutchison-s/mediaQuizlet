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
    type: "MC" | "SA" | "IMG" | "AUD",
}

export type generatorQuestion = {
    prompts: Prompt[],
    response: Response,
    pointValue: number
}
export type qType = "MC" | "SA" | "IMG" | "AUD";
export type pType = "Audio" | "Image" | "Text";