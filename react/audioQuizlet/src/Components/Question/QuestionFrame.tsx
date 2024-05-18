import { useEffect, useState } from "react";
import { AnswerObject, IndexArray, qType, quizzerQuestion } from "../../types";
import MCQ from "./MCQ";
import SAQ from "./SAQ"
import QuizPrompt from "./QuizPrompt";
import FileQ from "./FileQ";
import RECQ from "./RECQ";

interface QuestionProps {
    question: quizzerQuestion,
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

    function createQuestion(qType: qType) {
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
            <h3 style={{marginTop: "1rem"}}>Question {index+1}</h3>
            <p style={{marginBottom: "1rem"}}><small>{question.pointValue} point{question.pointValue > 1 ? "s" : ""}</small></p>
            {question.prompts.map((prompt, idx) => <QuizPrompt p={prompt} key={prompt.type+prompt.instructions+String(idx)} />)}
            <div className="questionForm">
                
                {createQuestion(question.response.type)}
            </div>
        </>
    )
}