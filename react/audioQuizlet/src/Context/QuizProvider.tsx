import { PropsWithChildren, useEffect, useState } from "react";
import { quizzerObject } from "../types";
import { useParams } from "react-router-dom";
import axios from "axios";
import { QuizContext } from "./QuizContext";



export default function QuizProvider({children}: PropsWithChildren) {
    const [quiz, setQuiz] = useState<quizzerObject | undefined>()
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    const {quizId} = useParams();

    useEffect(()=>{
        axios.get("http://localhost:8000/api/quizzes/"+quizId)
            .then(res => {
                if (res.status === 200) {
                    setQuiz(res.data)
                    setIsLoading(false);
                }
            })
            .catch(error => {
                console.log("Error trying to fetch quiz data: ", error)
                setHasError(true)
                setIsLoading(false)
            })
    }, [quizId])


    return (

        quiz
            ?   <QuizContext.Provider 
                    value={{...quiz}} >
                    {children}
                </QuizContext.Provider>
            :   isLoading
                    ?   <h2>Loading...</h2>
                    :   hasError && <h2>Error Loading Quiz</h2>
        
    )
}