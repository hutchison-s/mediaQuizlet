import { useEffect, useState } from "react";
import MCQ from "./MCQ";
import SAQ from "./SAQ"
import QuizPrompt from "./QuizPrompt";
import FileQ from "./FileQ";
import RECQ from "./RECQ";
import { GenQuestion, GenResponseType } from "../../types-new";
import { useResponse } from "../../responseContext";

interface QuestionProps {
    question: GenQuestion,
    index: number
}

export default function Question({question, index} : QuestionProps) {

    const [answer, setAnswer] = useState<string>("");
    const {dispatch} = useResponse();


    useEffect(()=>{
        dispatch({type: 'UPDATE_ANSWER', payload: {id: question.id, answer: {answer: answer, score: 0}}})
    }, [answer])

    function createQuestion(qType: GenResponseType) {
        switch(qType) {
            case "MC":
                return <MCQ question={question} setAnswer={setAnswer}/>
            case "SA":
                return <SAQ setAnswer={setAnswer}/>
            case "IMG":
                return <FileQ accept="image/*" setAnswer={setAnswer}/>
            case "AUD":
                return <FileQ accept="audio/*" setAnswer={setAnswer}/>
            case "REC":
                return <RECQ setAnswer={setAnswer} />
            default:
                return <div>Not a Valid Question Type</div>
        }
    }


    return (
        <>
            <h3 style={{marginTop: "1rem"}}>Question {index + 1}</h3>
            <p style={{marginBottom: "1rem"}}><small>{question.pointValue} point{question.pointValue > 1 ? "s" : ""}</small></p>
            {question.prompts.map((prompt, idx) => <QuizPrompt p={prompt} key={question.id+"prompt"+idx} />)}
            <div className="questionForm">
                
                {createQuestion(question.response.type)}
            </div>
        </>
    )
}