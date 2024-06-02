import { useNavigate, useParams } from "react-router-dom"
import PageNotFound from "./PageNotFound";
import './Success.css'

export default function Success() {
    const {quizId} = useParams();
    const navigate = useNavigate();
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
        navigator.clipboard.writeText(`https://audioquizlet.netlify.app/quizzer/${quizId}`)
    }

    return (
        <div className="successWrap">
            <h2>Quizlet Successfully Created</h2>
            <p>Link to Quizlet:</p>
            <div>
                <a id="successLink" href={`https://audioquizlet.netlify.app/quizzer/${quizId}`}>{`https://audioquizlet.netlify.app/quizzer/${quizId}`}</a>
                <button id="copyLink" onClick={copyLink}><i className="fa-solid fa-copy"></i></button>
            </div>
            <p>Quizlet Code:</p>
            <div>
                <p id="successCode">{quizId}</p>
                <button id="copyCode" onClick={copyCode}><i className="fa-solid fa-copy"></i></button>
            </div>
            <button id="createAnother" onClick={()=>{navigate("/generator")}} className="softCorner primaryBtn">Create another Quizlet</button>
        
        </div>
    )
}