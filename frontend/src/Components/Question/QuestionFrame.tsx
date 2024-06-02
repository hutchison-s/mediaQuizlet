import { useEffect, useState } from "react";
import MCQ from "./MCQ";
import SAQ from "./SAQ"
import QuizPrompt from "./QuizPrompt";
import FileQ from "./FileQ";
import RECQ from "./RECQ";
import { GenQuestion, GenResponseType } from "../../types-new";
import { useResponse } from "../../Context/responseContext";

interface QuestionProps {
    question: GenQuestion,
    index: number
}

export default function Question({question, index} : QuestionProps) {


    const {state, dispatch} = useResponse();
    const [answer, setAnswer] = useState<string>(['MC', 'SA'].includes(state.questions![index].response.type) ? state.answers![index].answer : "");

    const updateRemaining = (pIndex: number, remaining: number)=>{
        dispatch({type: 'UPDATE_PROMPT_REMAINING', payload: {qIndex: index, pIndex: pIndex, remaining: remaining}})
    }

    useEffect(()=>{
        dispatch({type: 'UPDATE_ANSWER', payload: {id: question.id, answer: {answer: answer, score: 0}}})
    }, [answer])

    function createQuestion(qType: GenResponseType) {
        switch(qType) {
            case "MC":
                return <MCQ question={question} setAnswer={setAnswer} initial={answer}/>
            case "SA":
                return <SAQ setAnswer={setAnswer} initial={answer}/>
            case "IMG":
                return <FileQ accept="image/*" setAnswer={setAnswer}/>
            case "AUD":
                return <FileQ accept="audio/*" setAnswer={setAnswer}/>
            case "REC":
                return <RECQ setAnswer={setAnswer}/>
            default:
                return <div>Not a Valid Question Type</div>
        }
    }


    return (
        <>
            <h3 style={{marginTop: "1rem"}}>Question {index + 1}</h3>
            <p style={{marginBottom: "1rem"}}><small>{question.pointValue} point{question.pointValue > 1 ? "s" : ""}</small></p>
            {question.prompts.map((prompt, idx) => <QuizPrompt p={prompt} i={idx} key={question.id+"prompt"+idx} updateRemaining={updateRemaining}/>)}
            <div className="questionForm">
                
                {createQuestion(question.response.type)}
            </div>
        </>
    )
}