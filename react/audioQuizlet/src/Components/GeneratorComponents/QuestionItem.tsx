import { useEffect, useState } from "react";
import { useItems } from "../../Context/ItemsContext";
import { generatorQuestion } from "../../types";
import PromptBox from "./PromptBox";
import TextResponse from "./TextResponse";
import ChoiceResponse from "./ChoiceResponse";

type itemProps = {
    index: number,
    item: generatorQuestion
}

export default function QuestionItem({index, item}: itemProps) {

    const {updateItems, deleteItem} = useItems();
    const [element, setElement] = useState<JSX.Element | undefined>();

    

    const addPrompt = ()=>{
        const newItem = {...item};
        newItem.prompts.push({file: null, type: "Text", instructions: ""})
        updateItems(index, newItem)
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
        setElement(el)
    }, [item])

    return (
        <div className="itemFrame">
            
            <div className="itemBox softCorner flex vertical pad2 shadow">
                <div className="itemHeader">
                    <h3>Question {index+1}</h3>
                    <button className="deleteItemButton" onClick={()=>{deleteItem(index)}}>Delete</button>
                </div>
                <h4 className="itemSectionHeader">Prompts</h4>
                {item.prompts.map((p, i)=><PromptBox key={"item"+i+item.response.type} item={item} itemIndex={index} promptIndex={i}/>)}
                <p><span onClick={addPrompt} className="newPromptButton"><i className="fa-solid fa-circle-plus"></i> Add Prompt</span></p>
                <h4 className="itemSectionHeader">Response</h4>
                {element}
            </div>
        </div>
    )
}