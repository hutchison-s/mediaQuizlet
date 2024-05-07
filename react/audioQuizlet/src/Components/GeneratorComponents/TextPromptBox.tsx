import { ChangeEvent } from "react";

type TextPromptProps = {
    value: string,
    update: (newValue: string)=>void;
}
export default function TextPromptBox({value, update}: TextPromptProps) {
    return (
        <div className="textPrompt">
            <textarea
                placeholder="Instructions or Text Prompt..." 
                rows={4}
                value={value} 
                onChange={(event:ChangeEvent<HTMLTextAreaElement>)=>{update(event.target.value)}}/>
        </div>
    )
}