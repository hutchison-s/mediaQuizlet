import { useEffect, useState } from "react";
import { AnswerObject, GenQuestion, userResponse } from "../types-new";
import QandA from "./QandA";

interface UserResponseProps {
    response: userResponse,
    questions: GenQuestion[],
    updateScore: (newScore: number, responseId: string, answerIndex: number)=>void
}
export default function UserResponse({response, questions, updateScore}: UserResponseProps) {

    const timeSpent = Math.round((parseInt(response.timeSubmitted!) - response.timeStarted!) / 1000)
    const [pointsEarned, setPointsEarned] = useState(0);
    const [pointsPossible, setPointsPossible] = useState(0);

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
                        <h3 className="userName">{response.user}</h3>
                        <p className="responseDetails"><em>Completed in {timeFormat(timeSpent)} seconds</em></p>
                        <p className="responseDetails"><em>Submitted {new Date(response.timeSubmitted!).toLocaleString()}</em></p>
                    </div>
                    <div>
                        <p>{pointsEarned} / {pointsPossible}</p>
                    </div>
                </div>
                {response.answers?.map((a, i)=>
                    <QandA q={questions[i]} a={a} i={i} key={response.responseId+String(i)} update={updateThis}/>
                )}
            </div>
        </>
    )
}