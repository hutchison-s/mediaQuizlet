import { useEffect, useState } from "react";
import { useItems } from "../../Context/ItemsContext";
import { AudioPrompt, ImagePrompt, Prompt, generatorQuestion } from "../../types";
import AudioPromptBox from "./AudioPromptBox";
import TextPromptBox from "./TextPromptBox";
import SelectPopUp from "../SelectPopUp";
import ImagePromptBox from "./ImagePromptBox";


type PromptBoxProps = {
    item: generatorQuestion,
    itemIndex: number,
    promptIndex: number
}

const qTypeList: string[] = ["Text", "Audio", "Image"]

const list: JSX.Element[] = [<i className="fa-solid fa-font"></i>, <i className="fa-solid fa-circle-play"></i>, <i className="fa-solid fa-image"></i>];

export default function PromptBox({ item, itemIndex, promptIndex }: PromptBoxProps) {
    const { updateItems } = useItems();
    const [element, setElement] = useState<JSX.Element | null>(null);

    const updatePrompt = (updatedPrompt: Prompt) => {
        const newItem = { ...item };
        newItem.prompts[promptIndex] = updatedPrompt;
        updateItems(itemIndex, newItem);
    };

    useEffect(() => {
        const prompt = item.prompts[promptIndex];
        let el: JSX.Element | null = null;

        if (prompt.type === "Audio") {
            el = (
                <AudioPromptBox
                    p={prompt as AudioPrompt}
                    update={(newFile, isPausable, playLimit) => {
                        const updatedPrompt: AudioPrompt = { ...prompt, file: newFile, isPausable, playLimit };
                        updatePrompt(updatedPrompt);
                    }}
                />
            );
        } else if (prompt.type === "Text") {
            el = (
                <TextPromptBox
                    value={prompt.instructions}
                    update={(newString) => {
                        const updatedPrompt: Prompt = { ...prompt, instructions: newString };
                        updatePrompt(updatedPrompt);
                    }}
                />
            );
        } else if (prompt.type === "Image") {
            el = (
                <ImagePromptBox
                    p={prompt as ImagePrompt}
                    update={(newFile, timeLimit) => {
                        const updatedPrompt: ImagePrompt = { ...prompt, file: newFile, timeLimit };
                        updatePrompt(updatedPrompt);
                    }}
                />
            );
        }

        setElement(el);
    }, [item, promptIndex]);

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
            <SelectPopUp value={qTypeList.indexOf(item.prompts[promptIndex].type)} list={list} sendIndex={receiveIndex} />
            {element}
            <div className="deletePrompt" onClick={removePrompt}>
                <i className="fa-solid fa-trash-can"></i>
            </div>
        </div>
    );
}
