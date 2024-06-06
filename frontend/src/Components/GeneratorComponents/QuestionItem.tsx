import { ChangeEvent } from "react";
import PromptBox from "./PromptBox";
import ResponseBox from "./ResponseBox";
import { GenQuestion, GenResponseType } from "../../types-new";
import { useGenerator } from "../../Context/genContext";

type itemProps = {
    index: number,
    question: GenQuestion
}

export default function QuestionItem({index, question}: itemProps) {

    const {state, dispatch} = useGenerator();

    const addPrompt = ()=>{
        const newItem = {...question};
        newItem.prompts.push({file: undefined, type: "text", text: ""})
        dispatch({type: 'UPDATE_QUESTION', payload: newItem})
    }

    const changeType = (e:ChangeEvent<HTMLSelectElement>) => {
        const newItem = {
            ...question,
            response: {
                type: e.target.value as GenResponseType,
                correct: e.target.value == 'MC' ? '0' : '',
                options: e.target.value == 'MC' ? ['', '', '', ''] : undefined
            }
        };
        dispatch({type: 'UPDATE_QUESTION', payload: newItem})
    }

    const changePoints = (e:ChangeEvent<HTMLInputElement>) => {
        const newItem = {
            ...question,
            pointValue: e.target.value.includes(".") ? parseFloat(e.target.value) : parseInt(e.target.value)
        };
        dispatch({type: 'UPDATE_QUESTION', payload: newItem})
    }

    const moveBack = ()=>{
        dispatch({type: 'MOVE_QUESTION_UP', payload: question.id})
    }
    const moveForward = ()=>{
        dispatch({type: 'MOVE_QUESTION_DOWN', payload: question.id})
    }
    const deleteItem = ()=>{
        dispatch({type: 'REMOVE_QUESTION', payload: question.id})
    }
    const duplicateItem = ()=>{
        dispatch({type: 'DUPLICATE_QUESTION', payload: question.id})
    }

    return (
        <div className="itemFrame">
            <div className="itemBox softCorner flex vertical shadow">
            <h3>Question {index+1}</h3>
                <div className="itemHeader">
                        <select className="responseSelect" value={question.response.type} onChange={changeType}>
                            <option value="SA">Short Answer</option>
                            <option value="MC">Multiple Choice</option>
                            <option value="IMG">Image Upload</option>
                            <option value="AUD">Audio Upload</option>
                            <option value="REC">Audio Recording</option>
                        </select>
                        <label htmlFor="pointValue">
                            <span>Points: </span>
                            <input 
                                type="number" 
                                name="pointValue"
                                className="pointValue" 
                                id={index+"pointValue"} 
                                min={0} max={100} step={0.5}
                                value={question.pointValue}
                                onChange={changePoints}
                                required/>
                        </label>  
                    <button className="deleteItemButton" onClick={deleteItem}>Delete</button>
                </div>
                <h4 className="itemSectionHeader">Prompts</h4>
                {question.prompts.map((_, i)=><PromptBox key={question.id+"prompt"+i} question={question} promptIndex={i}/>)}
                <p><button onClick={addPrompt} className="newPromptButton" aria-label="Add a prompt"><i className="fa-solid fa-circle-plus"></i> Add Prompt</button></p>
                <h4 className="itemSectionHeader">Response</h4>
                <ResponseBox q={question} />
                <div className="itemFooter">
                    {index > 0 ? <button onClick={moveBack}><i className="fa-solid fa-arrow-left" aria-label="Shift question before the previous"></i></button> : <span></span>}
                    {state.questions.length > 1 && <span> Move Question </span>}
                    {index < state.questions.length - 1 ? <button onClick={moveForward} aria-label="Shift question after the next"><i className="fa-solid fa-arrow-right"></i></button> : <span></span>}
                    <button style={{gridColumn: "span 3", margin: "1rem auto"}} onClick={duplicateItem} aria-label="Duplicate Question"><i className="fa-solid fa-copy"></i></button>
                </div>
            </div>
        </div>
    )
}