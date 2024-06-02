import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import './UserQuizzes.css'
import Loader from "../Components/Loader";

type userQuiz = {
    title?: string, 
    description?: string, 
    URL: string, 
    created: string,
    length: number,
    timeLimit?: number
}

export default function UserQuizzes() {

    const {userId} = useParams();
    const [email, setEmail] = useState("")
    const [quizzes, setQuizzes] = useState<userQuiz[] | undefined>()
    const navigate = useNavigate()

    useEffect(()=>{
        axios.get(`https://audio-quizlet.vercel.app/api/users/${userId}/quizzes`)
                .then(response => {
                    if (response.status === 200) {
                        setQuizzes(response.data.quizzes)
                        setEmail(response.data.admin)
                    }
                })
                .catch(error => {
                    console.log(error)
                    navigate('/404')
                })
    }, [userId, navigate])

    return (
        <>
            <h2 style={{textAlign: "center", marginTop: "2rem"}}>Quizzes created by {email}</h2>
            <ul id="userQuizList">
                {quizzes
                    ? quizzes.map(quiz => 
                    (<li key={quiz.created} data-description={quiz.description || "No description..."}>
                        <span>
                            <Link to={quiz.URL}>{quiz.title || "Untitled Quiz"}</Link>
                        </span>
                        <span>{quiz.length} question{quiz.length > 1 ? "s" : ""} in {quiz.timeLimit ? quiz.timeLimit + " minutes" : "unlimited time"}</span>
                        <span><em>Created on {new Date(quiz.created).toLocaleString()}</em></span>
                    </li>))
                    : <Loader />
                }
            </ul>
            
        </>
    )
}