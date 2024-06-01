import { createContext, useContext } from "react";
import { essentialQuiz } from "../types-new";

export const QuizContext = createContext<essentialQuiz>({
        timeLimit: null,
        questions: [],
        quizId: "",
        status: "open",
        title: "",
        description: ""
})

export const useQuiz = ()=>useContext(QuizContext)