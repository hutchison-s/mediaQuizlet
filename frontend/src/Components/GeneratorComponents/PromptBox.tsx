import { useGenerator } from "../../Context/genContext";
import { GenPrompt, GenQuestion } from "../../types-new";
import SelectPopUp from "../SelectPopUp";
import PromptContent from "./PromptContent";


type PromptBoxProps = {
    question: GenQuestion
    promptIndex: number
}

const qTypeList: string[] = ["text", "audio", "image"]

const list: JSX.Element[] = [<i className="fa-solid fa-font"></i>, <i className="fa-solid fa-circle-play"></i>, <i className="fa-solid fa-image"></i>];

export default function PromptBox({ question, promptIndex }: PromptBoxProps) {
    const { dispatch } = useGenerator();

    const updatePrompt = (updatedPrompt: GenPrompt) => {
        const newItem = { ...question };
        newItem.prompts[promptIndex] = updatedPrompt;
        dispatch({type: 'UPDATE_QUESTION', payload: newItem})
    };

    const resetPrompt = ()=>{
        if (question.prompts[promptIndex].type === "text") {
            updatePrompt({ type: "text", text: "" });
        } else if (question.prompts[promptIndex].type === "audio") {
            updatePrompt({ type: "audio", isPausable: false, playLimit: 3 });
        } else {
            updatePrompt({ type: "image" });
        }
    }

    const receiveIndex = (i: number) => {
        if (i === 0) {
            updatePrompt({ type: "text", text: "" });
        } else if (i === 1) {
            updatePrompt({ type: "audio", isPausable: false, playLimit: 3 });
        } else {
            updatePrompt({ type: "image" });
        }
    };

    const removePrompt = () => {
        const newItem = {
            ...question };
        newItem.prompts.splice(promptIndex, 1);
        dispatch({type: 'UPDATE_QUESTION', payload: newItem})
    };

    return (
        <div className="promptBox">
            <PromptContent p={question.prompts[promptIndex]} update={updatePrompt}/>
            <div className="promptTools">
            <button className="deletePrompt" onClick={removePrompt} aria-label="Delete Prompt">
                    <i className="fa-solid fa-trash-can"></i>
                </button>
                {question.prompts[promptIndex].type !== "text" && <button className="resetPrompt" onClick={resetPrompt} tabIndex={0} aria-label="Reset Prompt">
                    <i className="fa-solid fa-rotate-left"></i>
                </button>}
                <SelectPopUp value={qTypeList.indexOf(question.prompts[promptIndex].type)} list={list} sendIndex={receiveIndex} />
                
            </div>
        </div>
    );
}
