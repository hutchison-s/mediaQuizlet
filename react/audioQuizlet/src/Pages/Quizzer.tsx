import axios from "axios";
import "./Quizzer.css";
import Timer from "../Components/Timer";
import Quiz from "../Components/Quiz";
import QuizzerLogin from "../Components/QuizzerLogin";
import { useQuiz } from "../Context/QuizContext";
import { useNavigate } from "react-router-dom";
import { useResponse } from "../responseContext";
import { uploadFileAnswers } from "../Functions/apiCalls/images";
import { useState } from "react";
import Loader from "../Components/Loader";



export default function Quizzer() {

    const quiz = useQuiz();
    const {state, dispatch} = useResponse();
    const [isSubmitting, setIsSubmitting] = useState(false)

    const navigate = useNavigate()

    const onStart = async (s: string) => {
        axios.post(`http://localhost:8000/api/quizzes/${quiz.quizId}/responses`,
        {user: s, timeStarted: Date.now()})
            .then(res => {
                if (res.status === 200) {
                    const {user, responseId, timeStarted} = res.data;
                    dispatch({type: 'INITIALIZE', payload: {user, responseId, timeStarted}})
                }
            })
    }

   

    async function submitResponse() {
        setIsSubmitting(true)
        const [associatedFiles, newAnswers] = await uploadFileAnswers(quiz.questions, state.answers || []);
        console.log("sending", associatedFiles)
            const newResponse = {
                answers: newAnswers,
                associatedFiles: associatedFiles,
                timeSubmitted: Date.now()
            }
            axios.patch(`http://localhost:8000/api/quizzes/${state.quizId}/responses/${state.responseId}`, newResponse)
                .then(res => {
                    if (res.status === 200) {
                        localStorage.removeItem("currentQuizResponse:"+quiz.quizId)
                        navigate("/success/responseSubmitted")
                    }
                })
        
    }

    return (
        
            <div className="flex vertical even">
                {state.user
                    ?   isSubmitting
                            ?   <Loader />
                            :   <>
                                    <p><small id="currentUser">Quizzing as {state.user}</small></p>
                                    {quiz.timeLimit && <Timer timeStarted={state.timeStarted!} callback={submitResponse}/>}
                                    <Quiz handleSubmit={submitResponse} />
                                </>
                    :   <QuizzerLogin setUser={onStart} />
                }

            </div>
    )
}