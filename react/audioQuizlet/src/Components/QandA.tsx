import { AnswerObject, GenPrompt, GenQuestion } from "../types-new"
import UnLimitedPlayer from "./UnlimitedPlayer";

interface QandAProps {
    q: GenQuestion,
    a: AnswerObject,
    i: number,
    update: (newScore: number, answerIndex: number) => void
}

export default function QandA({q, a, i, update}: QandAProps) {

    const renderPrompt = (p: GenPrompt) => {
        switch(p.type) {
            case 'text':
                if (typeof(p.text) == 'object') {
                    return <div key={q.id+i+p.type}>{p.text.map((line: string, index: number) => <p key={index} style={{textAlign: 'left', width: '100%', lineHeight: '1.25'}} >{line}</p>)}</div>
                } else {
                    return <p key={q.id+i+p.type}>{p.text}</p>
                }
            case 'audio':
                return <UnLimitedPlayer file={p.path!}  key={q.id+i+p.type}/>;
            case 'image':
                return <img src={p.path} width='100%' key={q.id+i+p.type}></img>
            default:
                return <p key={q.id+i+p.type}>Unknown Prompt Type</p>
        }
    }

    const renderAnswer = () =>{
        switch(q.response.type) {
            case 'SA':
                return (
                    <>
                        <p className={a.score === q.pointValue ? "correctAnswer" : ""}><strong>Answered:</strong> {a.answer}</p>
                        <p><strong>Correct answer:</strong> {q.response.correct}</p>
                    </>
                )
            case 'MC':
                return (
                    <>
                        <p className={a.score === q.pointValue ? "correctAnswer" : ""}><strong>Answered:</strong> {q.response.options![parseInt(a.answer)]}</p>
                        <p><strong>Correct answer:</strong> {q.response.options![parseInt(q.response.correct!)]}</p>
                    </>
                )
            case 'REC':
            case 'AUD':
                return (
                    <>
                        <p className={a.score === q.pointValue ? "correctAnswer" : ""}><strong>Answered:</strong> </p>
                        <UnLimitedPlayer file={a.answer} />
                    </>
                )
            case 'IMG':
                return (
                    <>
                        <p className={a.score === q.pointValue ? "correctAnswer" : ""}><strong>Answered:</strong> </p>
                        <img src={a.answer} alt="Quiz Response Photo Upload"  width='100%'/>
                    </>
                )
            default: {
                return <><p>Unnown response type</p></>
            }
        }
    }

    const handleChange = (floatVal: number) => {
        if (floatVal < 0 || floatVal > q.pointValue) {
            return;
        }
        update(floatVal, i)
    }

    const inc = ()=>{
        handleChange(a.score+0.5)
    }
    const dec = ()=>{
        handleChange(a.score-0.5)
    }
    const fullPoints = ()=>{
        handleChange(q.pointValue)
    }





    return (
        <div className="responseQuestion">
            <div className="questionHeader">
                <h4>Question {i + 1}</h4>
                <div className="questionScore">
                    <span>{a.score}</span>
                     <span>/ {q.pointValue}</span>
                     <button onClick={dec}>-</button>
                     <button onClick={inc}>+</button>
                     <button onClick={fullPoints}><i className="fa-regular fa-circle-check"></i></button>
                     </div>
            </div>
            <div className="responsePromptBox">
                {q.prompts.map(p=>
                    renderPrompt(p)
                )}
            </div>
            {<div className="responseAnswer">
                {renderAnswer()}
            </div>}
        </div>
    )
}