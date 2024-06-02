import { useNavigate, useParams } from "react-router-dom";
import ViewerLogin from "../Components/ViewerLogin";
import './Viewer.css'
import axios from "axios";
import { useState } from "react";
import { fullQuiz, userResponse } from "../types-new";
import QuizResponses from "../Components/QuizResponses";
import Loader from "../Components/Loader";

export default function Viewer() {

    const {quizId} = useParams<string>();
    const [quiz, setQuiz] = useState<fullQuiz>()
    const [responses, setResponses] = useState<userResponse[]>()
    const [auth, setAuth] = useState("")
    const [error, setError] = useState<number | undefined>()
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    const handleLogin = (user: string, pass: string) => {

        const encoding = btoa(`${encodeURIComponent(quizId!)}:${encodeURIComponent(pass)}`);
        setAuth(`Basic ${encoding}`);
        axios.get(`http://localhost:8000/api/quizzes/${quizId}/admin`, {
            headers: {
                Authorization: `Basic ${encoding}`
            }
        }).then(res => {
            if (res.status == 200 && res.data.admin === user) {
              return res.data
            } else {
              throw new Error("Not authorized");
            }
          })
          .then((quizObject) => {
            setQuiz(quizObject)
            axios.get(`http://localhost:8000/api/quizzes/${quizId}/responses`, {
                headers: {
                    Authorization: `Basic ${encoding}`
                }
            }).then(res =>{
                if (res.status == 200) {
                    setResponses(res.data)
                }
            })
          })
          .catch(err => {
            console.log(err)
            setError(401);
            setTimeout(()=>{
                setError(undefined)
            }, 2000)
          })
    }

    const updateStatus = ()=>{
        axios.patch(`http://localhost:8000/api/quizzes/${quizId}/admin`, {status: quiz?.status === 'open' ? 'closed' : 'open'}, {
            headers: {
                "Authorization": auth,
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.status === 200) {
                setQuiz(res.data)
            } else {
                throw new Error("Invalid response: "+res.status)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const resetQuiz = ()=>{
        const goOn = confirm("Clicking ok will erase all responses and reset the quiz. Responses cannot be recovered. Do you wish to continue?")
        if (!goOn) {
            return;
        }
        setIsLoading(true)
        axios.patch(`http://localhost:8000/api/quizzes/${quizId}/admin`, {reset: true}, {
            headers: {
                "Authorization": auth,
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.status === 200) {
                setQuiz(res.data)
                setResponses(res.data.responses)
                setIsLoading(false)
            } else {
                throw new Error("Invalid response: "+res.status)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const deleteQuiz = ()=>{
        const goOn = confirm("Clicking ok will permanently delete the quiz. Quizzes cannot be recovered once they are deleted. Do you wish to continue?")
        if (!goOn) {
            return;
        }
        setIsLoading(true)
        axios.delete(`http://localhost:8000/api/quizzes/${quizId}/admin`, {
            headers: {
                "Authorization": auth
            }
        }).then(res => {
            if (res.status === 200) {
                navigate("/")
            } else {
                throw new Error("Invalid response: "+res.status)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const updateScore = (newScore: number, responseId: string, answerIndex: number)=>{
        const maxPoints = quiz?.questions[answerIndex].pointValue
        if (maxPoints && (newScore < 0 || newScore > maxPoints)) {
            return;
        }
        const prevAnswers = responses!.filter(r => r.responseId === responseId)[0].answers;
        const updated = prevAnswers?.map((a, i)=>i == answerIndex ? {...a, score: newScore} : a);
        setResponses(state => {
            return state?.map(r => r.responseId === responseId ? {...r, answers: updated} : r)
        })
        axios.patch(`http://localhost:8000/api/quizzes/${quizId}/responses/${responseId}`, {scores: updated}, {
            headers: {
                Authorization: auth,
                "Content-Type": "application/json"
            }
        })
        
    }

    const deleteResponse = (responseId: string)=>{
        axios.delete(`http://localhost:8000/api/quizzes/${quizId}/responses/${responseId}`, {
            headers: {
                Authorization: auth
            }
        })
        setResponses(prev => {
            return prev?.filter(res => res.responseId !== responseId)
        })
    }

    return (
        quiz && responses
            ?   <section className="responseContainer">
                {isLoading && <Loader />}
                    <div className="quizHeader">
                        <h2>{quiz.title || "Untitled Quiz"}</h2>
                        <p>{quiz.questions.length} Questions, worth {quiz.questions.reduce((sum, q)=>sum+q.pointValue, 0)} points</p>
                        <p>{responses.length} Response{responses.length !== 1 ? "s" : ""}</p>
                        <p><small>{quiz.description}</small></p>
                    </div>
                    <div className="quizAdminOptions">
                        <button className="primaryBtn" onClick={updateStatus}>{quiz.status === "open" ? "Close" : "Open"} Quiz</button>
                        <button className="secondaryBtn" onClick={resetQuiz}>Reset Quiz</button>
                        <button className="warningButton" onClick={deleteQuiz}>Delete Quiz</button>
                    </div>
                    <QuizResponses questions={quiz.questions} responses={responses!} updateScore={updateScore} deleteResponse={deleteResponse}/>
                </section>
            :   <ViewerLogin login={handleLogin} error={error} />
    )
}