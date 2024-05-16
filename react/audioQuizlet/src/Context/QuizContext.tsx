import { createContext, useContext } from "react";
import { quizzerObject } from "../types";


export const QuizContext = createContext<quizzerObject>({
        timeLimit: "",
        admin: "",
        questions: [],
        quizId: "",
        status: "open",
        URL: ""
})

export const useQuiz = ()=>useContext(QuizContext)