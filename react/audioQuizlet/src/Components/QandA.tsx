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
                return <p key={q.id+i+p.type}>{p.text}</p>
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
                        <p>Answered: {a.answer}</p>
                        <p>Correct answer: {q.response.correct}</p>
                    </>
                )
            case 'MC':
                return (
                    <>
                        <p>Answered: {q.response.options![parseInt(a.answer)]}</p>
                        <p>Correct answer: {q.response.options![parseInt(q.response.correct!)]}</p>
                    </>
                )
            case 'REC':
            case 'AUD':
                return (
                    <>
                        <p>Answered: </p>
                        <UnLimitedPlayer file={a.answer} />
                    </>
                )
            case 'IMG':
                return (
                    <>
                        <p>Answered: </p>
                        <img src={a.answer} alt="Quiz Response Photo Upload"  width='100%'/>
                    </>
                )
            default: {
                return <><p>Unnown response type</p></>
            }
        }
    }


    return (
        <div className="responseQuestion">
            <div className="questionHeader">
                <h4>Question {i + 1}</h4>
                <div><input type="number" min={0} max={q.pointValue} value={a.score} onChange={(e)=>{update(parseFloat(e.target.value), i)}}/> / {q.pointValue}</div>
            </div>
            {q.prompts.map(p=>
                renderPrompt(p)
            )}
            {<div className="responseAnswer">
                {renderAnswer()}
            </div>}
        </div>
    )
}