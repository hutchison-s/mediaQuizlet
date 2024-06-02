import AudioPromptBox from "./AudioPromptBox"
import TextPromptBox from "./TextPromptBox"
import ImagePromptBox from "./ImagePromptBox"
import { GenPrompt } from "../../types-new"

type PromptContentProps = {
    p: GenPrompt,
    update: (prompt: GenPrompt)=>void
}

export default function PromptContent({p, update}: PromptContentProps) {

    switch(p.type) {
        case 'text':
            return <TextPromptBox
                    p={p}
                    update={(newString) => {
                        const updatedPrompt: GenPrompt = { ...p, text: newString };
                        update(updatedPrompt);
                    }}
                />
        case 'audio':
            return <AudioPromptBox
                    p={p}
                    update={(newFile, isPausable, playLimit) => {
                        const updatedPrompt: GenPrompt = { ...p, file: newFile, isPausable, playLimit };
                        update(updatedPrompt);
                    }}
                />;
        case 'image':
            return <ImagePromptBox
                    p={p}
                    update={(newFile, timeLimit) => {
                        const updatedPrompt: GenPrompt = { ...p, file: newFile, timeLimit };
                        update(updatedPrompt);
                    }}
                />
        default:
            throw new Error("Invalid prompt type found")
    }
}