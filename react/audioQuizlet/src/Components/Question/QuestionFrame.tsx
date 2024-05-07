import { useEffect, useState } from "react";
import { AnswerObject, IndexArray, questionObject } from "../../types";
import LimitedPlayer from "../LimitedPlayer";
import MCQ from "./MCQ";
import SAQ from "./SAQ"
import IMGQ from "./IMGQ";

interface QuestionProps {
    question: questionObject,
    index: number,
    updater: (a: (x: IndexArray<AnswerObject>) => IndexArray<AnswerObject>) => void
}

export default function Question({question, index, updater} : QuestionProps) {

    const [answer, setAnswer] = useState<string>("");

    useEffect(()=>{
        if (answer) {
            updater((prev: IndexArray<AnswerObject>) => {
                const temp = {...prev};
                temp[index] = {answer: answer, score: 0}
                return temp;
            })
        }
        
    }, [answer, index, updater])

    function createQuestion(qType: string) {
        switch(qType) {
            case "multipleChoice":
                return <MCQ question={question} setAnswer={setAnswer}/>
            case "shortAnswer":
                return <SAQ setAnswer={setAnswer}/>
            case "photoUpload":
                return <IMGQ setAnswer={setAnswer}/>
            default:
                return <div>Not a Valid Question Type</div>
        }
    }


    return (
        <>
            <LimitedPlayer 
                limit={typeof question.limit === "number" ? question.limit : parseInt(question.limit)} 
                file={question.file}
                allowPause={false}/>
            <div className="questionForm">
                <h2>{question.title}</h2>
                <p><small>{question.pointsValue}</small></p>
                {createQuestion(question.type)}
            </div>
        </>
    )
}