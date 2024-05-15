import { ChangeEvent } from "react";
import { useItems } from "../../Context/ItemsContext";
import { generatorQuestion, qType } from "../../types";
import PromptBox from "./PromptBox";
import ResponseBox from "./ResponseBox";

type itemProps = {
    index: number,
    item: generatorQuestion
}

export default function QuestionItem({index, item}: itemProps) {

    const {swapPositions, updateItems, deleteItem, items} = useItems();

    const addPrompt = ()=>{
        const newItem = {...item};
        newItem.prompts.push({file: null, type: "Text", instructions: ""})
        updateItems(index, newItem)
    }

    const changeType = (e:ChangeEvent<HTMLSelectElement>) => {
        const newItem = {...item};
        newItem.response.type = e.target.value as qType;
        if (newItem.response.correct) delete newItem.response.correct;
        if (newItem.response.options) delete newItem.response.options;
        updateItems(index, newItem);
    }

    const changePoints = (e:ChangeEvent<HTMLInputElement>) => {
        const newItem = {...item};
        newItem.pointValue = e.target.value.includes(".") ? parseFloat(e.target.value) : parseInt(e.target.value);
        updateItems(index, newItem)
    }

    const moveBack = ()=>{
        swapPositions(index, index-1);
    }
    const moveForward = ()=>{
        swapPositions(index, index+1);
    }

    return (
        <div className="itemFrame">
            <div className="itemBox softCorner flex vertical shadow">
            <h3>Question {index+1}</h3>
                <div className="itemHeader">
                        <select className="responseSelect" value={item.response.type} onChange={changeType}>
                            <option value="SA">Short Answer</option>
                            <option value="MC">Multiple Choice</option>
                            <option value="AUD">Audio Response</option>
                            <option value="IMG">Image Response</option>
                        </select>
                        <label htmlFor="pointValue">
                            <span>Points: </span>
                            <input 
                                type="number" 
                                name="pointValue"
                                className="pointValue" 
                                id={index+"pointValue"} 
                                min={0} max={100} step={0.5}
                                value={item.pointValue}
                                onChange={changePoints}
                                required/>
                        </label>  
                    <button className="deleteItemButton" onClick={()=>{deleteItem(index)}}>Delete</button>
                </div>
                <h4 className="itemSectionHeader">Prompts</h4>
                {item.prompts.map((p, i)=><PromptBox key={"item"+i+item.response.type} item={item} itemIndex={index} promptIndex={i}/>)}
                <p><span onClick={addPrompt} className="newPromptButton"><i className="fa-solid fa-circle-plus"></i> Add Prompt</span></p>
                <h4 className="itemSectionHeader">Response</h4>
                <ResponseBox t={item.response.type} i={index} />
                <div className="itemFooter">
                    {index > 0 ? <button onClick={moveBack}><i className="fa-solid fa-arrow-left"></i></button> : <span></span>}
                    {items.length > 1 && <span> Move Question </span>}
                    {index < items.length -1 ? <button onClick={moveForward}><i className="fa-solid fa-arrow-right"></i></button> : <span></span>}
                </div>
            </div>
        </div>
    )
}