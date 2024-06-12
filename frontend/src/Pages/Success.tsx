import { useNavigate, useParams } from "react-router-dom"
import PageNotFound from "./PageNotFound";
import classroomIcon from '../assets/classroom.png'
import './Success.css'
import { useEffect, useState } from "react";
import axios from "axios";

export default function Success() {
    const {quizId} = useParams();
    const navigate = useNavigate();
    const quizLink = `https://www.mediaquizlet.com/quizzer/${quizId}`;
    const [quizInfo, setQuizInfo] = useState<{title: string, description: string}>({title: 'Media Quizlet', description: 'Your teacher created a quiz for you on Media Quizlet!'});

    useEffect(()=>{
        if (quizId && quizId !== 'responseSubmitted') {
            axios.get(`https://audio-quizlet.vercel.app/api/quizzes/${quizId}`)
                .then(res => {
                    const {title, description} = res.data;
                    setQuizInfo({title, description})
                })
                .catch(err =>{
                    console.log(err);    
                })
        }
            
        }, [])

    if (!quizId) {
        return <PageNotFound />
    }
    if (quizId === "responseSubmitted") {
        return <h2 style={{fontSize: "clamp(28px, 6vw, 60px)", textAlign: "center", padding: "5rem", position: 'fixed', top: '30%', width: '100vw'}}>Quiz Submitted Successfully!</h2>
    }

    const copyCode = ()=>{
        navigator.clipboard.writeText(quizId)
    }

    const copyLink = ()=>{
        navigator.clipboard.writeText(quizLink)
    }

    

    return (
        <div className="successWrap">
            <h2>Quizlet Successfully Created</h2>
            <p>Link to Quizlet:</p>
            <div>
                <a id="successLink" href={quizLink}>{quizLink}</a>
                <div>
                    
                        <button id="copyLink" onClick={copyLink} onKeyDown={e=>e.key==='Enter'&&copyLink()}><i className="fa-solid fa-copy"></i></button>
                        <a id='classroom' href={`https://classroom.google.com/share?url=${quizLink}&title=${encodeURIComponent(quizInfo.title)}&body=${encodeURIComponent(quizInfo.description)}`} aria-label="Add to Google Classroom">
                            <img src={classroomIcon} width='40px' alt="Add to Google Classroom"></img>
                        </a>
                </div>
            </div>
            <p>Quizlet Code:</p>
            <div>
                <p id="successCode">{quizId}</p>
                <button id="copyCode" onClick={copyCode} onKeyDown={e=>e.key==='Enter'&&copyCode()}><i className="fa-solid fa-copy"></i></button>
            </div>
            <button id="createAnother" onClick={()=>{navigate("/generator")}} className="softCorner primaryBtn">Create another Quizlet</button>
        
        </div>
    )
}