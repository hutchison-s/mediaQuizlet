import { useEffect, useState } from "react";
import { AnswerObject, GenQuestion, userResponse } from "../types-new";
import QandA from "./QandA";

interface UserResponseProps {
    response: userResponse,
    questions: GenQuestion[],
    updateScore: (newScore: number, responseId: string, answerIndex: number)=>void
    deleteResponse: (responseId: string)=>void
}
export default function UserResponse({response, questions, updateScore, deleteResponse}: UserResponseProps) {

    const timeSpent = Math.round((parseInt(response.timeSubmitted!) - response.timeStarted!) / 1000)
    const [pointsEarned, setPointsEarned] = useState(0);
    const [pointsPossible, setPointsPossible] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const timeFormat = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins > 0 ? mins+" mins and " : ""}${secs} seconds`
    }

    useEffect(()=>{
        if (questions) {
            const possible = questions.reduce((sum: number, q: GenQuestion)=> sum + q.pointValue, 0);
            setPointsPossible(possible)
        }
        if (response) {
            const earned = response.answers!.reduce((sum: number, a: AnswerObject)=>sum + a.score, 0);
            setPointsEarned(earned)
        }
        
    }, [questions, response])

    const updateThis = (newScore: number, answerIndex: number) => {
            updateScore(newScore, response.responseId!, answerIndex)
    }

    

    return (
        <>
            <div className="responseBox">
                <div className="responseHeader">
                    <div>
                        <div className="flex gapMedium">
                            <h3 className="userName">{response.user}</h3>
                            <button className="warningButton softCorner" onClick={()=>{deleteResponse(response.responseId!)}}><i className="fa-solid fa-trash-can"></i></button>
                        </div>
                        {response.timeSubmitted
                            ?   <>
                                    <p className="responseDetails"><em>Completed in {timeFormat(timeSpent)}</em></p>
                                    <p className="responseDetails"><em>Submitted {new Date(response.timeSubmitted!).toLocaleString()}</em></p>
                                </>
                            :   <p>Has not submitted response</p>
                        }
                        
                    </div>
                    <div className="userScore">
                        {response.timeSubmitted && <p>{pointsEarned} / {pointsPossible}</p>}
                        <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}><button className={`toggleAnswers ${isOpen ? "open" : ""}`} onClick={()=>{setIsOpen(current => !current)}}><i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`}></i></button></div>
                    </div>
                </div>
                    {isOpen && response.answers?.map((a, i)=>
                        <QandA q={questions[i]} a={a} i={i} key={response.responseId+String(i)} update={updateThis}/>
                    )}
            </div>
        </>
    )
}