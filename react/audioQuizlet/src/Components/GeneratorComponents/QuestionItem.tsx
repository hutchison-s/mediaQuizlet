import { ChangeEvent, useEffect, useState } from "react";
import { useItems } from "../../Context/ItemsContext";
import { generatorQuestion, qType } from "../../types";
import PromptBox from "./PromptBox";
import TextResponse from "./TextResponse";
import ChoiceResponse from "./ChoiceResponse";

type itemProps = {
    index: number,
    item: generatorQuestion
}

export default function QuestionItem({index, item}: itemProps) {

    const {swapPositions, updateItems, deleteItem, items} = useItems();
    const [responseElement, setResponseElement] = useState<JSX.Element | undefined>();

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

    useEffect(() => {
        let el;
        switch(item.response.type) {
            case "SA":
                el = <TextResponse response={item.response} update={(newString: string)=>{
                    const newItem = {...item};
                    newItem.response.correct = newString;
                    updateItems(index, newItem);
                }}/>;
                break;
            case "MC":
                el = <ChoiceResponse response={item.response} index={index} update={(newOptions: string[], correct: string | undefined)=>{
                    const newItem = {...item};
                    newItem.response.options = newOptions;
                    newItem.response.correct = correct;
                    updateItems(index, newItem);
                }}/>
                break;
            case "IMG":
                el = <div>Image Upload <i className="fa-solid fa-camera"></i></div>;
                break;
            default:
                el = <div>Audio Upload <i className="fa-solid fa-circle-play"></i></div>;
        }
        setResponseElement(el)
    }, [item])

    return (
        <div className="itemFrame">
            <div className="itemBox softCorner flex vertical pad2 shadow">
                <div className="itemHeader">
                    <div className="responseSelectFrame">
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
                    </div>
                    <h3>Question {index+1}</h3>
                    <button className="deleteItemButton" onClick={()=>{deleteItem(index)}}>Delete</button>
                </div>
                <h4 className="itemSectionHeader">Prompts</h4>
                {item.prompts.map((p, i)=><PromptBox key={"item"+i+item.response.type} item={item} itemIndex={index} promptIndex={i}/>)}
                <p><span onClick={addPrompt} className="newPromptButton"><i className="fa-solid fa-circle-plus"></i> Add Prompt</span></p>
                <h4 className="itemSectionHeader">Response</h4>
                {responseElement}
                <div className="itemFooter">
                    {index > 0 ? <button onClick={moveBack}><i className="fa-solid fa-arrow-left"></i></button> : <span></span>}
                    {items.length > 1 && <span> Move Question </span>}
                    {index < items.length -1 ? <button onClick={moveForward}><i className="fa-solid fa-arrow-right"></i></button> : <span></span>}
                </div>
            </div>
        </div>
    )
}