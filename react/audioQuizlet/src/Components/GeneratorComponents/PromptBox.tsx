import { useItems } from "../../Context/ItemsContext";
import { AudioPrompt, ImagePrompt, Prompt, generatorQuestion } from "../../types";
import SelectPopUp from "../SelectPopUp";
import PromptContent from "./PromptContent";


type PromptBoxProps = {
    item: generatorQuestion,
    itemIndex: number,
    promptIndex: number
}

const qTypeList: string[] = ["Text", "Audio", "Image"]

const list: JSX.Element[] = [<i className="fa-solid fa-font"></i>, <i className="fa-solid fa-circle-play"></i>, <i className="fa-solid fa-image"></i>];

export default function PromptBox({ item, itemIndex, promptIndex }: PromptBoxProps) {
    const { updateItems } = useItems();

    const updatePrompt = (updatedPrompt: Prompt) => {
        const newItem = { ...item };
        newItem.prompts[promptIndex] = updatedPrompt;
        updateItems(itemIndex, newItem);
    };

    const resetPrompt = ()=>{
        if (item.prompts[promptIndex].type == "Text") {
            updatePrompt({ file: null, type: "Text", instructions: "" });
        } else if (item.prompts[promptIndex].type == "Audio") {
            updatePrompt({ file: null, type: "Audio", instructions: "", isPausable: false, playLimit: 3 } as AudioPrompt);
        } else {
            updatePrompt({ file: null, type: "Image", instructions: "", timeLimit: null } as ImagePrompt);
        }
    }

    const receiveIndex = (i: number) => {
        if (i === 0) {
            updatePrompt({ file: null, type: "Text", instructions: "" });
        } else if (i === 1) {
            updatePrompt({ file: null, type: "Audio", instructions: "", isPausable: false, playLimit: 3 } as AudioPrompt);
        } else {
            updatePrompt({ file: null, type: "Image", instructions: "", timeLimit: null } as ImagePrompt);
        }
    };

    const removePrompt = () => {
        const newItem = { ...item };
        newItem.prompts.splice(promptIndex, 1);
        updateItems(itemIndex, newItem);
    };

    return (
        <div className="promptBox">
            <PromptContent p={item.prompts[promptIndex]} update={updatePrompt}/>
            <div className="promptTools">
            <div className="deletePrompt" onClick={removePrompt}>
                    <i className="fa-solid fa-trash-can"></i>
                </div>
                {item.prompts[promptIndex].type !== "Text" && <button className="resetPrompt" onClick={resetPrompt}>
                    <i className="fa-solid fa-rotate-left"></i>
                </button>}
                <SelectPopUp value={qTypeList.indexOf(item.prompts[promptIndex].type)} list={list} sendIndex={receiveIndex} />
                
            </div>
        </div>
    );
}
