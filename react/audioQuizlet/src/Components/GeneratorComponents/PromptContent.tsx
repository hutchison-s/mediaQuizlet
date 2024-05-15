import { useEffect, useState } from "react"
import { AudioPrompt, ImagePrompt, Prompt } from "../../types"
import AudioPromptBox from "./AudioPromptBox"
import TextPromptBox from "./TextPromptBox"
import ImagePromptBox from "./ImagePromptBox"

type PromptContentProps = {
    p: Prompt,
    update: (prompt: Prompt)=>void
}

export default function PromptContent({p, update}: PromptContentProps) {

    const [element, setElement] = useState<JSX.Element>()

    useEffect(()=>{
        if (p.type === "Audio") {
            setElement(<AudioPromptBox
                    p={p as AudioPrompt}
                    update={(newFile, isPausable, playLimit) => {
                        const updatedPrompt: AudioPrompt = { ...p, file: newFile, isPausable, playLimit };
                        update(updatedPrompt);
                    }}
                />
            );
        } else if (p.type === "Text") {
            setElement(
                <TextPromptBox
                    p={p}
                    update={(newString) => {
                        const updatedPrompt: Prompt = { ...p, instructions: newString };
                        update(updatedPrompt);
                    }}
                />
            );
        } else if (p.type === "Image") {
            setElement(
                <ImagePromptBox
                    p={p as ImagePrompt}
                    update={(newFile, timeLimit) => {
                        const updatedPrompt: ImagePrompt = { ...p, file: newFile, timeLimit };
                        update(updatedPrompt);
                    }}
                />
            );
        }
    }, [p])
    
    return element
}