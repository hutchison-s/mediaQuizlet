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