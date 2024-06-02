import { PropsWithChildren, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { QuizContext } from "./QuizContext";
import { essentialQuiz } from "../types-new";
import Loader from "../Components/Loader";



export default function QuizProvider({children}: PropsWithChildren) {
    const [quiz, setQuiz] = useState<essentialQuiz>()
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    const {quizId} = useParams();

    useEffect(()=>{
        axios.get("https://audio-quizlet.vercel.app/api/quizzes/"+quizId)
            .then(res => {
                if (res.status === 200) {
                    const { timeLimit, questions, quizId, status, title, description } = res.data;
                    setQuiz({
                        timeLimit,
                        questions,
                        quizId,
                        status,
                        title,
                        description
                    })
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
                    ?   <Loader />
                    :   hasError && <h2>Error Loading Quiz</h2>
        
    )
}