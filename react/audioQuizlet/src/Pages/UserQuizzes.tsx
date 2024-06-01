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
        axios.get(`http://localhost:8000/api/users/${userId}/quizzes`)
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
                    ? quizzes.map(q => 
                    (<li key={q.created} data-description={q.description || "No description..."}>
                        <span>
                            <Link to={q.URL}>{q.title || "Untitled Quiz"}</Link>
                        </span>
                        <span>{q.length} question{q.length > 1 ? "s" : ""} in {q.timeLimit ? q.timeLimit + " minutes" : "unlimited time"}</span>
                        <span><em>Created on {new Date(q.created).toLocaleString()}</em></span>
                    </li>))
                    : <Loader />
                }
            </ul>
            
        </>
    )
}